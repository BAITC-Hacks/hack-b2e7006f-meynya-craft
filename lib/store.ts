import { create } from "zustand";
import { calculateScore } from "./score";
import { seedTasks } from "./seed";
import type { ScoreResult } from "./score";
import type { Proposal, TaskCard } from "./types";

export type TaskContent = Omit<TaskCard, "id" | "score" | "level" | "status" | "proposals">;
export type ProposalInput = Omit<Proposal, "id" | "status">;

const contentFields = [
  "title", "topic", "context", "need", "users", "data", "constraints",
  "expectedResult", "successCriteria", "contact", "interactionFormat",
] as const satisfies readonly (keyof TaskContent)[];

export type TaskStore = {
  tasks: TaskCard[];
  addDraft: (card: TaskCard) => void;
  updateTask: (id: string, changes: Partial<TaskContent>) => void;
  publishTask: (id: string) => void;
  submitProposal: (taskId: string, input: ProposalInput) => string;
  acceptProposal: (taskId: string, proposalId: string) => void;
  rejectProposal: (taskId: string, proposalId: string) => void;
};

function normalizeContent(changes: Partial<TaskContent>): Partial<TaskContent> {
  const result: Partial<TaskContent> = {};
  // Whitelist content fields: callers cannot override score, status or proposals.
  for (const field of contentFields) {
    if (Object.prototype.hasOwnProperty.call(changes, field)) {
      const value = changes[field];
      if (typeof value !== "string") throw new Error(`Поле ${field} должно быть строкой.`);
      result[field] = value.trim() || "Не указано";
    }
  }
  return result;
}

function withScore(card: TaskCard): TaskCard {
  const score = calculateScore(card);
  return { ...card, score: score.total, level: score.level };
}

function pendingProposal(task: TaskCard, proposalId: string): Proposal {
  const proposal = task.proposals.find((item) => item.id === proposalId);
  if (!proposal) throw new Error("Отклик не найден.");
  if (proposal.status !== "pending") throw new Error("По этому отклику уже принято решение.");
  return proposal;
}

// Client-side demo state, not a shared server database. Reloading the page resets it.
// The factory also accepts seed tasks and allows independent stores in tests.
export function createTaskStore(initialTasks: TaskCard[] = []) {
  if (new Set(initialTasks.map((task) => task.id)).size !== initialTasks.length) {
    throw new Error("ID задач не должны повторяться.");
  }

  return create<TaskStore>()((set) => {
    function changeTask(id: string, update: (task: TaskCard) => TaskCard) {
      set((state) => {
        if (!state.tasks.some((task) => task.id === id)) throw new Error("Задача не найдена.");
        return { tasks: state.tasks.map((task) => task.id === id ? update(task) : task) };
      });
    }

    return {
      tasks: initialTasks.map((task) => withScore({
        ...task,
        ...normalizeContent(task),
        proposals: task.proposals.map((proposal) => ({ ...proposal })),
      })),

      addDraft(card) {
        set((state) => {
          if (!card.id.trim()) throw new Error("У карточки должен быть ID.");
          if (state.tasks.some((task) => task.id === card.id)) throw new Error("Эта карточка уже добавлена.");
          const draft = withScore({
            ...card, ...normalizeContent(card), status: "draft", proposals: [],
          });
          return { tasks: [...state.tasks, draft] };
        });
      },

      updateTask(id, changes) {
        const content = normalizeContent(changes);
        changeTask(id, (task) => withScore({ ...task, ...content }));
      },

      publishTask(id) {
        changeTask(id, (task) => {
          if (task.status === "in_progress") throw new Error("Задача уже в работе.");
          return withScore({ ...task, status: "published" });
        });
      },

      submitProposal(taskId, input) {
        const content: ProposalInput = {
          team: input.team, idea: input.idea, plan: input.plan,
          deadline: input.deadline, link: input.link,
        };
        for (const field of ["team", "idea", "plan", "deadline", "link"] as const) {
          if (typeof content[field] !== "string") throw new Error(`Поле ${field} должно быть строкой.`);
          content[field] = content[field].trim();
          if (field !== "link" && (!content[field] || content[field].toLowerCase() === "не указано")) {
            throw new Error("Укажите команду, идею, план и срок выполнения.");
          }
        }
        content.link ||= "Не указано";
        const id = globalThis.crypto.randomUUID();
        changeTask(taskId, (task) => {
          if (task.status !== "published") throw new Error("Задача не принимает новые отклики.");
          const proposal: Proposal = { ...content, id, status: "pending" };
          return { ...task, proposals: [...task.proposals, proposal] };
        });
        return id;
      },

      acceptProposal(taskId, proposalId) {
        changeTask(taskId, (task) => {
          pendingProposal(task, proposalId);
          if (task.status !== "published" || task.proposals.some((item) => item.status === "accepted")) {
            throw new Error("Для этой задачи уже выбрана команда или задача не опубликована.");
          }
          return {
            ...task, status: "in_progress",
            proposals: task.proposals.map((item) => item.id === proposalId ? { ...item, status: "accepted" } : item),
          };
        });
      },

      rejectProposal(taskId, proposalId) {
        changeTask(taskId, (task) => {
          if (task.status === "draft") throw new Error("Задача ещё не опубликована.");
          pendingProposal(task, proposalId);
          return {
            ...task,
            proposals: task.proposals.map((item) => item.id === proposalId ? { ...item, status: "rejected" } : item),
          };
        });
      },
    };
  });
}

export const useTaskStore = createTaskStore(seedTasks);

// Call on the subscribed tasks array (or inside useMemo), not inside a Zustand selector.
export function getCatalog(
  tasks: TaskCard[],
  filters: { topic?: string; level?: ScoreResult["level"] } = {},
): TaskCard[] {
  return tasks.filter((task) =>
    task.status === "published" &&
    (!filters.topic || task.topic === filters.topic) &&
    (!filters.level || calculateScore(task).level === filters.level),
  ).sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
