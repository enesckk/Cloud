"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface WizardData {
  // Step 1: Infrastructure
  infrastructureSize: string
  numberOfServers: string
  dataVolume: string

  // Step 2: Applications
  applicationComplexity: string
  legacyDependencies: string
  databaseType: string

  // Step 3: Requirements
  complianceRequirements: string[]
  downTimeTolerrance: string
  budgetRange: string

  // Step 4: Team
  cloudExperience: string
  dedicatedTeam: string
  timelineExpectation: string
}

interface WizardContextType {
  data: WizardData
  updateData: (updates: Partial<WizardData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
}

const defaultData: WizardData = {
  infrastructureSize: "",
  numberOfServers: "",
  dataVolume: "",
  applicationComplexity: "",
  legacyDependencies: "",
  databaseType: "",
  complianceRequirements: [],
  downTimeTolerrance: "",
  budgetRange: "",
  cloudExperience: "",
  dedicatedTeam: "",
  timelineExpectation: "",
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WizardData>(defaultData)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <WizardContext.Provider value={{ data, updateData, currentStep, setCurrentStep, totalSteps }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}
