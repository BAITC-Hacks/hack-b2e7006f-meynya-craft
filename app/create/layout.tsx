import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создать задачу — TaskUp AI",
  description: "Опишите бизнес-проблему, уточните детали и получите структурированную карточку задачи.",
};

export default function CreateLayout({ children }: LayoutProps<"/create">) {
  return children;
}
