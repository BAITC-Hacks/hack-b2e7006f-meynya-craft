"use client";

import { ArrowLeft, CheckCircle2, Info, Sparkles } from "lucide-react";
import Link from "next/link";
import { ScorePanel } from "@/components/tasks/task-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableTaskField } from "./editable-task-field";
import { fieldLabels, type CardField, type TaskCard, type TaskFieldKey, type TaskScore } from "./types";

const fields: TaskFieldKey[] = [
  "topic",
  "context",
  "need",
  "users",
  "data",
  "expectedResult",
  "successCriteria",
  "constraints",
  "contact",
  "interactionFormat",
];

type Props = {
  card: TaskCard;
  score: TaskScore | null;
  confirmed: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onEdit: (field: CardField, value: string) => void;
};

export function TaskCardReview({ card, score, confirmed, onBack, onConfirm, onEdit }: Props) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6B212C]">Проверка</p>
          <Badge className="bg-[#6B212C]/9 text-[#6B212C]"><Sparkles /> Создано с AI</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#27363F] sm:text-4xl">Проверьте задачу</h1>
        <p className="max-w-3xl text-base leading-7 text-[#685652]/80">
          AI собрал ваши ответы в карточку задачи. Проверьте и при необходимости отредактируйте поля.
        </p>
        <p className="flex items-center gap-2 text-sm text-[#685652]/70">
          <Info className="size-4" /> Карточка создана только на основе ваших данных. Все поля можно изменить.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="rounded-2xl border border-[#8EA1AE]/25 bg-white/95 py-0 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
          <CardContent className="px-5 py-2 sm:px-7">
            <EditableTaskField label="Название" value={card.title} singleLine onSave={(value) => onEdit("title", value)} />
            {fields.map((field) => (
              <EditableTaskField
                key={field}
                label={fieldLabels[field]}
                value={card[field]}
                emptyHelper={field === "successCriteria" ? "Измеримый критерий поможет точнее оценить результат." : "Добавьте эту информацию, если она доступна."}
                onSave={(value) => onEdit(field, value)}
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-6">
          {score && <ScorePanel card={card} />}
          <Card className="rounded-2xl border border-[#8EA1AE]/25 bg-white/95 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold tracking-[-0.02em] text-[#27363F]">Публикация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {confirmed ? (
                <div className="flex items-start gap-3 rounded-xl border border-[#6B212C]/15 bg-[#6B212C]/6 p-4 text-sm text-[#6B212C]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <span><strong className="block">Задача опубликована</strong>Теперь студенты могут отправлять отклики.</span>
                </div>
              ) : (
                <Button size="lg" onClick={onConfirm} className="h-11 w-full rounded-xl bg-[#6B212C] text-white shadow-sm hover:bg-[#571923] focus-visible:ring-[#6B212C]/25">
                  Подтвердить задачу
                </Button>
              )}
              {confirmed && <div className="space-y-3 text-sm font-semibold text-[#6B212C]">
                <Link href="/catalog" className="block underline">Перейти в каталог</Link>
                <Link href={`/business/${card.id}`} className="block underline">Управлять задачей и откликами</Link>
              </div>}
            </CardContent>
          </Card>
          <Button variant="ghost" size="lg" onClick={onBack} className="h-10 w-full text-[#685652] hover:bg-[#DCE0E8]/60 hover:text-[#27363F]">
            <ArrowLeft /> Вернуться к вопросам
          </Button>
        </div>
      </div>
    </div>
  );
}
