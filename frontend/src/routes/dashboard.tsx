import { createFileRoute } from "@tanstack/react-router"
import { WorklogDashboard } from "@/components/WorklogDashboard"

export const Route = createFileRoute("/dashboard")({
  component: WorklogDashboard,
  head: () => ({
    meta: [{ title: "WorkLog Payment Dashboard" }],
  }),
})
