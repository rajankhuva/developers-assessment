import { Calendar, Users, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { mockFreelancers } from "@/data/mockData"

interface WorklogFiltersProps {
  activeFilter: string | null
  onFilterChange: (filter: string) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (val: string) => void
  onDateToChange: (val: string) => void
  statusFilter: string
  onStatusChange: (val: string) => void
  freelancerFilter: string
  onFreelancerChange: (val: string) => void
  onClearFilters: () => void
}

const STATUS_OPTIONS = ["pending", "approved", "paid"] as const

const STATUS_ACTIVE_CLASSES: Record<string, string> = {
  pending:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

interface FilterTabProps {
  label: string
  icon?: React.ReactNode
  active: boolean
  badge?: string
  onClick: () => void
}

function FilterTab({ label, icon, active, badge, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
          : "border-border text-muted-foreground hover:border-violet-300 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      {active && badge && (
        <span className="ml-1 rounded-full bg-violet-500 px-1.5 text-white text-[10px]">
          {badge}
        </span>
      )}
    </button>
  )
}

export function WorklogFilters({
  activeFilter,
  onFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  statusFilter,
  onStatusChange,
  freelancerFilter,
  onFreelancerChange,
  onClearFilters,
}: WorklogFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card px-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mr-1">
          Filter by:
        </span>

        <FilterTab
          label="Date Range"
          icon={<Calendar size={12} />}
          active={activeFilter === "date"}
          badge={dateFrom ? "active" : undefined}
          onClick={() => onFilterChange("date")}
        />
        <FilterTab
          label="Status"
          active={activeFilter === "status"}
          badge={statusFilter || undefined}
          onClick={() => onFilterChange("status")}
        />
        <FilterTab
          label="Freelancer"
          icon={<Users size={12} />}
          active={activeFilter === "freelancer"}
          badge={freelancerFilter ? "active" : undefined}
          onClick={() => onFilterChange("freelancer")}
        />

        {activeFilter && (
          <button
            aria-label="Clear all filters"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-1"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {activeFilter === "date" && (
        <div className="flex flex-wrap gap-3 pt-1 border-t">
          <div className="flex flex-col gap-1">
            <label htmlFor="date-from" className="text-xs text-muted-foreground">
              From
            </label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="h-8 text-xs w-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="date-to" className="text-xs text-muted-foreground">
              To
            </label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="h-8 text-xs w-40"
            />
          </div>
        </div>
      )}

      {activeFilter === "status" && (
        <div className="flex flex-wrap gap-2 pt-1 border-t">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              aria-pressed={statusFilter === s}
              onClick={() => onStatusChange(statusFilter === s ? "" : s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === s
                  ? STATUS_ACTIVE_CLASSES[s]
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}

      {activeFilter === "freelancer" && (
        <div className="flex flex-wrap gap-2 pt-1 border-t">
          {mockFreelancers.map((f) => (
            <button
              key={f.id}
              aria-pressed={freelancerFilter === f.id}
              onClick={() => onFreelancerChange(freelancerFilter === f.id ? "" : f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                freelancerFilter === f.id
                  ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
