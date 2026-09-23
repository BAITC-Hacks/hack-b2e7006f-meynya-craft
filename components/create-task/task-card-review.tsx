"use client";

import { ArrowLeft, CheckCircle2, Info, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableTaskField } from "./editable-task-field";
import { fieldLabels, type CardField, type TaskCard, type TaskFieldKey } from "./types";

const fields: TaskFieldKey[] = [
  "context",
  "businessNeed",
  "users",
  "data",
  "expectedResult",
  "successCriteria",
  "constraints",
  "contact",
  "collaborationFormat",
];

type Props = {
  card: TaskCard;
  demo: boolean;
  confirmed: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onEdit: (field: CardField, value: string) => void;
};

export function TaskCardReview({ card, demo, confirmed, onBack, onConfirm, onEdit }: Props) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A94228]">Review</p>
          <Badge className="bg-[#C9AE84]/25 text-[#654d2c]"><Sparkles /> AI-assisted</Badge>
          {demo && <Badge variant="outline" className="border-[#445363]/20 text-[#445363]">Demo fallback</Badge>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#283541]">Review your task</h1>
        <p className="max-w-3xl text-base leading-7 text-[#445363]/75">
          AI structured your answers into a task card. Review and edit anything before publishing.
        </p>
        <p className="flex items-center gap-2 text-sm text-[#445363]/65">
          <Info className="size-4" /> Generated only from the information you provided. You can edit every field.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="border-0 bg-white py-0 shadow-sm ring-[#445363]/10">
          <CardContent className="px-5 py-2 sm:px-7">
            <EditableTaskField label="Title" value={card.title} singleLine onSave={(value) => onEdit("title", value)} />
            {fields.map((field) => (
              <EditableTaskField
                key={field}
                label={fieldLabels[field]}
                value={card[field]}
                emptyHelper={field === "successCriteria" ? "Adding a measurable success criterion can improve task clarity." : "Add this detail if it is available."}
                onSave={(value) => onEdit(field, value)}
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-6">
          <Card className="border-0 bg-white shadow-sm ring-[#445363]/10">
            <CardHeader>
              <CardTitle className="text-[#283541]">Task quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-[#E5E8E1]/55 p-4 text-sm leading-6 text-[#445363]">
                Score will appear after confirmation.
              </div>
              {confirmed ? (
                <div className="flex items-start gap-3 rounded-lg bg-[#55705d]/10 p-4 text-sm text-[#3f5a47]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <span><strong className="block">Task confirmed</strong>It is ready for the next workflow step.</span>
                </div>
              ) : (
                <Button size="lg" onClick={onConfirm} className="h-11 w-full bg-[#A94228] text-white hover:bg-[#923922]">
                  Confirm task
                </Button>
              )}
            </CardContent>
          </Card>
          <Button variant="ghost" size="lg" onClick={onBack} className="h-10 w-full text-[#445363]">
            <ArrowLeft /> Back to questions
          </Button>
        </div>
      </div>
    </div>
  );
}
