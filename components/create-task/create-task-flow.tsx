"use client";

import { useMemo, useState } from "react";
import { calculateScore } from "@/lib/score";
import { useTaskStore } from "@/lib/store";
import { TaskNavigation } from "@/components/tasks/task-ui";
import { ClarifyStep } from "./clarify-step";
import { CreateTaskError } from "./create-task-error";
import { CreateTaskLoading } from "./create-task-loading";
import { CreateTaskStepper } from "./create-task-stepper";
import { DescribeStep } from "./describe-step";
import { estimateClarificationCompleteness, isMeaningfulClarificationAnswer } from "./demo";
import { TaskAnalysis } from "./task-analysis";
import { TaskCardReview } from "./task-card-review";
import { analyzeTask, generateTaskCard, TaskApiError } from "./task-api";
import type {
  CardField,
  ClarificationAnswers,
  CreateTaskStep,
  TaskAnalysis as TaskAnalysisValue,
  TaskCard,
  TaskScore,
} from "./types";

type Phase = "describe" | "analyzing" | "analyze-error" | "analysis" | "clarify" | "building" | "card-error" | "review";
type RequestError = { message: string; retryable: boolean };

export function CreateTaskFlow() {
  const [phase, setPhase] = useState<Phase>("describe");
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState<TaskAnalysisValue | null>(null);
  const [card, setCard] = useState<TaskCard | null>(null);
  const [score, setScore] = useState<TaskScore | null>(null);
  const [requestError, setRequestError] = useState<RequestError | null>(null);
  const [answers, setAnswers] = useState<ClarificationAnswers>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [manualEdits, setManualEdits] = useState<Partial<Record<CardField, string>>>({});
  const [confirmed, setConfirmed] = useState(false);

  const activeStep: CreateTaskStep =
    phase === "clarify" ? "clarify" : phase === "building" || phase === "card-error" || phase === "review" ? "review" : "describe";

  const answeredCount = useMemo(() => {
    if (!analysis) return 0;
    return analysis.questions.filter((question) => isMeaningfulClarificationAnswer(answers[question.id] ?? "")).length;
  }, [analysis, answers]);

  const completeness = analysis
    ? estimateClarificationCompleteness(analysis.completeness, answeredCount, analysis.questions.length)
    : 0;

  async function runAnalysis() {
    setRequestError(null);
    setPhase("analyzing");
    try {
      const result = await analyzeTask(description.trim());
      setAnalysis(result);
      setAnswers({});
      setSkipped({});
      setCurrentQuestionIndex(0);
      setQuestionError(null);
      setCard(null);
      setScore(null);
      setManualEdits({});
      setConfirmed(false);
      setPhase("analysis");
    } catch (error) {
      setRequestError(error instanceof TaskApiError
        ? { message: error.message, retryable: error.retryable }
        : { message: "Не удалось проанализировать задачу.", retryable: true });
      setPhase("analyze-error");
    }
  }

  async function buildCard(nextAnswers: ClarificationAnswers = answers) {
    if (!analysis) return;
    setRequestError(null);
    setPhase("building");
    try {
      const result = await generateTaskCard({ description: description.trim(), analysis, answers: nextAnswers });
      const store = useTaskStore.getState();
      const previousDraft = store.tasks.find((task) => task.id === card?.id && task.status === "draft");
      const draft = { ...result.card, ...manualEdits, id: previousDraft?.id ?? result.card.id };
      // Rebuilding a draft replaces its content instead of leaving duplicate drafts.
      if (previousDraft) store.updateTask(draft.id, draft);
      else store.addDraft(draft);
      const saved = useTaskStore.getState().tasks.find((task) => task.id === draft.id)!;
      setCard(saved);
      setScore(calculateScore(saved));
      setConfirmed(false);
      setPhase("review");
    } catch (error) {
      setRequestError(error instanceof TaskApiError
        ? { message: error.message, retryable: error.retryable }
        : { message: "Не удалось сформировать карточку.", retryable: true });
      setPhase("card-error");
    }
  }

  function beginClarification() {
    if (!analysis) return;
    if (analysis.questions.length === 0) {
      void buildCard();
      return;
    }
    setCurrentQuestionIndex(0);
    setQuestionError(null);
    setPhase("clarify");
  }

  function updateAnswer(value: string) {
    if (!analysis) return;
    const question = analysis.questions[currentQuestionIndex];
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setSkipped((current) => ({ ...current, [question.id]: false }));
    setQuestionError(null);
  }

  function continueQuestion() {
    if (!analysis) return;
    const question = analysis.questions[currentQuestionIndex];
    if (!answers[question.id]?.trim() && !skipped[question.id]) {
      setQuestionError("Добавьте ответ или выберите «Пока не знаю».");
      return;
    }
    if (!skipped[question.id] && !isMeaningfulClarificationAnswer(answers[question.id] ?? "")) {
      setQuestionError("Добавьте содержательный ответ с конкретной информацией или выберите «Пока не знаю».");
      return;
    }
    setQuestionError(null);
    if (currentQuestionIndex === analysis.questions.length - 1) {
      void buildCard();
    } else {
      setCurrentQuestionIndex((index) => index + 1);
    }
  }

  function skipQuestion() {
    if (!analysis) return;
    const question = analysis.questions[currentQuestionIndex];
    const nextAnswers = { ...answers, [question.id]: "" };
    setAnswers(nextAnswers);
    setSkipped((current) => ({ ...current, [question.id]: true }));
    setQuestionError(null);
    if (currentQuestionIndex === analysis.questions.length - 1) {
      void buildCard(nextAnswers);
    } else {
      setCurrentQuestionIndex((index) => index + 1);
    }
  }

  function backFromQuestion() {
    setQuestionError(null);
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((index) => index - 1);
    else setPhase("analysis");
  }

  function backFromReview() {
    setConfirmed(false);
    if (analysis?.questions.length) {
      setCurrentQuestionIndex(analysis.questions.length - 1);
      setPhase("clarify");
    } else {
      setPhase("analysis");
    }
  }

  function editCardField(field: CardField, value: string) {
    if (!card) return;
    const edited = { ...card, [field]: value };
    const nextScore = calculateScore(edited);
    setManualEdits((current) => ({ ...current, [field]: value }));
    setCard({ ...edited, score: nextScore.total, level: nextScore.level });
    setScore(nextScore);
    setConfirmed(false);
  }

  function confirmCard() {
    if (!card) return;
    const store = useTaskStore.getState();
    // Save manual edits, then publish only on the business's explicit confirmation.
    store.updateTask(card.id, card);
    store.publishTask(card.id);
    const published = useTaskStore.getState().tasks.find((task) => task.id === card.id)!;
    setCard(published);
    setScore(calculateScore(published));
    setConfirmed(true);
  }

  const currentQuestion = analysis?.questions[currentQuestionIndex];

  return (
    <main
      className="min-h-screen bg-[#DCE0E8]/35 text-[#27363F]"
      style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}
    >
      <TaskNavigation role="business" />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <CreateTaskStepper current={activeStep} />
        <div className={phase === "review" ? "mx-auto mt-12 max-w-5xl" : "mx-auto mt-12 max-w-3xl"}>
          {phase === "describe" && <DescribeStep description={description} onChange={setDescription} onAnalyze={() => void runAnalysis()} />}
          {phase === "analyzing" && <CreateTaskLoading variant="analyzing" />}
          {phase === "analyze-error" && requestError && <CreateTaskError kind="analyze" message={requestError.message} retryable={requestError.retryable} onRetry={() => void runAnalysis()} onEdit={() => setPhase("describe")} />}
          {phase === "analysis" && analysis && (
            <TaskAnalysis analysis={analysis} onBack={() => setPhase("describe")} onContinue={beginClarification} />
          )}
          {phase === "clarify" && analysis && currentQuestion && (
            <ClarifyStep
              question={currentQuestion}
              index={currentQuestionIndex}
              total={analysis.questions.length}
              answer={answers[currentQuestion.id] ?? ""}
              skipped={Boolean(skipped[currentQuestion.id])}
              completeness={completeness}
              error={questionError}
              onAnswer={updateAnswer}
              onBack={backFromQuestion}
              onSkip={skipQuestion}
              onContinue={continueQuestion}
            />
          )}
          {phase === "building" && <CreateTaskLoading variant="building" />}
          {phase === "card-error" && requestError && <CreateTaskError kind="card" message={requestError.message} retryable={requestError.retryable} onRetry={() => void buildCard()} onEdit={backFromReview} />}
          {phase === "review" && card && (
            <TaskCardReview
              card={card}
              score={score}
              confirmed={confirmed}
              onBack={backFromReview}
              onConfirm={confirmCard}
              onEdit={editCardField}
            />
          )}
        </div>
      </div>
    </main>
  );
}
