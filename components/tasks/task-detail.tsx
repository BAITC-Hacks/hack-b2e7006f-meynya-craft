"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, ExternalLink, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTaskStore } from "@/lib/store";
import { seedTeams } from "@/lib/seed";
import { EditableTaskField } from "@/components/create-task/editable-task-field";
import { fieldLabels, type TaskFieldKey } from "@/components/create-task/types";
import { action, inputStyle, LevelBadge, panel, ScorePanel, secondaryAction, statusLabels, TaskShell } from "./task-ui";

const proposalLabels = { pending: "Ожидает решения", accepted: "Принят", rejected: "Отклонён" } as const;

export function TaskDetail({ id, business }: { id: string; business: boolean }) {
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === id));
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const role = business ? "business" : "student";
  if (!task || (!business && task.status === "draft")) return <TaskShell role={role}><div className={`${panel} mx-auto max-w-xl text-center`}><p className="text-6xl font-black text-[#DCE0E8]">404</p><h1 className="mt-3 text-2xl font-black">Задача недоступна</h1><p className="my-4 text-[#685652]">Она ещё не опубликована или отсутствует в этой вкладке.</p><Link href={business ? "/business" : "/catalog"} className={action}>Вернуться к задачам</Link></div></TaskShell>;

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
        plan: String(values.get("plan") ?? ""), deadline: String(values.get("deadline") ?? ""), link: String(values.get("link") ?? ""),
      });
      setSent(true);
    });
  }

  return <TaskShell role={role}>
    <Link href={business ? "/business" : "/catalog"} className="inline-flex items-center gap-2 text-sm font-bold text-[#685652] transition hover:text-[#6B212C]"><ArrowLeft className="size-4" /> {business ? "Задачи бизнеса" : "Каталог задач"}</Link>
    <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative border-b border-[#8EA1AE]/25 pb-9">
      <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#DCE0E8]/60 px-3 py-1 text-xs font-bold text-[#685652]">{task.topic}</span><LevelBadge level={task.level} /><span className="rounded-full border border-[#8EA1AE]/30 px-3 py-1 text-xs font-bold text-[#685652]">{statusLabels[task.status]}</span></div>
      <h1 className="mt-5 max-w-5xl break-words text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl">{task.title}</h1>
      {task.status === "in_progress" && <div className="mt-5 inline-flex rotate-[-1deg] items-center gap-2 rounded-xl border-2 border-[#27363F] bg-[#DCE0E8] px-4 py-2 text-sm font-black shadow-[4px_4px_0_#27363F]"><Check className="size-4" /> Команда выбрана</div>}
    </motion.header>
    {error && <p role="alert" className="rounded-xl border border-[#6B212C]/20 bg-[#6B212C]/6 p-4 text-sm font-semibold text-[#6B212C]">{error}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-7">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className={`${panel} py-2`} aria-label="Поля карточки">
          {(Object.keys(fieldLabels) as TaskFieldKey[]).map((field) => business ?
            <EditableTaskField key={field} label={fieldLabels[field]} value={task[field]} singleLine={field === "title" || field === "topic"} onSave={(value) => perform(() => useTaskStore.getState().updateTask(id, { [field]: value }))} /> :
            <div key={field} className="border-b border-[#8EA1AE]/20 py-5 first:pt-3 last:border-0"><h2 className="text-xs font-black uppercase tracking-[.13em] text-[#6B212C]">{fieldLabels[field]}</h2><p className={`mt-2 whitespace-pre-wrap break-words leading-7 ${task[field] === "Не указано" ? "italic text-[#8EA1AE]" : "text-[#685652]"}`}>{task[field]}</p></div>,
          )}
        </motion.section>

        {business ? <section className={`${panel} space-y-5`} aria-label="Отклики команд">
          <div><p className="text-xs font-black uppercase tracking-[.15em] text-[#6B212C]">Решение принимает бизнес</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Отклики команд</h2></div>
          {task.proposals.length === 0 && <div className="rounded-2xl border border-dashed border-[#8EA1AE]/45 p-7 text-center"><Clock3 className="mx-auto mb-3 size-7 text-[#8EA1AE]" /><p className="text-[#685652]">Откликов пока нет. Опубликуйте задачу и предложите студентам откликнуться.</p></div>}
          {task.proposals.map((proposal, index) => <motion.article key={proposal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="rounded-2xl border border-[#8EA1AE]/28 bg-[#F8F8F6] p-5">
            <div className="flex flex-wrap justify-between gap-2"><div><h3 className="text-lg font-black">{proposal.team}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#685652]/60">Срок: {proposal.deadline}</p></div><span className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${proposal.status === "accepted" ? "bg-[#6B212C] text-white" : proposal.status === "rejected" ? "bg-[#685652]/12 text-[#685652]" : "bg-[#DCE0E8] text-[#27363F]"}`}>{proposalLabels[proposal.status]}</span></div>
            <div className="mt-5 grid gap-4 text-sm leading-6 text-[#685652] sm:grid-cols-2"><p className="whitespace-pre-wrap break-words"><strong className="block text-[#27363F]">Идея</strong>{proposal.idea}</p><p className="whitespace-pre-wrap break-words"><strong className="block text-[#27363F]">План</strong>{proposal.plan}</p></div>
            {/^https?:\/\//i.test(proposal.link) ? <a href={proposal.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 break-all text-sm font-bold text-[#6B212C] underline underline-offset-4">Материалы команды <ExternalLink className="size-3.5" /></a> : <p className="mt-4 break-all text-sm text-[#685652]">Ссылка: {proposal.link}</p>}
            {proposal.status === "pending" && <div className="mt-5 flex flex-wrap gap-2 border-t border-[#DCE0E8] pt-4"><button className={action} disabled={task.status !== "published"} onClick={() => perform(() => useTaskStore.getState().acceptProposal(id, proposal.id))}><Check className="size-4" /> Принять</button><button className={secondaryAction} disabled={task.status === "draft"} onClick={() => perform(() => useTaskStore.getState().rejectProposal(id, proposal.id))}><X className="size-4" /> Отклонить</button></div>}
          </motion.article>)}
        </section> : <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`${panel} overflow-hidden`} aria-label="Отправка отклика">
          <p className="text-xs font-black uppercase tracking-[.15em] text-[#6B212C]">Для студенческой команды</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Предложить решение</h2><p className="mt-2 text-sm text-[#685652]/75">Опишите идею и реалистичный план. Команду выбирает бизнес.</p>
          {sent ? <div role="status" className="mt-6 rounded-2xl border border-[#6B212C]/15 bg-[#6B212C]/5 p-5"><Check className="mb-3 size-7 text-[#6B212C]" /><p className="font-bold text-[#6B212C]">Отклик отправлен. Решение принимает бизнес.</p><Link href={`/business/${id}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4">Посмотреть в роли Business <ArrowRight className="size-4" /></Link></div> : task.status !== "published" ? <p className="mt-6 rounded-xl bg-[#DCE0E8]/55 p-4 text-[#685652]">Команда уже выбрана. Приём новых откликов закрыт.</p> : <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block space-y-2 text-sm font-bold">Команда<input aria-label="Команда" name="team" required maxLength={100} list="demo-teams" className={inputStyle} placeholder="Название команды" /></label><datalist id="demo-teams">{seedTeams.map((team) => <option key={team.id} value={team.name}>{team.skills.join(", ")}</option>)}</datalist>
            <label className="block space-y-2 text-sm font-bold">Идея решения<textarea name="idea" required maxLength={3000} rows={4} className={inputStyle} placeholder="Как вы предлагаете решить задачу?" /></label>
            <label className="block space-y-2 text-sm font-bold">План работы<textarea name="plan" required maxLength={3000} rows={4} className={inputStyle} placeholder="Основные этапы работы" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-2 text-sm font-bold">Срок выполнения<input name="deadline" required maxLength={200} placeholder="Например, 3 недели" className={inputStyle} /></label><label className="block space-y-2 text-sm font-bold">Материалы <span className="font-normal text-[#685652]/60">необязательно</span><input name="link" type="url" maxLength={2000} placeholder="https://" className={inputStyle} /></label></div>
            <button type="submit" className={`${action} mt-2`}><Send className="size-4" /> Отправить отклик</button>
          </form>}
        </motion.section>}
      </div>
      <aside className="space-y-4 lg:sticky lg:top-6"><ScorePanel card={task} />{business && (task.status === "draft" ? <button className={`${action} w-full`} onClick={() => perform(() => useTaskStore.getState().publishTask(id))}>Подтвердить и опубликовать <ArrowRight className="size-4" /></button> : <Link href={`/tasks/${id}`} className={`${secondaryAction} w-full`}>Открыть как студент <ArrowRight className="size-4" /></Link>)}</aside>
    </div>
  </TaskShell>;
}
