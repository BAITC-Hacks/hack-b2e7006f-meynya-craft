import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  kind: "analyze" | "card";
  message: string;
  retryable: boolean;
  onRetry: () => void;
  onEdit?: () => void;
};

export function CreateTaskError({ kind, message, retryable, onRetry, onEdit }: Props) {
  const analyze = kind === "analyze";
  return (
    <Card className="mx-auto max-w-xl rounded-2xl border border-[#8EA1AE]/25 bg-white/95 shadow-[0_18px_55px_rgba(39,54,63,0.08)] ring-0">
      <CardContent className="space-y-6 p-7 sm:p-9">
        <div className="space-y-3 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#6B212C]/10 text-[#6B212C]">
            <AlertCircle className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#27363F]">
            {analyze ? "Не удалось проанализировать задачу." : "Не удалось сформировать карточку."}
          </h1>
          <p className="text-sm text-[#685652]/75">{message}</p>
        </div>
        <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row">
          {onEdit && (
            <Button variant="outline" size="lg" onClick={onEdit} className="h-10 rounded-xl border-[#8EA1AE]/35 text-[#685652] hover:bg-[#DCE0E8]/50">
              <ArrowLeft /> {analyze ? "Изменить описание" : "Вернуться к вопросам"}
            </Button>
          )}
          {retryable && (
            <Button size="lg" onClick={onRetry} className="h-10 rounded-xl bg-[#6B212C] text-white shadow-sm hover:bg-[#571923] focus-visible:ring-[#6B212C]/25">
              <RotateCcw /> Повторить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
