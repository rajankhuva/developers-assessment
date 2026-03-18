import { Eye, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Worklog } from "@/data/mockData"
import { StatusBadge, FreelancerAvatar, fmt } from "./utils"

interface WorklogTableProps {
  worklogs: Worklog[]
  allFilteredCount: number
  checkedIds: Set<string>
  onCheck: (id: string) => void
  onSelectAll: () => void
  onViewDetail: (id: string) => void
  onReviewPayment: () => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function WorklogTable({
  worklogs,
  allFilteredCount,
  checkedIds,
  onCheck,
  onSelectAll,
  onViewDetail,
  onReviewPayment,
  page,
  totalPages,
  onPageChange,
}: WorklogTableProps) {
  const allSelected = allFilteredCount > 0 && checkedIds.size === allFilteredCount

  return (
    <Card className="py-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center gap-3">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={onSelectAll}
            aria-label="Select all worklogs"
          />
          <label
            htmlFor="select-all"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            {checkedIds.size > 0
              ? `${checkedIds.size} selected`
              : `${allFilteredCount} worklogs`}
          </label>
        </div>
        {checkedIds.size > 0 && (
          <Button
            size="sm"
            onClick={onReviewPayment}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
            aria-label={`Review ${checkedIds.size} selected worklogs`}
          >
            <CreditCard size={13} />
            Review {checkedIds.size} Worklog{checkedIds.size !== 1 ? "s" : ""}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-10 px-6 py-3" />
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Task / Project
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Freelancer
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                Period
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Hours
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Status
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {worklogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                  No worklogs match the current filter.
                </td>
              </tr>
            ) : (
              worklogs.map((worklog, idx) => (
                <WorklogRow
                  key={worklog.id}
                  worklog={worklog}
                  idx={idx}
                  checked={checkedIds.has(worklog.id)}
                  onCheck={onCheck}
                  onViewDetail={onViewDetail}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {allFilteredCount} total
          </p>
          <div className="flex items-center gap-1">
            <PageButton
              aria-label="Previous page"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                aria-label={`Go to page ${p}`}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
                className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                  p === page
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "text-muted-foreground hover:border-violet-400 hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
            <PageButton
              aria-label="Next page"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={14} />
            </PageButton>
          </div>
        </div>
      )}
    </Card>
  )
}

interface WorklogRowProps {
  worklog: Worklog
  idx: number
  checked: boolean
  onCheck: (id: string) => void
  onViewDetail: (id: string) => void
}

function WorklogRow({ worklog, idx, checked, onCheck, onViewDetail }: WorklogRowProps) {
  return (
    <tr
      className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
        checked
          ? "bg-violet-50/50 dark:bg-violet-900/10"
          : idx % 2 === 1
            ? "bg-muted/10"
            : ""
      }`}
    >
      <td className="px-6 py-3.5">
        <Checkbox
          checked={checked}
          onCheckedChange={() => onCheck(worklog.id)}
          aria-label={`Select worklog ${worklog.taskName}`}
        />
      </td>
      <td className="px-4 py-3.5">
        <p className="font-medium">{worklog.taskName}</p>
        <p className="text-xs text-muted-foreground">
          {worklog.taskId} · {worklog.project}
        </p>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <FreelancerAvatar name={worklog.freelancer.name} size="sm" />
          <div>
            <p className="text-sm font-medium">{worklog.freelancer.name}</p>
            <p className="text-xs text-muted-foreground">
              {fmt(worklog.freelancer.hourlyRate)}/h
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <p className="font-mono text-xs text-muted-foreground">{worklog.periodStart}</p>
        <p className="font-mono text-xs text-muted-foreground">→ {worklog.periodEnd}</p>
      </td>
      <td className="px-4 py-3.5 text-right font-medium tabular-nums">
        {worklog.totalHours}h
      </td>
      <td className="px-4 py-3.5 text-right font-bold text-emerald-600 tabular-nums whitespace-nowrap">
        {fmt(worklog.totalAmount)}
      </td>
      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
        <StatusBadge status={worklog.status} />
      </td>
      <td className="px-4 py-3.5 text-right">
        <button
          aria-label={`View time entries for ${worklog.taskName}`}
          onClick={() => onViewDetail(worklog.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-violet-400 hover:text-violet-600 transition-colors"
        >
          <Eye size={13} />
          View
        </button>
      </td>
    </tr>
  )
}

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

function PageButton({ children, disabled, ...props }: PageButtonProps) {
  return (
    <button
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground hover:border-violet-400 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      {...props}
    >
      {children}
    </button>
  )
}
