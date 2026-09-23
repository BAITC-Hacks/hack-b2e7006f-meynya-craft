"use client";

import { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  label: string;
  value: string;
  singleLine?: boolean;
  emptyHelper?: string;
  onSave: (value: string) => void;
};

export function EditableTaskField({ label, value, singleLine, emptyHelper, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function save() {
    onSave(draft.trim());
    setEditing(false);
  }

  function startEditing() {
    setDraft(value);
    setEditing(true);
  }

  return (
    <section className="space-y-3 border-b border-[#445363]/10 py-5 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#445363]/70">{label}</h3>
        {!editing && value && (
          <Button variant="ghost" size="sm" onClick={startEditing} className="text-[#A94228] hover:bg-[#A94228]/8 hover:text-[#A94228]">
            <Pencil /> Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          {singleLine ? (
            <Input
              value={draft}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              className="h-10 border-[#445363]/20 text-base focus-visible:border-[#A94228] focus-visible:ring-[#A94228]/15"
            />
          ) : (
            <Textarea
              value={draft}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              className="min-h-28 resize-y border-[#445363]/20 text-base leading-7 focus-visible:border-[#A94228] focus-visible:ring-[#A94228]/15"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}><X /> Cancel</Button>
            <Button size="sm" onClick={save} className="bg-[#445363] text-white hover:bg-[#34414d]"><Check /> Save</Button>
          </div>
        </div>
      ) : value ? (
        <p className="whitespace-pre-wrap text-base leading-7 text-[#283541]">{value}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-base text-[#445363]/55">Not specified</p>
          {emptyHelper && <p className="text-sm text-[#445363]/65">{emptyHelper}</p>}
          <Button variant="ghost" size="sm" onClick={startEditing} className="-ml-2 text-[#A94228] hover:bg-[#A94228]/8 hover:text-[#A94228]">
            <Plus /> Add {label.toLowerCase()}
          </Button>
        </div>
      )}
    </section>
  );
}
