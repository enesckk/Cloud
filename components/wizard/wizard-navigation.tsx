"use client"

import { useRouter } from "next/navigation"
import { useWizard } from "@/lib/wizard-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

export function WizardNavigation() {
  const router = useRouter()
  const { currentStep, setCurrentStep, totalSteps } = useWizard()

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/estimate/review")
    }
  }

  const isLastStep = currentStep === totalSteps

  return (
    <div className="mt-10 flex items-center justify-between border-t border-border pt-8">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 1}
        className="h-11 gap-2 rounded-xl bg-transparent px-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>

      <Button onClick={handleNext} className="h-11 gap-2 rounded-xl px-6">
        {isLastStep ? (
          <>
            Review Answers
            <CheckCircle className="h-4 w-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
