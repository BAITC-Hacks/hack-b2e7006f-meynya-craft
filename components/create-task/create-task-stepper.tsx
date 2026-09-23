import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateTaskStep } from "./types";

const steps: { id: CreateTaskStep; label: string }[] = [
  { id: "describe", label: "Описание" },
  { id: "clarify", label: "Уточнение" },
  { id: "review", label: "Проверка" },
];

export function CreateTaskStepper({ current }: { current: CreateTaskStep }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <nav aria-label="Этапы создания задачи" className="mx-auto w-full max-w-2xl">
      <ol className="grid grid-cols-3">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step.id} className="relative flex flex-col items-center gap-2 text-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-1/2 top-4 h-px w-full",
                    index <= currentIndex ? "bg-[#6B212C]" : "bg-[#8EA1AE]/35",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                  complete && "border-[#6B212C] bg-[#6B212C] text-white shadow-sm",
                  active && "border-[#6B212C] bg-white text-[#6B212C] ring-4 ring-[#6B212C]/12",
                  !complete && !active && "border-[#8EA1AE]/40 bg-white/70 text-[#685652]/55",
                )}
                aria-current={active ? "step" : undefined}
              >
                {complete ? <Check className="size-4" /> : index + 1}
              </span>
              <span className={cn("text-xs font-medium sm:text-sm", active || complete ? "text-[#27363F]" : "text-[#685652]/60")}>
                {index + 1} {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
