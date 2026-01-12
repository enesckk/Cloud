import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipLabelProps {
  label: string
  tooltip: string
}

export function TooltipLabel({ label, tooltip }: TooltipLabelProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs rounded-lg bg-foreground px-4 py-3 text-background shadow-lg">
            <p className="text-sm leading-relaxed">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
