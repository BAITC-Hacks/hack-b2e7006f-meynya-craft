import {
  fieldLabels,
  type CardApiResult,
  type CardRequest,
  type TaskAnalysis,
  type TaskCard,
  type TaskFieldKey,
  type TaskScore,
} from "./types";

type BackendGap = { field: TaskFieldKey; description: string };
type BackendQuestion = { field: TaskFieldKey; question: string };

export class TaskApiError extends Error {
  constructor(message: string, public readonly retryable: boolean) {
    super(message);
    this.name = "TaskApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isField(value: unknown): value is TaskFieldKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(fieldLabels, value);
}

async function post(path: string, body: unknown): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new TaskApiError("Не удалось связаться с сервером. Проверьте подключение и повторите попытку.", true);
  }

  let value: unknown;
  try {
    value = await response.json();
  } catch {
    throw new TaskApiError("Сервер вернул некорректный ответ. Повторите попытку.", response.status >= 500);
  }

  if (!response.ok) {
    const message = isRecord(value) && typeof value.error === "string"
      ? value.error
      : "Не удалось выполнить запрос. Повторите попытку.";
    const retryable = isRecord(value) && typeof value.retryable === "boolean"
      ? value.retryable
      : response.status >= 500;
    throw new TaskApiError(message, retryable);
  }
  return value;
}

function readAnalysis(value: unknown): TaskAnalysis {
  if (!isRecord(value) || !Array.isArray(value.gaps) || !Array.isArray(value.questions)) {
    throw new TaskApiError("Сервер вернул некорректный анализ задачи.", true);
  }

  const gaps: BackendGap[] = value.gaps.map((gap) => {
    if (!isRecord(gap) || !isField(gap.field) || typeof gap.description !== "string") {
      throw new TaskApiError("Сервер вернул некорректный анализ задачи.", true);
    }
    return { field: gap.field, description: gap.description };
  });
  const gapByField = new Map(gaps.map((gap) => [gap.field, gap.description]));
  const questions: BackendQuestion[] = value.questions.map((question) => {
    if (!isRecord(question) || !isField(question.field) || typeof question.question !== "string") {
      throw new TaskApiError("Сервер вернул некорректные уточняющие вопросы.", true);
    }
    return { field: question.field, question: question.question };
  });

  const keys = Object.keys(fieldLabels) as TaskFieldKey[];
  const fields = Object.fromEntries(
    keys.map((key) => [key, gapByField.has(key) ? "missing" : "complete"]),
  ) as TaskAnalysis["fields"];
  return {
    completeness: Math.round(((keys.length - gaps.length) / keys.length) * 100),
    fields,
    questions: questions.map((question) => ({
      id: question.field,
      field: question.field,
      question: question.question,
      helperText: gapByField.get(question.field),
    })),
  };
}

function readCard(value: unknown): CardApiResult {
  if (!isRecord(value) || !isRecord(value.card) || !isRecord(value.score)) {
    throw new TaskApiError("Сервер вернул некорректную карточку задачи.", true);
  }
  const card = value.card;
  const textFields = Object.keys(fieldLabels) as TaskFieldKey[];
  if (
    typeof card.id !== "string" ||
    !textFields.every((field) => typeof card[field] === "string") ||
    typeof card.score !== "number" ||
    !["draft", "published", "in_progress"].includes(String(card.status)) ||
    !Array.isArray(card.proposals) ||
    typeof value.score.total !== "number" ||
    !Array.isArray(value.score.categories) ||
    !Array.isArray(value.score.hints)
  ) {
    throw new TaskApiError("Сервер вернул некорректную карточку задачи.", true);
  }
  return { card: card as TaskCard, score: value.score as TaskScore };
}

export async function analyzeTask(description: string): Promise<TaskAnalysis> {
  return readAnalysis(await post("/api/analyze", { text: description }));
}

export async function generateTaskCard(request: CardRequest): Promise<CardApiResult> {
  const answers = request.analysis.questions
    .filter((question) => Object.prototype.hasOwnProperty.call(request.answers, question.id))
    .map((question) => ({ field: question.field, answer: request.answers[question.id] }));
  return readCard(await post("/api/card", { text: request.description, answers }));
}
