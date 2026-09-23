import { z } from "zod";
import { analyzeTask, rawTextSchema } from "@/lib/ai";

export const runtime = "nodejs";

const requestSchema = z.object({ text: rawTextSchema }).strict();

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Тело запроса должно быть корректным JSON.", retryable: false }, { status: 400 });
  }

  const input = requestSchema.safeParse(body);
  if (!input.success) {
    return Response.json({ error: "Передайте text: текст задачи от 1 до 15000 символов.", retryable: false }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY?.trim() || !process.env.OPENAI_MODEL?.trim()) {
    return Response.json({ error: "AI не настроен на сервере. Проверьте ключ и модель.", retryable: false }, { status: 503 });
  }

  try {
    const analysis = await analyzeTask(input.data.text);
    return Response.json(analysis);
  } catch {
    // Do not expose provider errors: they can contain credentials or request data.
    return Response.json({ error: "Не удалось проанализировать задачу. Повторите запрос.", retryable: true }, { status: 502 });
  }
}
