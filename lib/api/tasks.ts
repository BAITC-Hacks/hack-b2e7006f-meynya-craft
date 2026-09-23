import type { TaskAnswer } from "../ai";
import type { TaskCard } from "../types";
import { calculateScore } from "../score";
import type { ScoreResult } from "../score";
import { useTaskStore } from "../store";

export class TaskApiError extends Error {
  constructor(message: string, public readonly retryable: boolean) {
    super(message);
    this.name = "TaskApiError";
  }
}

// Call from the browser after clarification. This saves a draft, never publishes it.
// Keep the returned card.id for editing and explicit confirmation with publishTask().
export async function createTaskDraft(
  text: string,
  answers: TaskAnswer[],
): Promise<{ card: TaskCard; score: ScoreResult }> {
  let response: Response;
  try {
    response = await fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, answers }),
    });
  } catch {
    throw new TaskApiError("Не удалось связаться с сервером. Повторите запрос.", true);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new TaskApiError("Сервер вернул некорректный JSON. Повторите запрос.", true);
  }
  if (!response.ok) {
    throw new TaskApiError(
      typeof result?.error === "string" ? result.error : "Не удалось создать карточку.",
      result?.retryable === true,
    );
  }

  // Validate the text fields before touching state. Score/level are recalculated locally.
  const card = result?.card;
  const textFields = ["title", "topic", "context", "need", "users", "data", "constraints",
    "expectedResult", "successCriteria", "contact", "interactionFormat"] as const;
  if (!card || typeof card.id !== "string" || !card.id.trim() ||
      textFields.some((field) => typeof card[field] !== "string")) {
    throw new TaskApiError("Сервер вернул неполную карточку. Повторите запрос.", true);
  }

  useTaskStore.getState().addDraft(card);
  const saved = useTaskStore.getState().tasks.find((task) => task.id === card.id)!;
  return { card: saved, score: calculateScore(saved) };
}
