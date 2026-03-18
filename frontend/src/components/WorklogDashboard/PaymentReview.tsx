import { useMemo } from "react"
import { CreditCard, X, CheckCircle2, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/Common/PageHeader"
import { EmptyState } from "@/components/Common/EmptyState"
import type { Worklog } from "@/data/mockData"
import { FreelancerAvatar, fmt } from "./utils"

interface PaymentReviewProps {
  selectedWorklogs: Worklog[]
  excludedIds: Set<string>
  onToggleExclude: (id: string) => void
  onExcludeFreelancer: (freelancerId: string) => void
  onResetExclusions: () => void
  onConfirm: () => void
  onCancel: () => void
}

export function PaymentReview({
  selectedWorklogs,
  excludedIds,
  onToggleExclude,
  onExcludeFreelancer,
  onResetExclusions,
  onConfirm,
  onCancel,
}: PaymentReviewProps) {
  const reviewWorklogs = selectedWorklogs.filter((w) => !excludedIds.has(w.id))
  const reviewTotal = reviewWorklogs.reduce((s, w) => s + w.totalAmount, 0)
  const reviewHours = reviewWorklogs.reduce((s, w) => s + w.totalHours, 0)

  const reviewByFreelancer = useMemo(() => {
    const map = new Map<string, Worklog[]>()
    for (const w of reviewWorklogs) {
      const key = w.freelancer.id
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(w)
    }
    return map
  }, [reviewWorklogs])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        onBack={onCancel}
        backLabel="Back to Worklogs"
        breadcrumb="Payment Review"
        rightContent={
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Batch Total</p>
              <p className="text-xl font-bold text-emerald-600">{fmt(reviewTotal)}</p>
            </div>
            <Button
              onClick={onConfirm}
              disabled={reviewWorklogs.length === 0}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              aria-label="Confirm and process payment batch"
            >
              <CreditCard size={16} />
              Confirm Payment
            </Button>
          </div>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Review</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Review and confirm the payment batch before processing
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SummaryCard label="Worklogs" value={reviewWorklogs.length}>
            {excludedIds.size > 0 && (
              <p className="text-xs text-amber-600">{excludedIds.size} excluded</p>
            )}
          </SummaryCard>
          <SummaryCard label="Total Hours" value={`${reviewHours.toFixed(1)}h`} />
          <SummaryCard label="Freelancers" value={reviewByFreelancer.size} />
        </div>

        {reviewWorklogs.length === 0 ? (
          <Card className="py-12">
            <CardContent>
              <EmptyState
                icon={<ClipboardList size={40} className="text-muted-foreground" />}
                message="All worklogs have been excluded."
                action={
                  <Button variant="outline" size="sm" onClick={onResetExclusions}>
                    Reset Exclusions
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Array.from(reviewByFreelancer.entries()).map(([freelancerId, worklogs]) => (
              <FreelancerGroup
                key={freelancerId}
                freelancerId={freelancerId}
                worklogs={worklogs}
                onExcludeFreelancer={onExcludeFreelancer}
                onToggleExclude={onToggleExclude}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {reviewWorklogs.length} worklog{reviewWorklogs.length !== 1 ? "s" : ""}{" "}
              across {reviewByFreelancer.size} freelancer
              {reviewByFreelancer.size !== 1 ? "s" : ""}
            </p>
            <p className="font-bold text-lg">{fmt(reviewTotal)}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={reviewWorklogs.length === 0}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              aria-label="Confirm and process payment batch"
            >
              <CreditCard size={16} />
              Confirm & Process Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}


interface FreelancerGroupProps {
  freelancerId: string
  worklogs: Worklog[]
  onExcludeFreelancer: (id: string) => void
  onToggleExclude: (id: string) => void
}

function FreelancerGroup({
  freelancerId,
  worklogs,
  onExcludeFreelancer,
  onToggleExclude,
}: FreelancerGroupProps) {
  const freelancer = worklogs[0].freelancer
  const subtotal = worklogs.reduce((s, w) => s + w.totalAmount, 0)
  const subtotalHours = worklogs.reduce((s, w) => s + w.totalHours, 0)

  return (
    <Card className="py-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <FreelancerAvatar name={freelancer.name} size="md" />
          <div>
            <p className="font-semibold text-sm">{freelancer.name}</p>
            <p className="text-xs text-muted-foreground">{freelancer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">
              {subtotalHours}h · {worklogs.length} worklog{worklogs.length !== 1 ? "s" : ""}
            </p>
            <p className="font-bold text-emerald-600">{fmt(subtotal)}</p>
          </div>
          <button
            aria-label={`Exclude all worklogs for ${freelancer.name}`}
            onClick={() => onExcludeFreelancer(freelancerId)}
            className="text-xs text-destructive hover:underline flex items-center gap-1"
          >
            <X size={13} />
            Exclude all
          </button>
        </div>
      </div>

      <div className="divide-y">
        {worklogs.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/20 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{w.taskName}</p>
              <p className="text-xs text-muted-foreground">
                {w.taskId} · {w.project} ·{" "}
                <span className="font-mono">{w.periodStart}</span> –{" "}
                <span className="font-mono">{w.periodEnd}</span>
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">{w.totalHours}h</p>
                <p className="font-semibold text-sm text-emerald-600">
                  {fmt(w.totalAmount)}
                </p>
              </div>
              <button
                aria-label={`Exclude worklog ${w.taskName} from payment`}
                onClick={() => onToggleExclude(w.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface SummaryCardProps {
  label: string
  value: string | number
  children?: React.ReactNode
}

function SummaryCard({ label, value, children }: SummaryCardProps) {
  return (
    <Card className="py-4">
      <CardContent className="px-5">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {children}
      </CardContent>
    </Card>
  )
}

interface PaymentSuccessProps {
  onBack: () => void
}

export function PaymentSuccess({ onBack }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          The payment batch has been submitted successfully. Freelancers will be notified
          shortly.
        </p>
        <Button onClick={onBack} className="gap-2">
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
