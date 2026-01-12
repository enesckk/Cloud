"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  type User as ApiUser,
  ApiError,
} from "./api-client"

export interface User {
  id: string
  email: string
  name: string
  title?: string
  is_admin?: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  signup: (name: string, email: string, password: string, title?: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: { name?: string; email?: string; title?: string }) => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "cloudguide_user"

// Helper to convert API user to local User format
function apiUserToLocal(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    title: apiUser.title,
    is_admin: (apiUser as any).is_admin || false,
    createdAt: apiUser.created_at || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const userData = JSON.parse(stored)
            // Try to refresh user data from backend
            try {
              const freshUser = await getUserProfile(userData.id)
              const localUser = apiUserToLocal(freshUser)
              setUser(localUser)
              localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser))
            } catch {
              // If backend fails, use stored data
              setUser(userData)
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY)
          }
        }
      }
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setError(null)
      const response = await loginUser({ email, password })
      const localUser = apiUserToLocal(response.user)
      
      setUser(localUser)
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser))
      }
      return localUser
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Login failed. Please try again.")
      }
      return null
    }
  }

  const signup = async (name: string, email: string, password: string, title?: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await registerUser({ name, email, password, title })
      const localUser = apiUserToLocal(response.user)
      
      setUser(localUser)
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser))
      }
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Registration failed. Please try again.")
      }
      return false
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const updateUser = async (updates: { name?: string; email?: string; title?: string }): Promise<boolean> => {
    if (!user) return false
    
    try {
      setError(null)
      const response = await updateUserProfile(user.id, updates)
      const localUser = apiUserToLocal(response.user)
      
      setUser(localUser)
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser))
      }
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to update profile. Please try again.")
      }
      return false
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false
    
    try {
      setError(null)
      await updateUserPassword(user.id, currentPassword, newPassword)
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to update password. Please try again.")
      }
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, updatePassword, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
