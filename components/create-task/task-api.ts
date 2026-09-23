import { demoAnalysis, demoCard } from "./demo";
import { fieldLabels, type ApiResult, type CardRequest, type TaskAnalysis, type TaskCard, type TaskFieldKey } from "./types";

const keys = Object.keys(fieldLabels) as TaskFieldKey[];
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
// Checks the UI boundary only; AI response validation belongs to teammate B.
export function readAnalysis(value: unknown): TaskAnalysis {
  if (record(value) && record(value.analysis)) value = value.analysis;
  if (!record(value) || !record(value.fields) || !Array.isArray(value.questions)) throw new Error("Invalid analysis response");
  const fields = value.fields;
  if (!keys.every(key => ["complete", "partial", "missing"].includes(String(fields[key])))) throw new Error("Invalid analysis fields");
  const ids = new Set<string>();
  for (const q of value.questions) {
    if (!record(q) || typeof q.id !== "string" || !q.id || ids.has(q.id) || !keys.includes(q.field as TaskFieldKey) || typeof q.question !== "string" || !q.question.trim() || (q.helperText !== undefined && typeof q.helperText !== "string")) throw new Error("Invalid question");
    ids.add(q.id);
  }
  if (typeof value.completeness !== "number" || !Number.isFinite(value.completeness) || value.completeness < 0 || value.completeness > 100) throw new Error("Invalid completeness");
  return value as TaskAnalysis;
}
export function readCard(value: unknown): TaskCard {
  if (record(value) && record(value.card)) value = value.card;
  if (!record(value)) throw new Error("Invalid card response");
  for (const key of ["title", ...keys]) if (value[key] != null && typeof value[key] !== "string") throw new Error("Invalid card field");
  return { id: typeof value.id === "string" ? value.id : "task-draft", ...Object.fromEntries(["title", ...keys].map(key => [key, value[key] ?? ""])) } as TaskCard;
}
async function post(path: string, body: unknown): Promise<unknown | null> {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  // Only absent/unimplemented routes use the demo. Real failures remain retryable errors.
  if (response.status === 404 || response.status === 501) return null;
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}
export async function analyzeTask(description: string): Promise<ApiResult<TaskAnalysis>> {
  const value = await post("/api/analyze", { description });
  return value === null ? { value: demoAnalysis(), demo: true } : { value: readAnalysis(value), demo: false };
}
export async function generateTaskCard(request: CardRequest): Promise<ApiResult<TaskCard>> {
  const value = await post("/api/card", request);
  return value === null ? { value: demoCard(request), demo: true } : { value: readCard(value), demo: false };
}
