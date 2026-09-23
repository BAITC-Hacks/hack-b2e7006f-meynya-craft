"use client";

import Link from "next/link";
import { useState } from "react";
import { getCatalog, useTaskStore } from "@/lib/store";
import type { TaskCard } from "@/lib/types";
import { action, inputStyle, panel, TaskShell } from "@/components/tasks/task-ui";

export default function CatalogPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<TaskCard["level"] | "">("");
  const topics = [...new Set(tasks.filter((task) => task.status === "published").map((task) => task.topic))].sort();
  const catalog = getCatalog(tasks, { topic: topic || undefined, level: level || undefined });
  return <TaskShell role="student">
    <div><p className="text-sm font-semibold uppercase tracking-widest text-[#6B212C]">Для студенческих команд</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Каталог задач</h1><p className="mt-3 text-[#685652]">Выберите задачу бизнеса и предложите свой план. Сначала — карточки с самым высоким score.</p></div>
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
      <label className="space-y-2 text-sm font-medium">Тема<select aria-label="Тема" className={inputStyle} value={topic} onChange={(event) => setTopic(event.target.value)}><option value="">Все темы</option>{topics.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="space-y-2 text-sm font-medium">Уровень<select aria-label="Уровень" className={inputStyle} value={level} onChange={(event) => setLevel(event.target.value as TaskCard["level"] | "")}><option value="">Все уровни</option>{["Draft", "Working", "Ready", "Priority"].map((item) => <option key={item}>{item}</option>)}</select></label>
      <button className="self-end rounded-xl border border-[#8EA1AE]/40 px-4 py-2.5 text-sm" onClick={() => { setTopic(""); setLevel(""); }}>Сбросить фильтры</button>
    </div>
    <p className="text-sm text-[#685652]" aria-live="polite">Найдено задач: {catalog.length}</p>
    {catalog.length === 0 ? <div className={panel}><h2 className="font-semibold">Задач по этим фильтрам нет</h2><p className="mt-2 text-[#685652]">Измените фильтры или опубликуйте задачу в роли Business.</p></div> : <div className="grid gap-5 md:grid-cols-2">
      {catalog.map((task) => <article key={task.id} className={`${panel} flex flex-col gap-4`}>
        <div className="flex items-center justify-between gap-3 text-sm"><span className="text-[#685652]">{task.topic}</span><span className="rounded-full bg-[#6B212C]/10 px-3 py-1 font-semibold text-[#6B212C]">{task.score}/100 · {task.level}</span></div>
        <h2 className="text-xl font-semibold"><Link href={`/tasks/${task.id}`} className="hover:underline">{task.title}</Link></h2>
        <p className="line-clamp-3 text-sm leading-6 text-[#685652]">{task.need}</p>
        <div className="mt-auto flex items-center justify-between gap-3"><span className="text-sm text-[#685652]">Откликов: {task.proposals.length}</span><Link href={`/tasks/${task.id}`} className={action}>Открыть задачу</Link></div>
      </article>)}
    </div>}
  </TaskShell>;
}
