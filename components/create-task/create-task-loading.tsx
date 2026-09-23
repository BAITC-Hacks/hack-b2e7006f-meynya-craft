import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const content = {
  analyzing: {
    title: "Анализируем задачу...",
    helper: "Превращаем ваше описание в понятную структуру задачи.",
    steps: ["Изучаем бизнес-контекст", "Находим недостающую информацию", "Готовим уточняющие вопросы"],
  },
  building: {
    title: "Формируем карточку задачи...",
    helper: "Используем только ваше описание и ответы.",
    steps: ["Структурируем ответы", "Сохраняем исходные факты", "Отмечаем оставшиеся пробелы"],
  },
} as const;

export function CreateTaskLoading({ variant }: { variant: keyof typeof content }) {
  const state = content[variant];
  return (
    <Card className="mx-auto max-w-xl rounded-2xl border border-[#8EA1AE]/25 bg-white/95 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
      <CardContent className="space-y-7 p-7 sm:p-9">
        <div className="space-y-2 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#6B212C]/10 text-[#6B212C] ring-4 ring-[#6B212C]/5">
            <LoaderCircle className="size-6 animate-spin" />
          </span>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#27363F]">{state.title}</h1>
          <p className="text-sm text-[#685652]/75">{state.helper}</p>
        </div>
        <ul className="space-y-3">
          {state.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3 rounded-xl border border-[#8EA1AE]/15 bg-[#DCE0E8]/35 px-4 py-3 text-sm text-[#685652]">
              {index < 2 ? <CheckCircle2 className="size-4 text-[#6B212C]" /> : <LoaderCircle className="size-4 animate-spin text-[#6B212C]" />}
              {step}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
