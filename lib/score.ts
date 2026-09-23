import type { TaskCard } from "./types";

export type ScoreResult = {
  total: number;
  level: TaskCard["level"];
  categories: { name: string; score: number; maxScore: number }[];
  hints: string[];
};

function normalize(value: string | null | undefined): string {
  const text = (value ?? "").trim().replace(/\s+/g, " ");
  return text.toLowerCase() === "не указано" ? "" : text;
}

// Empty text earns nothing; short text earns half; detailed text earns full points.
function textScore(text: string, maxScore: number, minLength = 40): number {
  if (!text) return 0;
  return text.length >= minLength ? maxScore : Math.floor(maxScore / 2);
}

export function calculateScore(card: TaskCard): ScoreResult {
  const hints: string[] = [];

  function scoreField(
    value: string | null | undefined,
    maxScore: number,
    missingHint: string,
    shortHint: string,
    minLength = 40,
  ): number {
    const text = normalize(value);
    const score = textScore(text, maxScore, minLength);
    if (score < maxScore) {
      hints.push(`+${maxScore - score}: ${text ? shortHint : missingHint}`);
    }
    return score;
  }

  const problem =
    scoreField(card.context, 10, "опишите контекст задачи", "подробнее опишите контекст задачи") +
    scoreField(card.need, 10, "укажите проблему или потребность", "уточните проблему или потребность");
  const users = scoreField(card.users, 10, "укажите целевых пользователей", "подробнее опишите целевых пользователей");
  const data = scoreField(card.data, 20, "укажите доступные данные", "подробнее опишите доступные данные");
  const constraints = scoreField(card.constraints, 10, "укажите ограничения", "подробнее опишите ограничения");
  const expectedResult = scoreField(card.expectedResult, 15, "укажите ожидаемый результат", "подробнее опишите ожидаемый результат");

  const criteria = normalize(card.successCriteria);
  // A numeric target must occur in a description, not just a bare number.
  // Examples: "Сократить время обработки заявки до 5 минут", "Точность не ниже 95%".
  const hasMetric = /\d/.test(criteria) &&
    /[a-zа-яё]/i.test(criteria) && criteria.split(" ").length >= 4;
  const criteriaDetail = textScore(criteria, 8);
  const successCriteria = criteriaDetail + (hasMetric ? 7 : 0);

  if (!criteria) {
    hints.push("+15: укажите критерии успеха с измеримым числовым показателем");
  } else {
    if (criteriaDetail < 8) {
      hints.push(`+${8 - criteriaDetail}: подробнее опишите критерии успеха`);
    }
    if (!hasMetric) {
      hints.push("+7: добавьте измеримую метрику успеха с числом и описанием показателя");
    }
  }

  // Interaction format remains on the card but has no separate weight in the score.
  const contact = scoreField(card.contact, 10, "укажите контакт для связи", "уточните контакт для связи", 10);

  const categories: ScoreResult["categories"] = [
    { name: "Context + Need", score: problem, maxScore: 20 },
    { name: "Data", score: data, maxScore: 20 },
    { name: "Expected Result", score: expectedResult, maxScore: 15 },
    { name: "Success Criteria", score: successCriteria, maxScore: 15 },
    { name: "Constraints", score: constraints, maxScore: 10 },
    { name: "Users", score: users, maxScore: 10 },
    { name: "Business Contact", score: contact, maxScore: 10 },
  ];
  const total = categories.reduce((sum, category) => sum + category.score, 0);
  const level: ScoreResult["level"] =
    total < 40 ? "Draft" : total < 70 ? "Working" : total < 90 ? "Ready" : "Priority";

  return { total, level, categories, hints };
}
