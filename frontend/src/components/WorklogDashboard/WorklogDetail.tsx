import { Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/Common/PageHeader"
import type { Worklog } from "@/data/mockData"
import { StatusBadge, fmt } from "./utils"

interface WorklogDetailProps {
  worklog: Worklog
  onBack: () => void
  onAddToPayment: (id: string) => void
}

export function WorklogDetail({ worklog, onBack, onAddToPayment }: WorklogDetailProps) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        onBack={onBack}
        backLabel="Back to Worklogs"
        breadcrumb={worklog.taskName}
        rightContent={
          <Button
            onClick={() => onAddToPayment(worklog.id)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CreditCard size={16} />
            Add to Payment
          </Button>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{worklog.taskName}</h1>
            <StatusBadge status={worklog.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            {worklog.taskId} · {worklog.project}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoCard label="Freelancer">
            <p className="font-semibold text-sm">{worklog.freelancer.name}</p>
            <p className="text-xs text-muted-foreground">{worklog.freelancer.email}</p>
          </InfoCard>
          <InfoCard label="Hourly Rate">
            <p className="font-semibold text-lg">{fmt(worklog.freelancer.hourlyRate)}</p>
            <p className="text-xs text-muted-foreground">per hour</p>
          </InfoCard>
          <InfoCard label="Total Hours">
            <p className="font-semibold text-lg">{worklog.totalHours}h</p>
            <p className="text-xs text-muted-foreground">
              {worklog.timeEntries.length} entries
            </p>
          </InfoCard>
          <InfoCard label="Total Amount">
            <p className="font-semibold text-lg text-emerald-600">
              {fmt(worklog.totalAmount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {worklog.periodStart} – {worklog.periodEnd}
            </p>
          </InfoCard>
        </div>

        <Card className="py-0">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock size={16} />
              Time Entries
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {worklog.timeEntries.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className={`border-b last:border-0 ${idx % 2 === 1 ? "bg-muted/20" : ""}`}
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="px-6 py-3.5">{entry.description}</td>
                      <td className="px-6 py-3.5 text-right font-medium whitespace-nowrap">
                        {entry.hours}h
                      </td>
                      <td className="px-6 py-3.5 text-right font-medium text-emerald-600 whitespace-nowrap">
                        {fmt(entry.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/40">
                    <td className="px-6 py-3.5 font-semibold" colSpan={2}>
                      Total
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold">
                      {worklog.totalHours}h
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-emerald-600">
                      {fmt(worklog.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="py-4">
      <CardContent className="px-5">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {children}
      </CardContent>
    </Card>
  )
}
