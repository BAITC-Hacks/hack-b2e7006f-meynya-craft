"use client";

import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { ClarifyingQuestion } from "./types";

type Props = {
  question: ClarifyingQuestion;
  index: number;
  total: number;
  answer: string;
  skipped: boolean;
  completeness: number;
  error: string | null;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onContinue: () => void;
};

export function ClarifyStep({
  question,
  index,
  total,
  answer,
  skipped,
  completeness,
  error,
  onAnswer,
  onBack,
  onSkip,
  onContinue,
}: Props) {
  const last = index === total - 1;
  const questionProgress = Math.round(((index + 1) / total) * 100);

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6B212C]">Уточнение</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#27363F] sm:text-4xl">Давайте уточним задачу</h1>
        <p className="text-base text-[#685652]/80">По вашему описанию нужно уточнить несколько деталей.</p>
      </div>

      <Card className="rounded-2xl border border-[#8EA1AE]/25 bg-white/95 py-0 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
        <CardContent className="space-y-7 p-5 sm:p-7">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#685652]">Вопрос {index + 1} из {total}</span>
              <span className="tabular-nums text-[#685652]/65">{questionProgress}%</span>
            </div>
            <Progress value={questionProgress} className="[&_[data-slot=progress-indicator]]:bg-[#6B212C] [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[#DCE0E8]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#27363F] sm:text-3xl">{question.question}</h2>
            {question.helperText && <p className="leading-6 text-[#685652]/75">{question.helperText}</p>}
          </div>

          <div className="space-y-2">
            <Textarea
              value={answer}
              onChange={(event) => onAnswer(event.target.value)}
              placeholder="Введите ответ..."
              className="min-h-36 resize-y rounded-xl border-[#8EA1AE]/35 bg-[#DCE0E8]/18 p-4 text-base leading-7 text-[#27363F] placeholder:text-[#685652]/45 focus-visible:border-[#6B212C] focus-visible:ring-[#6B212C]/12"
              aria-invalid={Boolean(error)}
            />
            {skipped && !answer && <p className="text-sm text-[#685652]/70">Сохранено как «Не указано». Ответ можно добавить позже.</p>}
            {error && <p className="text-sm font-medium text-[#6B212C]">{error}</p>}
          </div>

          <div className="rounded-xl border border-[#8EA1AE]/20 bg-[#DCE0E8]/40 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#27363F]">Полнота задачи</span>
              <span className="tabular-nums text-[#685652]">{completeness}%</span>
            </div>
            <Progress value={completeness} className="[&_[data-slot=progress-indicator]]:bg-[#6B212C] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-white" />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#8EA1AE]/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" size="lg" onClick={onBack} className="h-10 text-[#685652] hover:bg-[#DCE0E8]/60 hover:text-[#27363F]">
              <ArrowLeft /> Назад
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" size="lg" onClick={onSkip} className="h-10 rounded-xl border-[#8EA1AE]/35 bg-white text-[#685652] hover:border-[#6B212C]/30 hover:bg-[#6B212C]/5 hover:text-[#6B212C]">
                <HelpCircle /> Пока не знаю
              </Button>
              <Button size="lg" onClick={onContinue} className="h-10 rounded-xl bg-[#6B212C] px-5 text-white shadow-sm hover:bg-[#571923] focus-visible:ring-[#6B212C]/25">
                {last ? "Сформировать карточку" : "Продолжить"} <ArrowRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
