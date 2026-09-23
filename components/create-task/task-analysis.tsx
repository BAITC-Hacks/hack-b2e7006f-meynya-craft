import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fieldLabels, type TaskAnalysis as TaskAnalysisValue, type TaskFieldKey } from "./types";

const keyAreas: TaskFieldKey[] = [
  "context",
  "businessNeed",
  "users",
  "data",
  "expectedResult",
  "successCriteria",
  "constraints",
];

type Props = {
  analysis: TaskAnalysisValue;
  demo: boolean;
  onBack: () => void;
  onContinue: () => void;
};

export function TaskAnalysis({ analysis, demo, onBack, onContinue }: Props) {
  const completeCount = keyAreas.filter((key) => analysis.fields[key] === "complete").length;

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A94228]">Task analysis</p>
          {demo && <span className="rounded-full bg-[#C9AE84]/20 px-2.5 py-1 text-xs font-medium text-[#6e5735]">Demo fallback</span>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#283541]">
          {completeCount} of {keyAreas.length} key areas are clear
        </h1>
        <p className="text-base text-[#445363]/75">Let&apos;s fill the gaps. It will take about 1 minute.</p>
      </div>

      <Card className="border-0 bg-white py-0 shadow-sm ring-[#445363]/10">
        <CardContent className="divide-y divide-[#445363]/10 p-0">
          {keyAreas.map((key) => {
            const status = analysis.fields[key];
            const Icon = status === "complete" ? CheckCircle2 : status === "partial" ? AlertTriangle : CircleAlert;
            return (
              <div key={key} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <Icon className={status === "complete" ? "size-5 text-[#55705d]" : status === "partial" ? "size-5 text-[#9a7443]" : "size-5 text-[#445363]/45"} />
                  <span className="font-medium text-[#283541]">{fieldLabels[key]}</span>
                </div>
                <span className="text-xs capitalize text-[#445363]/55">{status}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="h-10 text-[#445363]">
          <ArrowLeft /> Back
        </Button>
        <Button size="lg" onClick={onContinue} className="h-10 bg-[#A94228] px-5 text-white hover:bg-[#923922]">
          Continue <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
