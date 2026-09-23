export const examples = {
  Retail: "Мы хотим понять, почему покупатели уходят из интернет-магазина без покупки, и найти способы увеличить долю завершённых заказов.",
  "Customer support": "Мы хотим использовать AI, чтобы улучшить клиентскую поддержку интернет-магазина. Команда получает много повторяющихся вопросов, и ответы занимают слишком много времени.",
  Logistics: "Наша служба доставки тратит много времени на ручное планирование маршрутов, и мы хотим понять, можно ли оптимизировать этот процесс.",
};

const placeholderAnswers = new Set([
  "не знаю", "не уверен", "нет информации", "нет данных", "не указано", "хз",
  "тест", "test", "ерунда", "бла", "blah", "idk", "n/a", "na", "abc", "абв",
]);

// UI-only guard against answers that are present but carry no useful information.
// This affects clarification progress only; business score remains calculateScore().
export function isMeaningfulClarificationAnswer(value: string): boolean {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized || placeholderAnswers.has(normalized)) return false;

  const compact = normalized.replace(/[^a-zа-яё0-9]/gi, "");
  if (!compact) return false;
  if (/^(.)\1{2,}$/u.test(compact)) return false;
  if (/(qwert|asdf|zxcv|qaz|wsx|йцук|фыва|ываыва|ячсм)/i.test(compact)) return false;

  const uniqueCharacters = new Set(compact).size;
  if (compact.length >= 6 && uniqueCharacters / compact.length < 0.3) return false;

  // Short answers such as "CSV" or "500" can be valid; other text needs
  // enough substance to improve the completeness estimate.
  if (/^[A-ZА-ЯЁ]{2,6}$/.test(value.trim()) || /^\d+(?:[.,]\d+)?$/.test(normalized)) return true;
  if (compact.length >= 5 && /[aeiouyаеёиоуыэюя]/i.test(compact)) return true;
  return compact.length >= 8;
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
