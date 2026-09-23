export const examples = {
  Retail: "Мы хотим понять, почему покупатели уходят из интернет-магазина без покупки, и найти способы увеличить долю завершённых заказов.",
  "Customer support": "Мы хотим использовать AI, чтобы улучшить клиентскую поддержку интернет-магазина. Команда получает много повторяющихся вопросов, и ответы занимают слишком много времени.",
  Logistics: "Наша служба доставки тратит много времени на ручное планирование маршрутов, и мы хотим понять, можно ли оптимизировать этот процесс.",
};

// Temporary UI-only progress estimate. It is task completeness, not business scoring.
export function estimateClarificationCompleteness(
  initial: number,
  answeredCount: number,
  questionCount: number,
) {
  if (questionCount === 0) return 100;
  return Math.round(initial + (answeredCount / questionCount) * (100 - initial));
}
