import { TaskDetail } from "@/components/tasks/task-detail";

export default async function BusinessTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TaskDetail id={id} business />;
}
