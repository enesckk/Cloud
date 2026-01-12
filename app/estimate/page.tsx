"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProgressIndicator } from "@/components/wizard/progress-indicator"
import { WizardNavigation } from "@/components/wizard/wizard-navigation"
import { StepInfrastructure } from "@/components/wizard/step-infrastructure"
import { StepApplications } from "@/components/wizard/step-applications"
import { StepRequirements } from "@/components/wizard/step-requirements"
import { StepTeam } from "@/components/wizard/step-team"
import { useWizard } from "@/lib/wizard-context"
import { Calculator, Clock, HelpCircle } from "lucide-react"

function WizardContent() {
  const { currentStep } = useWizard()

  return (
    <>
      {currentStep === 1 && <StepInfrastructure />}
      {currentStep === 2 && <StepApplications />}
      {currentStep === 3 && <StepRequirements />}
      {currentStep === 4 && <StepTeam />}
    </>
  )
}

export default function EstimatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Cloud Migration Cost Estimation</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Answer a few simple questions about your current setup to receive an estimated cost range.
            </p>
          </div>

          {/* Info Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Takes about 5 minutes</p>
                <p className="text-sm text-muted-foreground">4 simple steps to complete</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Not sure? That is okay</p>
                <p className="text-sm text-muted-foreground">Hover over labels for help</p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator />
          </div>

          {/* Wizard Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <WizardContent />
            <WizardNavigation />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
