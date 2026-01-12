"use client"

import { useWizard } from "@/lib/wizard-context"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const stepLabels = ["Infrastructure", "Applications", "Requirements", "Team"]

export function ProgressIndicator() {
  const { currentStep, totalSteps } = useWizard()

  return (
    <div className="w-full">
      {/* Progress bar at top */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = currentStep > stepNumber
          const isCurrent = currentStep === stepNumber

          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground shadow-md",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs font-medium",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground",
                    "hidden sm:block",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "mx-3 h-1 flex-1 rounded-full transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
