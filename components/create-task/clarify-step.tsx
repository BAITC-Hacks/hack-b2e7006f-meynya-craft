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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A94228]">Clarify</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#283541]">Let&apos;s make your task clearer</h1>
        <p className="text-base text-[#445363]/75">Based on your description, we need a few more details.</p>
      </div>

      <Card className="border-0 bg-white py-0 shadow-sm ring-[#445363]/10">
        <CardContent className="space-y-7 p-5 sm:p-7">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#445363]">Question {index + 1} of {total}</span>
              <span className="tabular-nums text-[#445363]/55">{questionProgress}%</span>
            </div>
            <Progress value={questionProgress} className="[&_[data-slot=progress-indicator]]:bg-[#A94228] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-[#E5E8E1]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#283541] sm:text-2xl">{question.question}</h2>
            {question.helperText && <p className="leading-6 text-[#445363]/70">{question.helperText}</p>}
          </div>

          <div className="space-y-2">
            <Textarea
              value={answer}
              onChange={(event) => onAnswer(event.target.value)}
              placeholder="Type your answer..."
              className="min-h-36 resize-y border-[#445363]/20 bg-[#fbfbf9] p-4 text-base leading-7 focus-visible:border-[#A94228] focus-visible:ring-[#A94228]/15"
              aria-invalid={Boolean(error)}
            />
            {skipped && !answer && <p className="text-sm text-[#445363]/65">Marked as Not specified. Add an answer anytime to replace it.</p>}
            {error && <p className="text-sm font-medium text-[#A94228]">{error}</p>}
          </div>

          <div className="rounded-lg bg-[#E5E8E1]/45 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-[#283541]">Task completeness</span>
              <span className="tabular-nums text-[#445363]">{completeness}%</span>
            </div>
            <Progress value={completeness} className="[&_[data-slot=progress-indicator]]:bg-[#445363] [&_[data-slot=progress-track]]:bg-white" />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#445363]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" size="lg" onClick={onBack} className="h-10 text-[#445363]">
              <ArrowLeft /> Back
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" size="lg" onClick={onSkip} className="h-10 border-[#445363]/20 bg-white text-[#445363]">
                <HelpCircle /> I don&apos;t know yet
              </Button>
              <Button size="lg" onClick={onContinue} className="h-10 bg-[#A94228] px-5 text-white hover:bg-[#923922]">
                {last ? "Generate task card" : "Continue"} <ArrowRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
