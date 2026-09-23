"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { examples } from "./demo";

const MAX_LENGTH = 1500;
const MIN_LENGTH = 40;

type Props = {
  description: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
};

export function DescribeStep({ description, onChange, onAnalyze }: Props) {
  const [showShortMessage, setShowShortMessage] = useState(false);

  function submit() {
    if (description.trim().length < MIN_LENGTH) {
      setShowShortMessage(true);
      return;
    }
    setShowShortMessage(false);
    onAnalyze();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A94228]">Create a business task</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#283541] sm:text-4xl">
          What problem do you want students to solve?
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[#445363]/80">
          Describe your business problem in your own words. AI will help you turn it into a clear, actionable task.
        </p>
      </div>

      <Card className="border-0 bg-white py-0 shadow-sm ring-[#445363]/10">
        <CardContent className="space-y-3 p-5 sm:p-6">
          <label htmlFor="business-description" className="text-sm font-medium text-[#283541]">
            Business problem
          </label>
          <Textarea
            id="business-description"
            value={description}
            maxLength={MAX_LENGTH}
            onChange={(event) => {
              onChange(event.target.value);
              if (event.target.value.trim().length >= MIN_LENGTH) setShowShortMessage(false);
            }}
            placeholder="We want to reduce the time our support team spends answering repetitive customer questions. We have several months of support chat history, but we don't know what kind of AI solution would work best."
            className="min-h-52 resize-y border-[#445363]/20 bg-[#fbfbf9] p-4 text-base leading-7 focus-visible:border-[#A94228] focus-visible:ring-[#A94228]/15"
            aria-describedby="description-help description-count"
          />
          <div className="flex min-h-5 items-start justify-between gap-4 text-xs">
            <p id="description-help" className={showShortMessage ? "font-medium text-[#A94228]" : "text-[#445363]/60"}>
              {showShortMessage ? "Add a little more context so AI can understand the problem." : "Focus on the problem and its impact. You do not need to propose a solution."}
            </p>
            <span id="description-count" className="shrink-0 tabular-nums text-[#445363]/60">
              {description.length}/{MAX_LENGTH}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[#445363]">Need inspiration?</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(examples).map(([label, value]) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              onClick={() => {
                onChange(value);
                setShowShortMessage(false);
              }}
              className="h-9 rounded-full border-[#C9AE84]/70 bg-white px-4 text-[#445363] hover:bg-[#C9AE84]/15"
            >
              <Sparkles className="size-3.5 text-[#A94228]" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          disabled={!description.trim()}
          onClick={submit}
          className="h-11 bg-[#A94228] px-5 text-white hover:bg-[#923922]"
        >
          Analyze my task
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
