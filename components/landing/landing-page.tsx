"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, Sparkles, WandSparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getCatalog, useTaskStore } from "@/lib/store";
import { LevelBadge } from "@/components/tasks/task-ui";

const steps = [
  { n: "01", title: "Сырая идея", text: "Расскажите о проблеме обычными словами." },
  { n: "02", title: "AI-структура", text: "Ответьте только на важные уточнения." },
  { n: "03", title: "Готовая задача", text: "Опубликуйте карточку для команд." },
];

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const tasks = useTaskStore((state) => state.tasks);
  const featured = getCatalog(tasks).slice(0, 3);
  const reveal = { initial: { opacity: 0, y: reduceMotion ? 0 : 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: .55 } };

  return <main className="overflow-hidden bg-[#F8F8F6] text-[#27363F]">
    <header className="relative z-20 border-b border-[#8EA1AE]/25 bg-[#F8F8F6]/90 backdrop-blur-xl"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8"><Link href="/" className="text-xl font-black tracking-[-.055em]">TaskUp<span className="text-[#6B212C]">.</span></Link><nav className="flex items-center gap-1 sm:gap-3"><Link href="/business" className="rounded-full px-3 py-2 text-sm font-bold transition hover:bg-[#DCE0E8]/55 sm:px-4">Business</Link><Link href="/catalog" className="rounded-full px-3 py-2 text-sm font-bold transition hover:bg-[#DCE0E8]/55 sm:px-4">Student</Link><Link href="/create" className="rounded-full bg-[#6B212C] px-4 py-2 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#551923]">Создать задачу</Link></nav></div></header>

    <section className="relative mx-auto min-h-[730px] max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: [-6, -3, -6], y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute right-[8%] top-20 hidden h-48 w-72 rounded-[42%_58%_35%_65%] bg-[#8EA1AE]/20 lg:block" />
      <div className="relative grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <div className="mb-7 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-[#27363F] bg-white px-4 py-2 text-xs font-black uppercase tracking-[.14em] shadow-[4px_4px_0_#27363F]"><Sparkles className="size-4 text-[#6B212C]" /> Идеи, которые становятся делом</div>
          <h1 className="max-w-4xl text-[clamp(3.2rem,7vw,6.7rem)] font-black leading-[.88] tracking-[-.075em]">Задачи бизнеса.<br /><span className="relative text-[#6B212C]">Энергия студентов.<svg className="absolute -bottom-3 left-0 h-4 w-full" viewBox="0 0 500 20" fill="none" aria-hidden="true"><path d="M3 14C119 2 351 5 495 10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg></span></h1>
          <p className="mt-10 max-w-xl text-lg leading-8 text-[#685652]/85">AI превращает неоформленную бизнес-проблему в ясную задачу. Команды находят её в каталоге и предлагают решение.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/create" className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#6B212C] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(107,33,44,.2)] transition-all hover:-translate-y-1 hover:bg-[#551923]">Создать задачу <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link><Link href="/catalog" className="group inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-[#27363F] px-6 text-sm font-bold transition-all hover:-translate-y-1 hover:bg-[#DCE0E8]/45">Смотреть каталог <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></Link></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .15, duration: .65 }} className="relative min-h-[475px]">
          <div className="absolute left-0 top-2 w-[72%] -rotate-3 rounded-[2rem] border-2 border-[#27363F] bg-white p-6 shadow-[8px_8px_0_#27363F]"><span className="text-xs font-black uppercase tracking-[.15em] text-[#6B212C]">Сырая идея</span><p className="mt-4 text-xl font-bold leading-snug">«Мы тратим слишком много времени на повторяющиеся вопросы клиентов…»</p><div className="mt-5 h-2 w-3/4 rounded-full bg-[#DCE0E8]" /></div>
          <motion.div animate={reduceMotion ? undefined : { x: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.8 }} className="absolute right-3 top-[39%] z-10 grid size-24 rotate-6 place-items-center rounded-[45%_55%_60%_40%] bg-[#6B212C] text-center text-sm font-black text-white shadow-lg"><WandSparkles className="size-6" />AI</motion.div>
          <div className="absolute bottom-0 right-0 w-[78%] rotate-2 rounded-[2rem] border-2 border-[#27363F] bg-[#DCE0E8] p-6 shadow-[8px_8px_0_#27363F]"><span className="text-xs font-black uppercase tracking-[.15em] text-[#6B212C]">Готовая задача</span><h2 className="mt-3 text-2xl font-black">AI-помощник поддержки</h2><div className="mt-5 space-y-3 text-sm font-semibold text-[#685652]"><p className="flex gap-2"><Check className="size-4 text-[#6B212C]" /> Контекст и потребность</p><p className="flex gap-2"><Check className="size-4 text-[#6B212C]" /> Данные и результат</p><p className="flex gap-2"><Check className="size-4 text-[#6B212C]" /> Измеримый успех</p></div></div>
        </motion.div>
      </div>
    </section>

    <section className="border-y border-[#27363F] bg-[#27363F] text-white"><div className="mx-auto grid max-w-7xl gap-px bg-white/20 sm:grid-cols-3">{steps.map((step, index) => <motion.article key={step.n} {...reveal} transition={{ delay: index * .08, duration: .5 }} className="relative bg-[#27363F] p-7 sm:p-9"><span className="text-xs font-black tracking-[.16em] text-[#8EA1AE]">{step.n}</span><h2 className="mt-5 text-2xl font-black tracking-[-.04em]">{step.title}</h2><p className="mt-2 text-sm leading-6 text-white/65">{step.text}</p>{index < 2 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden size-8 rounded-full bg-[#6B212C] p-2 sm:block" />}</motion.article>)}</div></section>

    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"><motion.div {...reveal} className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#6B212C]">Уже в каталоге</p><h2 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-6xl">Задачи ждут<br />свою команду</h2></div><Link href="/catalog" className="group inline-flex items-center gap-2 text-sm font-black text-[#6B212C]">Открыть весь каталог <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></motion.div><div className="grid gap-4 lg:grid-cols-3">{featured.map((task, index) => <motion.article key={task.id} {...reveal} transition={{ delay: index * .08, duration: .5 }} whileHover={{ y: -6, rotate: index === 1 ? 1 : -1 }} className="rounded-[1.7rem] border border-[#8EA1AE]/30 bg-white p-6 shadow-[0_14px_40px_rgba(39,54,63,.07)]"><div className="flex justify-between gap-2"><span className="text-xs font-bold text-[#685652]">{task.topic}</span><LevelBadge level={task.level} /></div><h3 className="mt-8 text-2xl font-black leading-tight tracking-[-.04em]">{task.title}</h3><div className="mt-8 flex items-end justify-between border-t border-[#DCE0E8] pt-4"><span className="text-3xl font-black">{task.score}<small className="text-xs text-[#685652]/55">/100</small></span><Link href={`/tasks/${task.id}`} className="grid size-10 place-items-center rounded-full bg-[#6B212C] text-white transition hover:scale-110"><ArrowRight className="size-4" /><span className="sr-only">Открыть задачу</span></Link></div></motion.article>)}</div></section>

    <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24"><motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] bg-[#6B212C] p-8 text-white sm:p-12"><div className="absolute -right-12 -top-16 size-56 rounded-full border-[28px] border-white/10" aria-hidden="true" /><p className="text-xs font-black uppercase tracking-[.17em] text-white/60">Начните с одной фразы</p><h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.05em] sm:text-5xl">Дайте хорошей идее форму — и команду для воплощения.</h2><div className="mt-8 flex flex-wrap gap-3"><Link href="/create" className="rounded-full bg-white px-6 py-3 text-sm font-black text-[#6B212C] transition hover:-translate-y-1">Создать задачу</Link><Link href="/catalog" className="rounded-full border border-white/35 px-6 py-3 text-sm font-black transition hover:bg-white/10">Смотреть задачи</Link></div></motion.div></section>
  </main>;
}
