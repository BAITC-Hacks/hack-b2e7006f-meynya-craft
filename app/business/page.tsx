"use client";

import Link from "next/link";
import { useTaskStore } from "@/lib/store";
import { action, panel, statusLabels, TaskShell } from "@/components/tasks/task-ui";

export default function BusinessPage() {
  const tasks = useTaskStore((state) => state.tasks);
  return <TaskShell role="business">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-[#6B212C]">Business</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Задачи и отклики</h1><p className="mt-3 text-[#685652]">В демо доступны все задачи бизнеса. Выбор команды всегда остаётся за вами.</p></div><Link href="/create" className={action}>Создать задачу</Link></div>
    <div className="space-y-4">{[...tasks].reverse().map((task) => <article key={task.id} className={panel}>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-[#685652]">{statusLabels[task.status]} · {task.topic}</p><h2 className="mt-2 text-xl font-semibold"><Link href={`/business/${task.id}`} className="hover:underline">{task.title}</Link></h2></div><span className="text-sm font-semibold text-[#6B212C]">{task.score}/100 · {task.level}</span></div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#685652]">Откликов: {task.proposals.length} · Ожидают решения: {task.proposals.filter((item) => item.status === "pending").length}</p><Link href={`/business/${task.id}`} className={action}>Управлять задачей</Link></div>
    </article>)}</div>
    {tasks.length === 0 && <p className={panel}>Пока нет задач. Начните с описания бизнес-проблемы.</p>}
  </TaskShell>;
}
