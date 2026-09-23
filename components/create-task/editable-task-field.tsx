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
    <section className="space-y-3 border-b border-[#8EA1AE]/20 py-5 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#685652]/75">{label}</h3>
        {!editing && value && (
          <Button variant="ghost" size="sm" onClick={startEditing} className="text-[#6B212C] hover:bg-[#6B212C]/7 hover:text-[#6B212C]">
            <Pencil /> Изменить
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
              className="h-10 rounded-xl border-[#8EA1AE]/35 bg-[#DCE0E8]/18 text-base text-[#27363F] focus-visible:border-[#6B212C] focus-visible:ring-[#6B212C]/12"
            />
          ) : (
            <Textarea
              value={draft}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              className="min-h-28 resize-y rounded-xl border-[#8EA1AE]/35 bg-[#DCE0E8]/18 text-base leading-7 text-[#27363F] focus-visible:border-[#6B212C] focus-visible:ring-[#6B212C]/12"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancel} className="text-[#685652] hover:bg-[#DCE0E8]/60"><X /> Отмена</Button>
            <Button size="sm" onClick={save} className="bg-[#6B212C] text-white hover:bg-[#571923] focus-visible:ring-[#6B212C]/25"><Check /> Сохранить</Button>
          </div>
        </div>
      ) : value ? (
        <p className="whitespace-pre-wrap text-base leading-7 text-[#27363F]">{value}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-base text-[#685652]/60">Не указано</p>
          {emptyHelper && <p className="text-sm text-[#685652]/70">{emptyHelper}</p>}
          <Button variant="ghost" size="sm" onClick={startEditing} className="-ml-2 text-[#6B212C] hover:bg-[#6B212C]/7 hover:text-[#6B212C]">
            <Plus /> Добавить {label.toLowerCase()}
          </Button>
        </div>
      )}
    </section>
  );
}
