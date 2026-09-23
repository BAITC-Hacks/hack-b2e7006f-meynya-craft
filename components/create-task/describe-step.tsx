"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { examples } from "./demo";

const MAX_LENGTH = 1500;
const MIN_LENGTH = 40;
const exampleLabels: Record<keyof typeof examples, string> = {
  Retail: "Ритейл",
  "Customer support": "Поддержка клиентов",
  Logistics: "Логистика",
};

type Props = {
  description: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
};

export function DescribeStep({ description, onChange, onAnalyze }: Props) {
  const [showShortMessage, setShowShortMessage] = useState(false);

  function submit() {
    if (description.trim().length < MIN_LENGTH) {
      setShowShortMessage(true);
      return;
    }
    setShowShortMessage(false);
    onAnalyze();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6B212C]">Создание бизнес-задачи</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#27363F] sm:text-5xl">
          Какую задачу вы хотите предложить студентам?
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[#685652]/85">
          Опишите бизнес-задачу своими словами — AI поможет превратить её в понятное и структурированное задание.
        </p>
      </div>

      <Card className="rounded-2xl border border-[#8EA1AE]/25 bg-white/95 py-0 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
        <CardContent className="space-y-3 p-5 sm:p-6">
          <label htmlFor="business-description" className="text-sm font-semibold text-[#27363F]">
            Описание задачи
          </label>
          <Textarea
            id="business-description"
            value={description}
            maxLength={MAX_LENGTH}
            onChange={(event) => {
              onChange(event.target.value);
              if (event.target.value.trim().length >= MIN_LENGTH) setShowShortMessage(false);
            }}
            placeholder="Мы хотим сократить время, которое служба поддержки тратит на повторяющиеся вопросы клиентов. У нас есть история обращений за несколько месяцев, но мы пока не понимаем, какое AI-решение подойдёт лучше всего."
            className="min-h-52 resize-y rounded-xl border-[#8EA1AE]/35 bg-[#DCE0E8]/18 p-4 text-base leading-7 text-[#27363F] placeholder:text-[#685652]/45 focus-visible:border-[#6B212C] focus-visible:ring-[#6B212C]/12"
            aria-describedby="description-help description-count"
          />
          <div className="flex min-h-5 items-start justify-between gap-4 text-xs">
            <p id="description-help" className={showShortMessage ? "font-medium text-[#6B212C]" : "text-[#685652]/65"}>
              {showShortMessage ? "Добавьте немного контекста, чтобы AI лучше понял задачу." : "Опишите проблему и её влияние. Предлагать решение необязательно."}
            </p>
            <span id="description-count" className="shrink-0 tabular-nums text-[#685652]/60">
              {description.length}/{MAX_LENGTH}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#685652]">Нужен пример?</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(examples).map(([label, value]) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              onClick={() => {
                onChange(value);
                setShowShortMessage(false);
              }}
              className="h-9 rounded-full border-[#8EA1AE]/35 bg-white/90 px-4 text-[#27363F] shadow-sm hover:border-[#6B212C]/35 hover:bg-[#6B212C]/6 hover:text-[#6B212C]"
            >
              <Sparkles className="size-3.5 text-[#6B212C]" />
              {exampleLabels[label as keyof typeof examples]}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          disabled={!description.trim()}
          onClick={submit}
          className="h-11 rounded-xl bg-[#6B212C] px-5 text-white shadow-sm hover:bg-[#571923] focus-visible:ring-[#6B212C]/25"
        >
          Проанализировать задачу
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
