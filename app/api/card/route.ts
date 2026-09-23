import { z } from "zod";
import { answerSchema, buildTaskCard, rawTextSchema } from "@/lib/ai";
import { calculateScore } from "@/lib/score";

export const runtime = "nodejs";

const requestSchema = z.object({
  text: rawTextSchema,
  answers: z.array(answerSchema).max(11).refine(
    (answers) => new Set(answers.map((answer) => answer.field)).size === answers.length,
    "Для каждого поля допустим только один ответ.",
  ),
}).strict();

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Тело запроса должно быть корректным JSON.", retryable: false }, { status: 400 });
  }

  const input = requestSchema.safeParse(body);
  if (!input.success) {
    return Response.json({
      error: "Передайте text (1–15000 символов) и answers: массив до 11 ответов { field, answer }. Поля не должны повторяться; ответ — до 3000 символов. Если ответов нет, передайте [].",
      retryable: false,
    }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY?.trim() || !process.env.OPENAI_MODEL?.trim()) {
    return Response.json({ error: "AI не настроен на сервере. Проверьте ключ и модель.", retryable: false }, { status: 503 });
  }

  try {
    const card = await buildTaskCard(input.data.text, input.data.answers);
    return Response.json({ card, score: calculateScore(card) });
  } catch {
    return Response.json({ error: "Не удалось собрать карточку. Повторите запрос.", retryable: true }, { status: 502 });
  }
}
