import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  kind: "analyze" | "card";
  onRetry: () => void;
  onEdit?: () => void;
};

export function CreateTaskError({ kind, onRetry, onEdit }: Props) {
  const analyze = kind === "analyze";
  return (
    <Card className="mx-auto max-w-xl border-0 bg-white shadow-sm ring-[#A94228]/15">
      <CardContent className="space-y-6 p-7 sm:p-9">
        <div className="space-y-3 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#A94228]/10 text-[#A94228]">
            <AlertCircle className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold text-[#283541]">
            {analyze ? "We couldn't analyze the task." : "We couldn't build the task card."}
          </h1>
          {analyze && <p className="text-sm text-[#445363]/70">Your description is safe. Try again or edit it before retrying.</p>}
        </div>
        <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row">
          {onEdit && (
            <Button variant="outline" size="lg" onClick={onEdit} className="h-10 border-[#445363]/20">
              <ArrowLeft /> Edit description
            </Button>
          )}
          <Button size="lg" onClick={onRetry} className="h-10 bg-[#A94228] text-white hover:bg-[#923922]">
            <RotateCcw /> Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
