import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const content = {
  analyzing: {
    title: "Analyzing your task...",
    helper: "We are turning your description into a clear task outline.",
    steps: ["Understanding your business context", "Identifying missing information", "Preparing clarification questions"],
  },
  building: {
    title: "Building your task card...",
    helper: "Your original facts and answers stay at the center of the task.",
    steps: ["Structuring your answers", "Keeping your original facts", "Identifying remaining gaps"],
  },
} as const;

export function CreateTaskLoading({ variant }: { variant: keyof typeof content }) {
  const state = content[variant];
  return (
    <Card className="mx-auto max-w-xl border-0 bg-white shadow-sm ring-[#445363]/10">
      <CardContent className="space-y-7 p-7 sm:p-9">
        <div className="space-y-2 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#A94228]/10 text-[#A94228]">
            <LoaderCircle className="size-6 animate-spin" />
          </span>
          <h1 className="text-2xl font-semibold text-[#283541]">{state.title}</h1>
          <p className="text-sm text-[#445363]/70">{state.helper}</p>
        </div>
        <ul className="space-y-3">
          {state.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3 rounded-lg bg-[#E5E8E1]/45 px-4 py-3 text-sm text-[#445363]">
              {index < 2 ? <CheckCircle2 className="size-4 text-[#A94228]" /> : <LoaderCircle className="size-4 animate-spin text-[#A94228]" />}
              {step}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
