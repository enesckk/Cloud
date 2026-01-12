"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  title?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: { name?: string; email?: string; title?: string }) => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "cloudguide_user"
const USERS_STORAGE_KEY = "cloudguide_users"

// Mock users storage - in real app this would be backend
function getStoredUsers(): Array<{ email: string; password: string; name: string; title?: string; id: string; createdAt: string }> {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  const users = stored ? JSON.parse(stored) : []
  
  // Initialize demo user if no users exist
  if (users.length === 0) {
    const demoUser = {
      id: "demo_user_001",
      email: "demo@cloudguide.com",
      password: "demo123",
      name: "Demo Kullanıcı",
      title: "IT Manager",
      createdAt: new Date().toISOString(),
    }
    users.push(demoUser)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }
  
  return users
}

function saveUser(user: { email: string; password: string; name: string; title?: string; id: string; createdAt: string }) {
  if (typeof window === "undefined") return
  const users = getStoredUsers()
  users.push(user)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function updateStoredUser(userId: string, updates: { email?: string; password?: string; name?: string; title?: string }) {
  if (typeof window === "undefined") return false
  const users = getStoredUsers()
  const userIndex = users.findIndex((u) => u.id === userId)
  
  if (userIndex === -1) return false
  
  if (updates.email) users[userIndex].email = updates.email
  if (updates.password) users[userIndex].password = updates.password
  if (updates.name) users[userIndex].name = updates.name
  if (updates.title !== undefined) users[userIndex].title = updates.title
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  return true
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getStoredUsers()
    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        title: foundUser.title,
        createdAt: foundUser.createdAt,
      }
      setUser(userData)
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      }
      return true
    }

    return false
  }

  const signup = async (name: string, email: string, password: string, title?: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getStoredUsers()

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return false
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password, // In real app, this would be hashed
      name,
      title,
      createdAt: new Date().toISOString(),
    }

    saveUser(newUser)

    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      title: newUser.title,
      createdAt: newUser.createdAt,
    }

    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    }

    return true
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const updateUser = async (updates: { name?: string; email?: string; title?: string }): Promise<boolean> => {
    if (!user) return false
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Check if email is being changed and if it already exists
    if (updates.email && updates.email !== user.email) {
      const users = getStoredUsers()
      if (users.some((u) => u.email === updates.email && u.id !== user.id)) {
        return false // Email already exists
      }
    }
    
    const success = updateStoredUser(user.id, updates)
    
    if (success) {
      const updatedUser: User = {
        ...user,
        ...updates,
      }
      setUser(updatedUser)
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      }
    }
    
    return success
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const users = getStoredUsers()
    const foundUser = users.find((u) => u.id === user.id)
    
    if (!foundUser || foundUser.password !== currentPassword) {
      return false // Current password is incorrect
    }
    
    const success = updateStoredUser(user.id, { password: newPassword })
    return success
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, updatePassword, isLoading }}>
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
