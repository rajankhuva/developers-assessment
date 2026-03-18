import { useState, useMemo } from "react"
import { ClipboardList, Clock, DollarSign, Users, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/Common/PageHeader"
import { mockWorklogs } from "@/data/mockData"
import { StatCard } from "./StatCard"
import { WorklogFilters } from "./WorklogFilters"
import { WorklogTable } from "./WorklogTable"
import { WorklogDetail } from "./WorklogDetail"
import { PaymentReview, PaymentSuccess } from "./PaymentReview"
import { fmt } from "./utils"
import type { View } from "./types"

const PAGE_SIZE = 8

export function WorklogDashboard() {
  const [view, setView] = useState<View>("list")
  const [selectedWorklogId, setSelectedWorklogId] = useState<string | null>(null)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [excludedFromReview, setExcludedFromReview] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [freelancerFilter, setFreelancerFilter] = useState("")
  const [page, setPage] = useState(1)
  const [paymentSuccess, setPaymentSuccess] = useState(false)


  const filteredWorklogs = useMemo(() => {
    let result = [...mockWorklogs]
    if (activeFilter === "date" && (dateFrom || dateTo)) {
      result = result.filter((w) => {
        if (dateFrom && w.periodEnd < dateFrom) return false
        if (dateTo && w.periodStart > dateTo) return false
        return true
      })
    }
    if (activeFilter === "status" && statusFilter) {
      result = result.filter((w) => w.status === statusFilter)
    }
    if (activeFilter === "freelancer" && freelancerFilter) {
      result = result.filter((w) => w.freelancer.id === freelancerFilter)
    }
    return result
  }, [activeFilter, dateFrom, dateTo, statusFilter, freelancerFilter])

  const totalPages = Math.ceil(filteredWorklogs.length / PAGE_SIZE)
  const paginatedWorklogs = filteredWorklogs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  const pendingCount = mockWorklogs.filter((w) => w.status === "pending").length
  const totalAmountDue = mockWorklogs
    .filter((w) => w.status === "pending")
    .reduce((s, w) => s + w.totalAmount, 0)
  const uniqueFreelancersCount = new Set(mockWorklogs.map((w) => w.freelancer.id)).size

  const selectedWorklogs = mockWorklogs.filter((w) => checkedIds.has(w.id))
  const selectedWorklog = selectedWorklogId
    ? mockWorklogs.find((w) => w.id === selectedWorklogId)
    : null


  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setCheckedIds(
      checkedIds.size === filteredWorklogs.length
        ? new Set()
        : new Set(filteredWorklogs.map((w) => w.id)),
    )
  }

  function handleFilterChange(filterName: string) {
    setActiveFilter((prev) => (prev === filterName ? null : filterName))
    setPage(1)
  }

  function handleClearFilters() {
    setActiveFilter(null)
    setDateFrom("")
    setDateTo("")
    setStatusFilter("")
    setFreelancerFilter("")
    setPage(1)
  }

  function handleViewDetail(id: string) {
    setSelectedWorklogId(id)
    setView("detail")
  }

  function handleAddToPayment(id: string) {
    setCheckedIds((prev) => new Set([...prev, id]))
    setExcludedFromReview(new Set())
    setView("review")
  }

  function handleReviewPayment() {
    setExcludedFromReview(new Set())
    setView("review")
  }

  function handleToggleExclude(id: string) {
    setExcludedFromReview((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleExcludeFreelancer(freelancerId: string) {
    const ids = selectedWorklogs
      .filter((w) => !excludedFromReview.has(w.id) && w.freelancer.id === freelancerId)
      .map((w) => w.id)
    setExcludedFromReview((prev) => new Set([...prev, ...ids]))
  }

  function handleConfirmPayment() {
    setPaymentSuccess(true)
    setCheckedIds(new Set())
    setExcludedFromReview(new Set())
  }

  function handleBackToList() {
    setView("list")
    setSelectedWorklogId(null)
    setPaymentSuccess(false)
  }


  if (view === "detail" && selectedWorklog) {
    return (
      <WorklogDetail
        worklog={selectedWorklog}
        onBack={handleBackToList}
        onAddToPayment={handleAddToPayment}
      />
    )
  }

  if (view === "review") {
    if (paymentSuccess) {
      return <PaymentSuccess onBack={handleBackToList} />
    }
    return (
      <PaymentReview
        selectedWorklogs={selectedWorklogs}
        excludedIds={excludedFromReview}
        onToggleExclude={handleToggleExclude}
        onExcludeFreelancer={handleExcludeFreelancer}
        onResetExclusions={() => setExcludedFromReview(new Set())}
        onConfirm={handleConfirmPayment}
        onCancel={handleBackToList}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        leftContent={
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
              <ClipboardList size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">WorkLog Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Payment Administration</p>
            </div>
          </div>
        }
        rightContent={
          checkedIds.size > 0 ? (
            <Button
              onClick={handleReviewPayment}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              aria-label={`Review ${checkedIds.size} selected worklogs for payment`}
            >
              <CreditCard size={15} />
              Review Payment ({checkedIds.size})
            </Button>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Total Worklogs"
            value={mockWorklogs.length}
            subtitle={`across ${uniqueFreelancersCount} freelancers`}
            icon={<ClipboardList size={16} className="text-violet-500" />}
            accentClass="border-l-violet-500"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            subtitle="awaiting payment"
            icon={<Clock size={16} className="text-amber-500" />}
            accentClass="border-l-amber-500"
          />
          <StatCard
            title="Amount Due"
            value={fmt(totalAmountDue)}
            subtitle="pending worklogs"
            icon={<DollarSign size={16} className="text-emerald-500" />}
            accentClass="border-l-emerald-500"
          />
          <StatCard
            title="Freelancers"
            value={uniqueFreelancersCount}
            subtitle="active contractors"
            icon={<Users size={16} className="text-blue-500" />}
            accentClass="border-l-blue-500"
          />
        </div>

        <WorklogFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={(v) => { setDateFrom(v); setPage(1) }}
          onDateToChange={(v) => { setDateTo(v); setPage(1) }}
          statusFilter={statusFilter}
          onStatusChange={(v) => { setStatusFilter(v); setPage(1) }}
          freelancerFilter={freelancerFilter}
          onFreelancerChange={(v) => { setFreelancerFilter(v); setPage(1) }}
          onClearFilters={handleClearFilters}
        />

        <WorklogTable
          worklogs={paginatedWorklogs}
          allFilteredCount={filteredWorklogs.length}
          checkedIds={checkedIds}
          onCheck={toggleCheck}
          onSelectAll={toggleSelectAll}
          onViewDetail={handleViewDetail}
          onReviewPayment={handleReviewPayment}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  )
}
