"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, MessagesSquare, SearchX, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { getCatalog, useTaskStore } from "@/lib/store";
import type { TaskCard } from "@/lib/types";
import { action, inputStyle, LevelBadge, TaskShell } from "@/components/tasks/task-ui";

export default function CatalogPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<TaskCard["level"] | "">("");
  const topics = [...new Set(tasks.filter((task) => task.status === "published").map((task) => task.topic))].sort();
  const catalog = getCatalog(tasks, { topic: topic || undefined, level: level || undefined });

  return <TaskShell role="student">
    <section className="relative border-b border-[#8EA1AE]/25 pb-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#6B212C]"><span className="h-px w-8 bg-[#6B212C]" /> Для студенческих команд</p>
        <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><h1 className="max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.055em] sm:text-6xl">Задачи, которые<br /><span className="text-[#6B212C]">можно решить сейчас</span></h1><p className="mt-5 max-w-2xl leading-7 text-[#685652]/80">Выберите задачу бизнеса и предложите свой план. Карточки отсортированы по качеству постановки.</p></div><div className="self-start rotate-[-2deg] rounded-2xl border-2 border-[#27363F] bg-[#DCE0E8] px-5 py-3 text-sm font-black shadow-[5px_5px_0_#27363F] lg:self-end">{catalog.length} задач найдено</div></div>
      </motion.div>
    </section>

    <section className="rounded-2xl border border-[#8EA1AE]/28 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end"><div className="flex items-center gap-2 pb-3 text-sm font-black"><SlidersHorizontal className="size-4 text-[#6B212C]" /> Фильтры</div><label className="space-y-2 text-xs font-bold text-[#685652]">Тема<select aria-label="Тема" className={inputStyle} value={topic} onChange={(event) => setTopic(event.target.value)}><option value="">Все темы</option>{topics.map((item) => <option key={item}>{item}</option>)}</select></label><label className="space-y-2 text-xs font-bold text-[#685652]">Уровень<select aria-label="Уровень" className={inputStyle} value={level} onChange={(event) => setLevel(event.target.value as TaskCard["level"] | "")}><option value="">Все уровни</option>{["Draft", "Working", "Ready", "Priority"].map((item) => <option key={item}>{item}</option>)}</select></label><button className="h-11 rounded-full px-4 text-sm font-bold text-[#6B212C] transition hover:bg-[#6B212C]/6" onClick={() => { setTopic(""); setLevel(""); }}>Сбросить</button></div>
    </section>

    <p className="sr-only" aria-live="polite">Найдено задач: {catalog.length}</p>
    {catalog.length === 0 ? <div className="grid min-h-64 place-items-center rounded-[1.6rem] border border-dashed border-[#8EA1AE]/50 bg-white text-center"><div className="max-w-sm p-8"><SearchX className="mx-auto mb-4 size-9 text-[#8EA1AE]" /><h2 className="text-xl font-black">Задач по этим фильтрам нет</h2><p className="mt-2 text-sm text-[#685652]">Измените фильтры или опубликуйте задачу в роли Business.</p></div></div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {catalog.map((task, index) => <motion.article key={task.id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .06, .3) }} whileHover={{ y: -6 }} className="group flex min-h-[330px] flex-col rounded-[1.7rem] border border-[#8EA1AE]/28 bg-white p-6 shadow-[0_14px_38px_rgba(39,54,63,.07)] transition-shadow hover:shadow-[0_22px_52px_rgba(39,54,63,.13)]">
        <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-[#DCE0E8]/55 px-3 py-1 text-xs font-bold text-[#685652]">{task.topic}</span><LevelBadge level={task.level} /></div>
        <h2 className="mt-7 text-2xl font-black leading-tight tracking-[-0.04em]"><Link href={`/tasks/${task.id}`} className="outline-none after:absolute focus-visible:underline">{task.title}</Link></h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#685652]/80">{task.need}</p>
        <div className="mt-auto pt-7"><div className="mb-2 flex items-end justify-between"><span className="text-xs font-bold text-[#685652]/65">Качество задачи</span><strong className="text-xl tabular-nums">{task.score}<small className="text-xs text-[#685652]/55">/100</small></strong></div><div className="h-1.5 overflow-hidden rounded-full bg-[#DCE0E8]"><div className="h-full rounded-full bg-[#6B212C] transition-[width] duration-700" style={{ width: `${task.score}%` }} /></div><div className="mt-5 flex items-center justify-between border-t border-[#DCE0E8] pt-4"><span className="flex items-center gap-2 text-xs font-semibold text-[#685652]/70"><MessagesSquare className="size-4" /> {task.proposals.length} откликов</span><Link href={`/tasks/${task.id}`} className={`${action} px-4 py-2`}>Открыть <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div></div>
      </motion.article>)}
    </div>}
  </TaskShell>;
}
