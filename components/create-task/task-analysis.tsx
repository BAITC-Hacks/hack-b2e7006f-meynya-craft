import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fieldLabels, type TaskAnalysis as TaskAnalysisValue, type TaskFieldKey } from "./types";

const keyAreas: TaskFieldKey[] = [
  "context",
  "need",
  "users",
  "data",
  "expectedResult",
  "successCriteria",
  "constraints",
];
const statusLabels = {
  complete: "Готово",
  partial: "Нужно уточнить",
  missing: "Не указано",
} as const;

type Props = {
  analysis: TaskAnalysisValue;
  onBack: () => void;
  onContinue: () => void;
};

export function TaskAnalysis({ analysis, onBack, onContinue }: Props) {
  const completeCount = keyAreas.filter((key) => analysis.fields[key] === "complete").length;

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6B212C]">Анализ задачи</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#27363F] sm:text-4xl">
          Готово разделов: {completeCount} из {keyAreas.length}
        </h1>
        <p className="text-base text-[#685652]/80">Заполним пробелы — это займёт около минуты.</p>
      </div>

      <Card className="rounded-2xl border border-[#8EA1AE]/25 bg-white/95 py-0 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
        <CardContent className="divide-y divide-[#8EA1AE]/20 p-0">
          {keyAreas.map((key) => {
            const status = analysis.fields[key];
            const Icon = status === "complete" ? CheckCircle2 : status === "partial" ? AlertTriangle : CircleAlert;
            return (
              <div key={key} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <Icon className={status === "complete" ? "size-5 text-[#6B212C]" : status === "partial" ? "size-5 text-[#685652]" : "size-5 text-[#8EA1AE]"} />
                  <span className="font-medium text-[#27363F]">{fieldLabels[key]}</span>
                </div>
                <span className="text-xs font-medium text-[#685652]/70">{statusLabels[status]}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="h-10 text-[#685652] hover:bg-[#DCE0E8]/60 hover:text-[#27363F]">
          <ArrowLeft /> Назад
        </Button>
        <Button size="lg" onClick={onContinue} className="h-10 rounded-xl bg-[#6B212C] px-5 text-white shadow-sm hover:bg-[#571923] focus-visible:ring-[#6B212C]/25">
          Продолжить <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
