import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = { title: "TaskUp — задачи бизнеса для студентов", description: "AI помогает превратить бизнес-проблему в понятную задачу и найти студенческую команду." };

export default function Home() {
  return <LandingPage />;
}
