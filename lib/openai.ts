import OpenAI from "openai";

let client: OpenAI | undefined;
let backupClient: OpenAI | undefined;
let primaryQuotaRetryAt = 0;
const QUOTA_RECHECK_MS = 5 * 60 * 1000;

// Call only from server-side code. Initialization is deferred until the first request.
export function getOpenAIClient(useBackup = false): OpenAI {
  if (typeof window !== "undefined") {
    throw new Error("OpenAI доступен только на сервере.");
  }

  const existingClient = useBackup ? backupClient : client;
  if (existingClient) return existingClient;

  const envName = useBackup ? "OPENAI_API_KEY_BACKUP" : "OPENAI_API_KEY";
  const apiKey = process.env[envName]?.trim();
  if (!apiKey) {
    throw new Error(`Добавьте ${envName} в .env.local на сервере.`);
  }

  const newClient = new OpenAI({ apiKey, timeout: 30_000, maxRetries: 1 });
  if (useBackup) backupClient = newClient;
  else client = newClient;
  return newClient;
}

function isQuotaExhausted(error: unknown): boolean {
  return error instanceof OpenAI.APIError && error.status === 429 &&
    (error.code === "insufficient_quota" || error.code === "credit_balance_exhausted");
}

// General text helper; TaskCard validation and deterministic scoring stay separate.
export async function generateAIText(
  input: string,
  instructions?: string,
): Promise<string> {
  if (!input.trim()) {
    throw new Error("Текст запроса не должен быть пустым.");
  }

  const model = process.env.OPENAI_MODEL?.trim();
  if (!model) {
    throw new Error("Добавьте OPENAI_MODEL в .env.local на сервере.");
  }

  const request = {
    model,
    input: input.trim(),
    instructions,
    max_output_tokens: 1500,
    store: false,
  };

  const hasBackup = Boolean(process.env.OPENAI_API_KEY_BACKUP?.trim()) &&
    process.env.OPENAI_API_KEY_BACKUP?.trim() !== process.env.OPENAI_API_KEY?.trim();
  const useBackup = hasBackup && Date.now() < primaryQuotaRetryAt;
  const response = await getOpenAIClient(useBackup).responses.create(request).catch(
    async (error: unknown) => {
      // Never switch keys for rate limits, invalid keys, or network/server errors.
      if (useBackup || !hasBackup || !isQuotaExhausted(error)) throw error;

      // In-memory cooldown per server process; retry the primary after five minutes.
      primaryQuotaRetryAt = Date.now() + QUOTA_RECHECK_MS;
      return getOpenAIClient(true).responses.create(request);
    },
  );

  if (response.status !== "completed") {
    throw new Error("OpenAI не завершил ответ. Повторите запрос или сократите его.");
  }

  const text = response.output_text.trim();
  if (!text) {
    throw new Error("OpenAI вернул пустой текстовый ответ.");
  }

  return text;
}
