import { ChevronLeft } from "lucide-react"

interface PageHeaderProps {
  onBack?: () => void
  backLabel?: string
  breadcrumb?: string
  rightContent?: React.ReactNode
  leftContent?: React.ReactNode
}

export function PageHeader({
  onBack,
  backLabel = "Back",
  breadcrumb,
  rightContent,
  leftContent,
}: PageHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <>
              <button
                aria-label={backLabel}
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ChevronLeft size={16} />
                {backLabel}
              </button>
              {breadcrumb && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-sm font-medium truncate">{breadcrumb}</span>
                </>
              )}
            </>
          )}
          {leftContent}
        </div>
        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>
    </header>
  )
}
