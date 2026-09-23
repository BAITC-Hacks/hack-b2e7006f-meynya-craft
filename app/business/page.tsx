"use client";

import Link from "next/link";
import { ArrowRight, CircleDot, Plus, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTaskStore } from "@/lib/store";
import { action, LevelBadge, statusLabels, TaskShell } from "@/components/tasks/task-ui";

export default function BusinessPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const pending = tasks.reduce((total, task) => total + task.proposals.filter((item) => item.status === "pending").length, 0);
  return <TaskShell role="business">
    <section className="relative border-b border-[#8EA1AE]/25 pb-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
        <div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-[#6B212C]"><span className="h-px w-8 bg-[#6B212C]" /> Кабинет бизнеса</p><h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl">Задачи и<br /><span className="text-[#6B212C]">команды</span></h1><p className="mt-5 max-w-2xl leading-7 text-[#685652]/80">Редактируйте карточки, публикуйте задачи и выбирайте команду вручную.</p></div>
        <Link href="/create" className={`${action} h-12 self-start px-6 lg:self-end`}><Plus className="size-4" /> Создать задачу</Link>
      </motion.div>
      <div className="mt-9 grid max-w-xl grid-cols-2 gap-3"><div className="rounded-2xl border border-[#8EA1AE]/28 bg-white p-4"><p className="text-3xl font-black tracking-[-.05em]">{tasks.length}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#685652]/60">Всего задач</p></div><div className="rotate-1 rounded-2xl border-2 border-[#27363F] bg-[#DCE0E8] p-4 shadow-[4px_4px_0_#27363F]"><p className="text-3xl font-black tracking-[-.05em]">{pending}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#685652]">Ждут решения</p></div></div>
    </section>

    <div className="space-y-4">{[...tasks].reverse().map((task, index) => <motion.article key={task.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .045, .28) }} whileHover={{ x: 4 }} className="rounded-[1.5rem] border border-[#8EA1AE]/28 bg-white p-5 shadow-[0_10px_30px_rgba(39,54,63,.06)] sm:p-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#685652]/65">{statusLabels[task.status]}</span><span className="text-[#8EA1AE]">•</span><span className="text-xs font-bold text-[#685652]">{task.topic}</span><LevelBadge level={task.level} /></div><h2 className="mt-3 text-xl font-black tracking-[-.035em] sm:text-2xl"><Link href={`/business/${task.id}`} className="transition hover:text-[#6B212C]">{task.title}</Link></h2><div className="mt-4 flex flex-wrap gap-4 text-sm text-[#685652]"><span className="flex items-center gap-1.5"><Users className="size-4" /> {task.proposals.length} откликов</span><span className="flex items-center gap-1.5"><CircleDot className="size-4 text-[#6B212C]" /> {task.proposals.filter((item) => item.status === "pending").length} ожидают</span><strong className="text-[#27363F]">{task.score}/100</strong></div></div><Link href={`/business/${task.id}`} className={`${action} md:justify-self-end`}>Управлять <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></div>
    </motion.article>)}</div>
    {tasks.length === 0 && <div className="rounded-[1.6rem] border border-dashed border-[#8EA1AE]/45 bg-white p-10 text-center"><h2 className="text-xl font-black">Пока нет задач</h2><p className="mt-2 text-[#685652]">Начните с описания бизнес-проблемы.</p></div>}
  </TaskShell>;
}
