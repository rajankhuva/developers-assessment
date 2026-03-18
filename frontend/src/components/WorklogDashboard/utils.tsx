import { Badge } from "@/components/ui/badge"
import type { Worklog } from "@/data/mockData"

export function fmt(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function StatusBadge({ status }: { status: Worklog["status"] }) {
  if (status === "pending") {
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
        Pending
      </Badge>
    )
  }
  if (status === "approved") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
        Approved
      </Badge>
    )
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
      Paid
    </Badge>
  )
}

export function FreelancerAvatar({
  name,
  size = "sm",
}: {
  name: string
  size?: "sm" | "md"
}) {
  const sizeClass = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0`}
    >
      {name.charAt(0)}
    </div>
  )
}
