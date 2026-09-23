// Frontend-only contract until teammate B supplies lib/types.ts.
export const fieldLabels = {
  context: "Business context", businessNeed: "Business need", users: "Target users",
  data: "Available data", expectedResult: "Expected result", successCriteria: "Success criteria",
  constraints: "Constraints", contact: "Business contact", collaborationFormat: "Collaboration format",
} as const;
export type TaskFieldKey = keyof typeof fieldLabels;
export type TaskFieldStatus = "complete" | "partial" | "missing";
export type ClarifyingQuestion = { id: string; field: TaskFieldKey; question: string; helperText?: string };
export type TaskAnalysis = { completeness: number; fields: Record<TaskFieldKey, TaskFieldStatus>; questions: ClarifyingQuestion[] };
export type ClarificationAnswers = Record<string, string>;
export type TaskCard = { id: string; title: string } & Record<TaskFieldKey, string>;
export type CardField = "title" | TaskFieldKey;
export type CardRequest = { description: string; analysis: TaskAnalysis; answers: ClarificationAnswers };
export type ApiResult<T> = { value: T; demo: boolean };
export type CreateTaskStep = "describe" | "clarify" | "review";
