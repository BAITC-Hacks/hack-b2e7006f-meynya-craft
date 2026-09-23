"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useTaskStore } from "@/lib/store";
import { seedTeams } from "@/lib/seed";
import { EditableTaskField } from "@/components/create-task/editable-task-field";
import { fieldLabels } from "@/components/create-task/types";
import type { TaskFieldKey } from "@/components/create-task/types";
import { action, inputStyle, panel, ScorePanel, statusLabels, TaskShell } from "./task-ui";

export function TaskDetail({ id, business }: { id: string; business: boolean }) {
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === id));
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const role = business ? "business" : "student";
  if (!task || (!business && task.status === "draft")) return <TaskShell role={role}><div className={panel}><h1 className="text-2xl font-semibold">Задача недоступна</h1><p className="my-3 text-[#685652]">Она ещё не опубликована или отсутствует в этой вкладке.</p><Link href={business ? "/business" : "/catalog"} className={action}>Вернуться к задачам</Link></div></TaskShell>;

  function perform(work: () => void) {
    setError("");
    try { work(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось выполнить действие."); }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent) return;
    const values = new FormData(event.currentTarget);
    perform(() => {
      useTaskStore.getState().submitProposal(id, {
        team: String(values.get("team") ?? ""), idea: String(values.get("idea") ?? ""),
        plan: String(values.get("plan") ?? ""), deadline: String(values.get("deadline") ?? ""),
        link: String(values.get("link") ?? ""),
      });
      setSent(true);
    });
  }

  return <TaskShell role={role}>
    <Link href={business ? "/business" : "/catalog"} className="text-sm font-semibold text-[#6B212C] hover:underline">← {business ? "Задачи бизнеса" : "Каталог задач"}</Link>
    <div><p className="text-sm text-[#685652]">{task.topic} · {statusLabels[task.status]}</p><h1 className="mt-2 break-words text-3xl font-semibold tracking-tight sm:text-4xl">{task.title}</h1></div>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className={panel} aria-label="Поля карточки">
          {(Object.keys(fieldLabels) as TaskFieldKey[]).map((field) => business ?
            <EditableTaskField key={field} label={fieldLabels[field]} value={task[field]} singleLine={field === "title" || field === "topic"} onSave={(value) => perform(() => useTaskStore.getState().updateTask(id, { [field]: value }))} /> :
            <div key={field} className="border-b border-[#8EA1AE]/20 py-4 first:pt-0 last:border-0"><h2 className="text-sm font-semibold text-[#685652]">{fieldLabels[field]}</h2><p className="mt-2 whitespace-pre-wrap break-words leading-7">{task[field]}</p></div>,
          )}
        </section>
        {business ? <section className={`${panel} space-y-5`} aria-label="Отклики команд">
          <h2 className="text-2xl font-semibold">Отклики команд</h2>
          {task.proposals.length === 0 && <p className="text-[#685652]">Откликов пока нет. Опубликуйте задачу и предложите студентам откликнуться.</p>}
          {task.proposals.map((proposal) => <article key={proposal.id} className="space-y-3 rounded-xl border border-[#8EA1AE]/30 p-4">
            <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{proposal.team}</h3><span className="text-sm font-medium text-[#6B212C]">{{ pending: "Ожидает решения", accepted: "Принят", rejected: "Отклонён" }[proposal.status]}</span></div>
            <p className="whitespace-pre-wrap break-words"><strong>Идея: </strong>{proposal.idea}</p>
            <p className="whitespace-pre-wrap break-words text-sm"><strong>План: </strong>{proposal.plan}</p>
            <p className="text-sm"><strong>Срок: </strong>{proposal.deadline}</p>
            {/^https?:\/\//i.test(proposal.link) ? <a href={proposal.link} target="_blank" rel="noopener noreferrer" className="block break-all text-sm text-[#6B212C] underline">Материалы команды ↗</a> : <p className="break-all text-sm text-[#685652]">Ссылка: {proposal.link}</p>}
            {proposal.status === "pending" && <div className="flex flex-wrap gap-2 pt-2">
              <button className={action} disabled={task.status !== "published"} onClick={() => perform(() => useTaskStore.getState().acceptProposal(id, proposal.id))}>Accept — принять</button>
              <button className="rounded-xl border border-[#8EA1AE]/40 px-4 py-2.5 text-sm font-semibold disabled:opacity-40" disabled={task.status === "draft"} onClick={() => perform(() => useTaskStore.getState().rejectProposal(id, proposal.id))}>Reject — отклонить</button>
            </div>}
          </article>)}
        </section> : <section className={panel} aria-label="Отправка отклика">
          <h2 className="mb-4 text-2xl font-semibold">Предложить решение</h2>
          {sent ? <div role="status" className="space-y-3"><p className="font-semibold text-[#6B212C]">Отклик отправлен. Решение принимает бизнес.</p><Link href={`/business/${id}`} className="inline-block text-sm underline">Посмотреть отклик в роли Business</Link></div> : task.status !== "published" ? <p className="text-[#685652]">Команда уже выбрана. Приём новых откликов закрыт.</p> : <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">Команда<input aria-label="Команда" name="team" required maxLength={100} list="demo-teams" className={inputStyle} /></label>
            <datalist id="demo-teams">{seedTeams.map((team) => <option key={team.id} value={team.name}>{team.skills.join(", ")}</option>)}</datalist>
            <label className="block space-y-2 text-sm font-medium">Идея решения<textarea name="idea" required maxLength={3000} rows={3} className={inputStyle} /></label>
            <label className="block space-y-2 text-sm font-medium">План работы<textarea name="plan" required maxLength={3000} rows={3} className={inputStyle} /></label>
            <label className="block space-y-2 text-sm font-medium">Срок выполнения<input name="deadline" required maxLength={200} placeholder="Например, 3 недели" className={inputStyle} /></label>
            <label className="block space-y-2 text-sm font-medium">Ссылка на материалы (необязательно)<input name="link" type="url" maxLength={2000} placeholder="https://" className={inputStyle} /></label>
            <button type="submit" className={action}>Отправить отклик</button>
          </form>}
        </section>}
      </div>
      <aside className="space-y-4 lg:sticky lg:top-6">
        <ScorePanel card={task} />
        {business && (task.status === "draft" ? <button className={`${action} w-full`} onClick={() => perform(() => useTaskStore.getState().publishTask(id))}>Подтвердить и опубликовать</button> : <Link href={`/tasks/${id}`} className={`${action} w-full`}>Открыть как студент</Link>)}
      </aside>
    </div>
  </TaskShell>;
}
