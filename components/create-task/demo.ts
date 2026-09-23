import { type CardRequest, type TaskAnalysis, type TaskCard, fieldLabels } from "./types";

export const examples = {
  Retail: "We want to understand why customers leave our online store without buying and find ways to increase completed purchases.",
  "Customer support": "We want to use AI to improve customer support in our online store. Our team receives many repetitive questions and answering them takes too much time.",
  Logistics: "Our delivery team spends too much time planning routes manually and we want to understand whether the process can be optimized.",
};

// Temporary frontend fixture. No AI inference or business scoring.
export function demoAnalysis(): TaskAnalysis {
  return {
    completeness: 29,
    fields: { context: "complete", businessNeed: "complete", users: "partial", data: "missing", expectedResult: "missing", successCriteria: "missing", constraints: "missing", contact: "missing", collaborationFormat: "missing" },
    questions: [
      { id: "target-users", field: "users", question: "Who will primarily use the solution?", helperText: "For example: customers, support agents, managers or another group." },
      { id: "available-data", field: "data", question: "What data or materials can you provide?", helperText: "Mention formats, approximate volume or access conditions if known." },
      { id: "expected-result", field: "expectedResult", question: "What should the student team deliver?", helperText: "For example: a working prototype, dashboard, analysis or AI assistant." },
      { id: "success-criteria", field: "successCriteria", question: "How will you know the solution is successful?", helperText: "A measurable result makes the task much clearer." },
      { id: "constraints", field: "constraints", question: "Are there any important constraints?", helperText: "Think about privacy, time, technologies, integrations or access." },
    ],
  };
}

export function demoCard({ description, analysis, answers }: CardRequest): TaskCard {
  const canonical = description.trim() === examples["Customer support"];
  const card = (canonical ? {
    id: "demo-task-1",
    title: "AI Customer Support Assistant",
    context: "Our online store receives a high volume of repetitive customer questions, increasing the workload of the support team.",
    businessNeed: "Reduce the amount of manual work required to prepare responses to common customer requests.",
    users: "Customer support agents.",
    data: "Around 15,000 anonymized support conversations in CSV format.",
    expectedResult: "A working web prototype that categorizes incoming questions and suggests relevant draft responses.",
    successCriteria: "Reduce average response preparation time by at least 30%.",
    constraints: "Customer data must remain anonymized.",
    contact: "",
    collaborationFormat: "",
  } : {
    ...Object.fromEntries(Object.keys(fieldLabels).map(key => [key, ""])),
    id: "demo-task-1",
    title: "Business task",
    context: description,
    businessNeed: description,
  }) as TaskCard;
  for (const question of analysis.questions) {
    if (Object.prototype.hasOwnProperty.call(answers, question.id)) {
      card[question.field] = answers[question.id].trim();
    }
  }
  return card;
}

// Temporary UI-only progress estimate. It is task completeness, not business scoring.
export function estimateClarificationCompleteness(
  initial: number,
  answeredCount: number,
  questionCount: number,
) {
  if (questionCount === 0) return 100;
  return Math.round(initial + (answeredCount / questionCount) * (100 - initial));
}
