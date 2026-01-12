// Storage utility for saving and retrieving cost analysis reports

export interface SavedAnalysis {
  id: string
  title: string
  config: {
    vcpu: number
    ram: number
    storage: number
    os: string
    diskType: string
    useCase: string
    region: string
    providers: string[]
  }
  estimates: Array<{
    provider: string
    instanceType: string
    monthlyCost: number
    yearlyCost: number
    isMostEconomical?: boolean
  }>
  createdAt: string
  trends?: Array<{
    month: string
    cost: number
    provider?: string
  }>
}

const STORAGE_KEY = "cloudguide_saved_analyses"

export function getSavedAnalyses(): SavedAnalysis[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveAnalysis(analysis: SavedAnalysis): void {
  if (typeof window === "undefined") return
  const analyses = getSavedAnalyses()
  analyses.unshift(analysis) // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
}

export function deleteAnalysis(id: string): void {
  if (typeof window === "undefined") return
  const analyses = getSavedAnalyses()
  const filtered = analyses.filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getAnalysisById(id: string): SavedAnalysis | undefined {
  const analyses = getSavedAnalyses()
  return analyses.find((a) => a.id === id)
}
