import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateTaskStep } from "./types";

const steps: { id: CreateTaskStep; label: string }[] = [
  { id: "describe", label: "Describe" },
  { id: "clarify", label: "Clarify" },
  { id: "review", label: "Review" },
];

export function CreateTaskStepper({ current }: { current: CreateTaskStep }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <nav aria-label="Task creation progress" className="mx-auto w-full max-w-2xl">
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
                    index <= currentIndex ? "bg-[#A94228]" : "bg-[#445363]/20",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                  complete && "border-[#A94228] bg-[#A94228] text-white",
                  active && "border-[#A94228] bg-white text-[#A94228] ring-4 ring-[#A94228]/10",
                  !complete && !active && "border-[#445363]/25 bg-[#f7f7f4] text-[#445363]/55",
                )}
                aria-current={active ? "step" : undefined}
              >
                {complete ? <Check className="size-4" /> : index + 1}
              </span>
              <span className={cn("text-xs font-medium sm:text-sm", active || complete ? "text-[#283541]" : "text-[#445363]/55")}>
                {index + 1} {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
