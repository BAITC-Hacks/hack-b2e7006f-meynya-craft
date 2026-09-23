import Link from "next/link";
import type { ReactNode } from "react";
import type { TaskCard } from "@/lib/types";
import { calculateScore } from "@/lib/score";

export const panel = "rounded-2xl border border-[#8EA1AE]/25 bg-white p-6 shadow-sm";
export const action = "inline-flex items-center justify-center rounded-xl bg-[#6B212C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#571923] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B212C] disabled:opacity-40";
export const inputStyle = "w-full rounded-xl border border-[#8EA1AE]/40 bg-white px-3 py-2.5 text-[#27363F] focus:outline-2 focus:outline-[#6B212C]";
export const statusLabels: Record<TaskCard["status"], string> = {
  draft: "Черновик", published: "Опубликована", in_progress: "В работе",
};

export function TaskNavigation({ role }: { role: "business" | "student" }) {
  return <header className="border-b border-[#8EA1AE]/25 bg-white/90">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
      <Link href="/" className="text-xl font-bold tracking-tight">TaskUp AI</Link>
      <nav aria-label="Роль в демо" className="flex items-center gap-2 text-sm">
        <Link href="/business" aria-current={role === "business" ? "page" : undefined} className={role === "business" ? action : "rounded-xl px-4 py-2.5 hover:bg-[#DCE0E8]/50"}>Business</Link>
        <Link href="/catalog" aria-current={role === "student" ? "page" : undefined} className={role === "student" ? action : "rounded-xl px-4 py-2.5 hover:bg-[#DCE0E8]/50"}>Student</Link>
      </nav>
    </div>
  </header>;
}

export function TaskShell({ role, children }: { role: "business" | "student"; children: ReactNode }) {
  return <main className="min-h-screen bg-[#DCE0E8]/35 text-[#27363F]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
    <TaskNavigation role={role} />
    <div className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">{children}</div>
    <footer className="mx-auto max-w-6xl px-5 py-6 text-sm text-[#685652]">Демо без регистрации. Данные этой вкладки сбрасываются после перезагрузки.</footer>
  </main>;
}

export function ScorePanel({ card }: { card: TaskCard }) {
  const score = calculateScore(card);
  return <section className={panel} aria-label="Разбивка оценки">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Готовность задачи</h2>
      <span className="rounded-full bg-[#6B212C]/10 px-3 py-1 text-sm font-semibold text-[#6B212C]">{score.level}</span>
    </div>
    <p className="my-4 text-4xl font-semibold tabular-nums" aria-live="polite">{score.total}<span className="text-lg text-[#685652]">/100</span></p>
    <progress aria-label="Общий score" value={score.total} max={100} className="h-2 w-full accent-[#6B212C]" />
    <p className="mt-2 text-xs text-[#685652]">Draft → Working → Ready → Priority</p>
    <ul className="mt-5 space-y-3 text-sm">
      {score.categories.map((category) => <li key={category.name} className="flex justify-between gap-3"><span>{category.name}</span><strong className="tabular-nums">{category.score}/{category.maxScore}</strong></li>)}
    </ul>
    {score.hints.length > 0 && <div className="mt-5 border-t border-[#8EA1AE]/25 pt-4"><h3 className="font-semibold">Что улучшить</h3><ul className="mt-2 space-y-2 text-sm text-[#685652]">{score.hints.map((hint) => <li key={hint}>{hint}</li>)}</ul></div>}
  </section>;
}
