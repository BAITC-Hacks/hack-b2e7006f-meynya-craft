import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { TaskCard } from "@/lib/types";
import { calculateScore } from "@/lib/score";

export const panel = "rounded-[1.6rem] border border-[#8EA1AE]/28 bg-white p-5 shadow-[0_14px_40px_rgba(39,54,63,0.07)] sm:p-6";
export const action = "group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B212C] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(107,33,44,.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#551923] hover:shadow-[0_12px_26px_rgba(107,33,44,.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6B212C]/20 disabled:pointer-events-none disabled:opacity-40";
export const secondaryAction = "inline-flex items-center justify-center gap-2 rounded-full border border-[#8EA1AE]/45 bg-white px-5 py-2.5 text-sm font-bold text-[#27363F] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#27363F]/35 hover:bg-[#DCE0E8]/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8EA1AE]/25 disabled:pointer-events-none disabled:opacity-40";
export const inputStyle = "w-full rounded-xl border border-[#8EA1AE]/40 bg-white px-3.5 py-3 text-[#27363F] outline-none transition-all placeholder:text-[#8EA1AE] focus:border-[#6B212C] focus:ring-4 focus:ring-[#6B212C]/10";
export const statusLabels: Record<TaskCard["status"], string> = { draft: "Черновик", published: "Опубликована", in_progress: "В работе" };
export const levelLabels: Record<TaskCard["level"], string> = { Draft: "Черновик", Working: "В работе", Ready: "Готова", Priority: "Приоритет" };

const categoryLabels: Record<string, string> = {
  "Context + Need": "Контекст и потребность", Data: "Данные", "Expected Result": "Ожидаемый результат",
  "Success Criteria": "Критерии успеха", Constraints: "Ограничения", Users: "Пользователи", "Business Contact": "Контакт бизнеса",
};

export function LevelBadge({ level }: { level: TaskCard["level"] }) {
  const styles: Record<TaskCard["level"], string> = {
    Draft: "border-[#8EA1AE]/35 bg-[#DCE0E8]/55 text-[#685652]", Working: "border-[#8EA1AE]/45 bg-[#8EA1AE]/18 text-[#27363F]",
    Ready: "border-[#6B212C]/20 bg-[#6B212C]/8 text-[#6B212C]", Priority: "border-[#6B212C] bg-[#6B212C] text-white",
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${styles[level]}`}>{levelLabels[level]}</span>;
}

export function TaskNavigation({ role }: { role: "business" | "student" }) {
  return <header className="relative z-30 border-b border-[#8EA1AE]/25 bg-[#F8F8F6]/90 backdrop-blur-xl">
    <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
      <Link href="/" className="text-xl font-black tracking-[-0.055em] text-[#27363F]">TaskUp<span className="text-[#6B212C]">.</span></Link>
      <nav aria-label="Роль в демо" className="flex items-center rounded-full border border-[#8EA1AE]/30 bg-white p-1 text-sm shadow-sm">
        <Link href="/business" aria-current={role === "business" ? "page" : undefined} className={role === "business" ? "rounded-full bg-[#27363F] px-4 py-2 font-bold text-white" : "rounded-full px-4 py-2 font-semibold text-[#685652] transition hover:bg-[#DCE0E8]/50"}>Business</Link>
        <Link href="/catalog" aria-current={role === "student" ? "page" : undefined} className={role === "student" ? "rounded-full bg-[#27363F] px-4 py-2 font-bold text-white" : "rounded-full px-4 py-2 font-semibold text-[#685652] transition hover:bg-[#DCE0E8]/50"}>Student</Link>
      </nav>
    </div>
  </header>;
}

export function TaskShell({ role, children }: { role: "business" | "student"; children: ReactNode }) {
  return <main className="relative min-h-screen overflow-hidden bg-[#F8F8F6] text-[#27363F]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
    <TaskNavigation role={role} />
    <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-28 size-72 rotate-12 rounded-[43%_57%_62%_38%] bg-[#8EA1AE]/12" />
    <div className="relative mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">{children}</div>
    <footer className="relative mx-auto max-w-7xl border-t border-[#8EA1AE]/25 px-5 py-7 text-xs text-[#685652]/70 sm:px-8">Демо без регистрации. Данные этой вкладки сбрасываются после перезагрузки.</footer>
  </main>;
}

export function ScorePanel({ card }: { card: TaskCard }) {
  const score = calculateScore(card);
  return <section className={`${panel} overflow-hidden`} aria-label="Разбивка оценки">
    <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black tracking-[-0.03em]">Готовность задачи</h2><LevelBadge level={score.level} /></div>
    <div className="my-5 flex items-end justify-between"><p className="text-5xl font-black tracking-[-0.06em] tabular-nums" aria-live="polite">{score.total}<span className="text-sm font-semibold text-[#685652]/55">/100</span></p><Sparkles className="mb-2 size-5 text-[#6B212C]" /></div>
    <div className="h-2 overflow-hidden rounded-full bg-[#DCE0E8]" aria-label={`Общий score ${score.total} из 100`}><div className="h-full rounded-full bg-[#6B212C] transition-[width] duration-700 ease-out" style={{ width: `${score.total}%` }} /></div>
    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#685652]/55">Draft → Working → Ready → Priority</p>
    <ul className="mt-6 space-y-3 text-sm">{score.categories.map((category) => <li key={category.name}><div className="mb-1.5 flex justify-between gap-3"><span className="text-[#685652]">{categoryLabels[category.name] ?? category.name}</span><strong className="tabular-nums">{category.score}/{category.maxScore}</strong></div><div className="h-1 overflow-hidden rounded-full bg-[#DCE0E8]/75"><div className="h-full rounded-full bg-[#8EA1AE] transition-[width] duration-700" style={{ width: `${category.maxScore ? category.score / category.maxScore * 100 : 0}%` }} /></div></li>)}</ul>
    {score.hints.length > 0 && <div className="mt-6 rounded-2xl border border-[#6B212C]/12 bg-[#6B212C]/5 p-4"><h3 className="flex items-center gap-2 font-bold text-[#6B212C]">Что улучшить <ArrowRight className="size-4" /></h3><ul className="mt-3 space-y-2 text-xs leading-5 text-[#685652]">{score.hints.map((hint) => <li key={hint}>• {hint}</li>)}</ul></div>}
  </section>;
}
