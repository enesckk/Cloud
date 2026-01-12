import type React from "react"
import { WizardProvider } from "@/lib/wizard-context"

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WizardProvider>{children}</WizardProvider>
}
