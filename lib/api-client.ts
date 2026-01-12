/**
 * API Client for Backend Integration
 * 
 * Handles all communication with the Flask backend API.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface EstimateRequest {
  company_size: string
  current_infrastructure_type: string
  data_size: string
  database_complexity: string
  monthly_traffic: string
  application_architecture: string
  number_of_applications: string
  operating_system_diversity: string
  security_requirements: string[] | string
  compliance_requirements: string[] | string
  backup_disaster_recovery: string
  availability_requirement: string
  peak_load_variability: string
  cicd_automation_level: string
  monitoring_logging_needs: string
  team_cloud_experience: string
  migration_timeline: string
  migration_strategy: string
}

export interface CostEstimate {
  base_cost: number
  final_cost: number
  min_cost: number
  max_cost: number
  currency: string
}

export interface BreakdownItem {
  question_id: string
  question_title: string
  user_answer: string
  multiplier: number
  cost_impact: number
  impact_direction: "increase" | "decrease" | "neutral"
  explanation: string
}

export interface EstimateResponse {
  cost_estimate: CostEstimate
  breakdown: BreakdownItem[]
  metadata: {
    total_questions: number
    questions_answered: number
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public error: string,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Submit estimation request to backend
 */
export async function submitEstimate(
  data: EstimateRequest
): Promise<EstimateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "unknown_error",
        errorData.message || "Failed to get estimate"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error("Health check failed")
    }

    return await response.json()
  } catch (error) {
    throw new ApiError(500, "health_check_failed", "Backend is not available")
  }
}

// ==================== Authentication API ====================

export interface RegisterRequest {
  email: string
  password: string
  name: string
  title?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  title?: string
  created_at?: string
}

export interface AuthResponse {
  message: string
  user: User
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "registration_failed",
        errorData.message || "Registration failed"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Login user
 */
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "login_failed",
        errorData.message || "Login failed"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "fetch_failed",
        errorData.message || "Failed to fetch profile"
      )
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: { name?: string; email?: string; title?: string }
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "update_failed",
        errorData.message || "Failed to update profile"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "password_update_failed",
        errorData.message || "Failed to update password"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// ==================== Analyses API ====================

export interface CreateAnalysisRequest {
  user_id: string
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
  trends?: Array<{
    month: string
    cost: number
    provider?: string
  }>
}

export interface Analysis {
  id: string
  user_id: string
  title: string
  config: any
  estimates: any[]
  trends?: any[]
  created_at: string
  updated_at?: string
}

/**
 * Get all analyses for a user
 */
