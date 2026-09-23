import type { ScoreResult } from "@/lib/score";
import type { TaskCard as BackendTaskCard } from "@/lib/types";

type TaskCardContent = Omit<BackendTaskCard, "id" | "score" | "level" | "status" | "proposals">;

export const fieldLabels = {
  title: "Название", topic: "Тема", context: "Бизнес-контекст", need: "Бизнес-потребность", users: "Целевые пользователи",
  data: "Доступные данные", expectedResult: "Ожидаемый результат", successCriteria: "Критерии успеха",
  constraints: "Ограничения", contact: "Контактное лицо", interactionFormat: "Формат взаимодействия",
} as const satisfies Record<keyof TaskCardContent, string>;
export type TaskFieldKey = keyof typeof fieldLabels;
export type TaskFieldStatus = "complete" | "partial" | "missing";
export type ClarifyingQuestion = { id: string; field: TaskFieldKey; question: string; helperText?: string };
export type TaskAnalysis = { completeness: number; fields: Record<TaskFieldKey, TaskFieldStatus>; questions: ClarifyingQuestion[] };
export type ClarificationAnswers = Record<string, string>;
export type TaskCard = BackendTaskCard;
export type TaskScore = ScoreResult;
export type CardField = TaskFieldKey;
export type CardRequest = { description: string; analysis: TaskAnalysis; answers: ClarificationAnswers };
export type CardApiResult = { card: TaskCard; score: TaskScore };
export type CreateTaskStep = "describe" | "clarify" | "review";
