export type View = "list" | "detail" | "review"

export interface DashboardState {
  view: View
  selectedWorklogId: string | null
  checkedIds: Set<string>
  excludedFromReview: Set<string>
  activeFilter: string | null
  dateFrom: string
  dateTo: string
  statusFilter: string
  freelancerFilter: string
  page: number
  paymentSuccess: boolean
}