export async function getUserAnalyses(userId: string): Promise<Analysis[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses?user_id=${userId}`, {
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "fetch_failed",
        errorData.message || "Failed to fetch analyses"
      )
    }

    const data = await response.json()
    return data.analyses
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Get analysis by ID
 */
export async function getAnalysisById(analysisId: string): Promise<Analysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}`, {
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "fetch_failed",
        errorData.message || "Failed to fetch analysis"
      )
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Create a new analysis
 */
export async function createAnalysis(data: CreateAnalysisRequest): Promise<{ message: string; analysis: Analysis }> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "create_failed",
        errorData.message || "Failed to create analysis"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Update an analysis
 */
export async function updateAnalysis(
  analysisId: string,
  updates: Partial<CreateAnalysisRequest>
): Promise<{ message: string; analysis: Analysis }> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "update_failed",
        errorData.message || "Failed to update analysis"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

/**
 * Delete an analysis
 */
export async function deleteAnalysis(analysisId: string, userId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}?user_id=${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.error || "delete_failed",
        errorData.message || "Failed to delete analysis"
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// ==================== ADMIN API ====================

export interface AdminUser extends User {
  is_admin: boolean
}

export interface Education {
  id: string
  title: string
  description: string
  full_content?: string
  type: "article" | "video" | "guide" | "case-study"
  category: "basics" | "migration" | "providers" | "security" | "cost-optimization" | "best-practices"
  duration?: string
  level: "beginner" | "intermediate" | "advanced"
  provider?: "aws" | "azure" | "gcp" | "huawei" | "general"
  tags?: string[]
  url?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Provider {
  id: string
  name: string
  display_name: string
  short_name: string
  is_active: boolean
  compute_rates?: { linux: number; windows: number }
  storage_rates?: Record<string, number>
  region_multipliers?: Record<string, number>
  available_regions?: string[]
  color?: string
  logo?: string
  description?: string
  features?: Record<string, "yes" | "no" | "partial">
  created_at?: string
  updated_at?: string
}

// Admin Users
export async function getAdminUsers(userId: string): Promise<{ users: AdminUser[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users?user_id=${userId}`)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch users")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function createAdminUser(userId: string, data: { email: string; password: string; name: string; title?: string; is_admin?: boolean }): Promise<{ message: string; user: AdminUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "create_failed", errorData.message || "Failed to create user")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function updateAdminUser(userId: string, targetUserId: string, updates: Partial<AdminUser>): Promise<{ message: string; user: AdminUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${targetUserId}?user_id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "update_failed", errorData.message || "Failed to update user")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function deleteAdminUser(userId: string, targetUserId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${targetUserId}?user_id=${userId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "delete_failed", errorData.message || "Failed to delete user")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// Admin Education
export async function getAdminEducation(userId: string, activeOnly?: boolean): Promise<{ education: Education[] }> {
  try {
    const url = `${API_BASE_URL}/admin/education?user_id=${userId}${activeOnly ? "&active_only=true" : ""}`
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch education")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function createAdminEducation(userId: string, data: Partial<Education>): Promise<{ message: string; education: Education }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/education?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "create_failed", errorData.message || "Failed to create education")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function updateAdminEducation(userId: string, educationId: string, updates: Partial<Education>): Promise<{ message: string; education: Education }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/education/${educationId}?user_id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "update_failed", errorData.message || "Failed to update education")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function deleteAdminEducation(userId: string, educationId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/education/${educationId}?user_id=${userId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "delete_failed", errorData.message || "Failed to delete education")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// Public Providers (for all users)
export async function getProviders(activeOnly: boolean = true): Promise<{ providers: Provider[] }> {
  try {
    const url = `${API_BASE_URL}/providers${activeOnly ? "?active_only=true" : ""}`
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch providers")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// Admin Providers
export async function getAdminProviders(userId: string, activeOnly?: boolean): Promise<{ providers: Provider[] }> {
  try {
    const url = `${API_BASE_URL}/admin/providers?user_id=${userId}${activeOnly ? "&active_only=true" : ""}`
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch providers")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function createAdminProvider(userId: string, data: Partial<Provider>): Promise<{ message: string; provider: Provider }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/providers?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "create_failed", errorData.message || "Failed to create provider")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function updateAdminProvider(userId: string, providerId: string, updates: Partial<Provider>): Promise<{ message: string; provider: Provider }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}?user_id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "update_failed", errorData.message || "Failed to update provider")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// Admin Analyses Statistics
export async function getAdminAnalysesCount(userId: string): Promise<{ count: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analyses/count?user_id=${userId}`)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch analyses count")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

// ==================== PUBLIC EDUCATION API ====================

export async function getEducation(params?: {
  category?: string
  provider?: string
  level?: string
  type?: string
}): Promise<{ education: Education[] }> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append("category", params.category)
    if (params?.provider) queryParams.append("provider", params.provider)
    if (params?.level) queryParams.append("level", params.level)
    if (params?.type) queryParams.append("type", params.type)
    
    const url = `${API_BASE_URL}/education${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch education")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function getEducationById(educationId: string): Promise<{ education: Education }> {
  try {
    const response = await fetch(`${API_BASE_URL}/education/${educationId}`)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "fetch_failed", errorData.message || "Failed to fetch education")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}

export async function deleteAdminProvider(userId: string, providerId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}?user_id=${userId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || "delete_failed", errorData.message || "Failed to delete provider")
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, "network_error", "Network error occurred")
  }
}
