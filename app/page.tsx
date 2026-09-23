import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ClipboardCheck, MessageSquareText, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "TaskUp AI — задачи бизнеса для студентов",
  description: "AI помогает превратить бизнес-проблему в понятную и структурированную задачу для студенческих команд.",
};

const steps = [
  { icon: MessageSquareText, number: "01", title: "Опишите задачу", text: "Расскажите о бизнес-проблеме обычными словами — без технического задания." },
  { icon: Sparkles, number: "02", title: "Уточните детали", text: "AI найдёт пробелы и задаст только те вопросы, которые важны для результата." },
  { icon: ClipboardCheck, number: "03", title: "Получите карточку", text: "Система соберёт понятную задачу, готовую для публикации студенческим командам." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#DCE0E8]/35 text-[#27363F]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <header className="border-b border-[#8EA1AE]/25 bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-[-0.03em] text-[#27363F]">TaskUp AI</Link>
          <Link href="/create" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#6B212C] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#571923] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6B212C]/20">
            Создать задачу <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8EA1AE]/30 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B212C]">
            <Sparkles className="size-3.5" /> AI для задач от бизнеса
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#27363F] sm:text-6xl">От бизнес-проблемы — к задаче для студентов</h1>
            <p className="max-w-2xl text-lg leading-8 text-[#685652]/85 sm:text-xl">Опишите проблему своими словами. AI поможет уточнить детали и превратит описание в понятную структурированную карточку.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/create" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#6B212C] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(107,33,44,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#571923] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6B212C]/20">
              Предложить задачу <ArrowRight className="size-4" />
            </Link>
            <span className="text-sm text-[#685652]/65">Первый черновик — за несколько минут</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-[#8EA1AE]/10" aria-hidden="true" />
          <div className="relative rounded-3xl border border-[#8EA1AE]/25 bg-white/95 p-6 shadow-[0_24px_70px_rgba(39,54,63,0.12)] sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#6B212C]/10 text-[#6B212C]"><Building2 className="size-5" /></span>
                <div><p className="text-sm font-semibold">Карточка задачи</p><p className="text-xs text-[#685652]/60">Создано с AI</p></div>
              </div>
              <span className="rounded-full bg-[#DCE0E8]/60 px-3 py-1 text-xs font-medium text-[#685652]">Черновик</span>
            </div>
            <div className="space-y-5">
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#685652]/60">Название</p><div className="h-3 w-4/5 rounded-full bg-[#27363F]/80" /></div>
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#685652]/60">Бизнес-потребность</p><div className="space-y-2"><div className="h-2.5 rounded-full bg-[#8EA1AE]/35" /><div className="h-2.5 w-5/6 rounded-full bg-[#8EA1AE]/35" /></div></div>
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#685652]/60">Ожидаемый результат</p><div className="space-y-2"><div className="h-2.5 rounded-full bg-[#8EA1AE]/35" /><div className="h-2.5 w-2/3 rounded-full bg-[#8EA1AE]/35" /></div></div>
            </div>
            <div className="mt-7 flex items-center gap-2 rounded-xl border border-[#6B212C]/12 bg-[#6B212C]/5 p-3 text-sm font-medium text-[#6B212C]"><ClipboardCheck className="size-4" /> Готово к проверке</div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#8EA1AE]/20 bg-white/65">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <div className="mb-9 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#6B212C]">Как это работает</p>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#27363F]">Три шага до понятной задачи</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, text }) => (
              <article key={number} className="rounded-2xl border border-[#8EA1AE]/25 bg-white p-6 shadow-[0_12px_36px_rgba(39,54,63,0.06)]">
                <div className="mb-5 flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-xl bg-[#6B212C]/9 text-[#6B212C]"><Icon className="size-5" /></span><span className="text-xs font-semibold text-[#8EA1AE]">{number}</span></div>
                <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em] text-[#27363F]">{title}</h3>
                <p className="text-sm leading-6 text-[#685652]/75">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#27363F] p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Есть задача для студентов?</h2><p className="mt-2 text-sm leading-6 text-white/65">Начните с короткого описания — структуру поможет собрать AI.</p></div>
          <Link href="/create" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#27363F] transition-colors hover:bg-[#DCE0E8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25">Начать <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </main>
  );
}
