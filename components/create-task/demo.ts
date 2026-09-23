import { type CardRequest, type TaskAnalysis, type TaskCard, fieldLabels } from "./types";

export const examples = {
  Retail: "Мы хотим понять, почему покупатели уходят из интернет-магазина без покупки, и найти способы увеличить долю завершённых заказов.",
  "Customer support": "Мы хотим использовать AI, чтобы улучшить клиентскую поддержку интернет-магазина. Команда получает много повторяющихся вопросов, и ответы занимают слишком много времени.",
  Logistics: "Наша служба доставки тратит много времени на ручное планирование маршрутов, и мы хотим понять, можно ли оптимизировать этот процесс.",
};

// Temporary frontend fixture. No AI inference or business scoring.
export function demoAnalysis(): TaskAnalysis {
  return {
    completeness: 29,
    fields: { context: "complete", businessNeed: "complete", users: "partial", data: "missing", expectedResult: "missing", successCriteria: "missing", constraints: "missing", contact: "missing", collaborationFormat: "missing" },
    questions: [
      { id: "target-users", field: "users", question: "Кто будет основным пользователем решения?", helperText: "Например: клиенты, специалисты поддержки, руководители или другая группа." },
      { id: "available-data", field: "data", question: "Какие данные или материалы вы можете предоставить?", helperText: "Укажите формат, примерный объём и условия доступа, если они известны." },
      { id: "expected-result", field: "expectedResult", question: "Какой результат должна подготовить команда студентов?", helperText: "Например: рабочий прототип, дашборд, исследование или AI-ассистент." },
      { id: "success-criteria", field: "successCriteria", question: "Как вы поймёте, что решение успешно?", helperText: "Измеримый результат сделает задачу понятнее." },
      { id: "constraints", field: "constraints", question: "Есть ли важные ограничения?", helperText: "Учтите конфиденциальность, сроки, технологии, интеграции и доступы." },
    ],
  };
}

export function demoCard({ description, analysis, answers }: CardRequest): TaskCard {
  const canonical = description.trim() === examples["Customer support"];
  const card = (canonical ? {
    id: "demo-task-1",
    title: "AI-ассистент для клиентской поддержки",
    context: "Интернет-магазин получает много повторяющихся вопросов от клиентов, что увеличивает нагрузку на службу поддержки.",
    businessNeed: "Сократить объём ручной работы при подготовке ответов на типовые обращения клиентов.",
    users: "Специалисты клиентской поддержки.",
    data: "Около 15 000 обезличенных диалогов поддержки в формате CSV.",
    expectedResult: "Рабочий веб-прототип, который классифицирует входящие вопросы и предлагает подходящие черновики ответов.",
    successCriteria: "Сократить среднее время подготовки ответа не менее чем на 30%.",
    constraints: "Данные клиентов должны оставаться обезличенными.",
    contact: "",
    collaborationFormat: "",
  } : {
    ...Object.fromEntries(Object.keys(fieldLabels).map(key => [key, ""])),
    id: "demo-task-1",
    title: "Бизнес-задача",
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
