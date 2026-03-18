import { createFileRoute } from "@tanstack/react-router";

import { WorklogDashboard } from "@/components/WorklogDashboard";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - FastAPI Cloud",
      },
    ],
  }),
});

function Dashboard() {
  return (
    <div>
      <WorklogDashboard />
    </div>
  );
}
