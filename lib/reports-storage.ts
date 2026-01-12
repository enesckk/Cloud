// Storage utility for saving and retrieving cost analysis reports
// Now uses backend API with localStorage fallback

import {
  getUserAnalyses,
  getAnalysisById as getAnalysisByIdApi,
  createAnalysis,
  updateAnalysis as updateAnalysisApi,
  deleteAnalysis as deleteAnalysisApi,
  type Analysis as ApiAnalysis,
  ApiError,
} from "./api-client"
import { useAuth } from "./auth-context"

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

// Helper to convert API analysis to SavedAnalysis format
function apiAnalysisToSaved(apiAnalysis: ApiAnalysis): SavedAnalysis {
  return {
    id: apiAnalysis.id,
    title: apiAnalysis.title,
    config: apiAnalysis.config,
    estimates: apiAnalysis.estimates,
    trends: apiAnalysis.trends,
    createdAt: apiAnalysis.created_at,
  }
}

// Fallback to localStorage if backend unavailable
function getStoredAnalyses(): SavedAnalysis[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveToLocalStorage(analysis: SavedAnalysis): void {
  if (typeof window === "undefined") return
  const analyses = getStoredAnalyses()
  const existingIndex = analyses.findIndex((a) => a.id === analysis.id)
  if (existingIndex > -1) {
    analyses[existingIndex] = analysis
  } else {
    analyses.unshift(analysis)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
}

function deleteFromLocalStorage(id: string): void {
  if (typeof window === "undefined") return
  const analyses = getStoredAnalyses()
  const filtered = analyses.filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * Get all saved analyses for current user
 * Tries backend first, falls back to localStorage
 */
export async function getSavedAnalyses(userId?: string): Promise<SavedAnalysis[]> {
  // If no userId provided, try localStorage fallback
  if (!userId) {
    return getStoredAnalyses()
  }

  try {
    const apiAnalyses = await getUserAnalyses(userId)
    return apiAnalyses.map(apiAnalysisToSaved)
  } catch (error) {
    console.warn("Backend unavailable, using localStorage:", error)
    return getStoredAnalyses()
  }
}

/**
 * Save analysis
 * Tries backend first, falls back to localStorage
 */
export async function saveAnalysis(analysis: SavedAnalysis, userId?: string): Promise<void> {
  // Always save to localStorage as backup
  saveToLocalStorage(analysis)

  // Try backend if userId provided
  if (userId) {
    try {
      await createAnalysis({
        user_id: userId,
        title: analysis.title,
        config: analysis.config,
        estimates: analysis.estimates,
        trends: analysis.trends,
      })
    } catch (error) {
      console.warn("Backend save failed, using localStorage:", error)
    }
  }
}

/**
 * Delete analysis
 * Tries backend first, falls back to localStorage
 */
export async function deleteAnalysis(id: string, userId?: string): Promise<void> {
  // Always delete from localStorage
  deleteFromLocalStorage(id)

  // Try backend if userId provided
  if (userId) {
    try {
      await deleteAnalysisApi(id, userId)
    } catch (error) {
      console.warn("Backend delete failed, using localStorage:", error)
    }
  }
}

/**
 * Get analysis by ID
 * Tries backend first, falls back to localStorage
 */
export async function getAnalysisById(id: string): Promise<SavedAnalysis | undefined> {
  try {
    const apiAnalysis = await getAnalysisByIdApi(id)
    return apiAnalysisToSaved(apiAnalysis)
  } catch (error) {
    // Fallback to localStorage
    const analyses = getStoredAnalyses()
    return analyses.find((a) => a.id === id)
  }
}
