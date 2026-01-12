"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminSidebar } from "@/components/panel/admin-sidebar"
import { AdminHeader } from "@/components/panel/admin-header"
import { ProtectedRoute } from "@/components/protected-route"
import { cn } from "@/lib/utils"

const ADMIN_SIDEBAR_STORAGE_KEY = "cloudguide_admin_sidebar_open"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Load sidebar state from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        setSidebarOpen(JSON.parse(stored))
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      if (!user.is_admin) {
        router.push("/dashboard")
        return
      }
    }
  }, [user, isLoading, router])

  const handleToggle = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SIDEBAR_STORAGE_KEY, JSON.stringify(newState))
    }
  }

  const handleClose = () => {
    setSidebarOpen(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SIDEBAR_STORAGE_KEY, JSON.stringify(false))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.is_admin) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar isOpen={sidebarOpen} onToggle={handleToggle} onClose={handleClose} />
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-300",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          )}
        >
          <AdminHeader onToggleSidebar={handleToggle} />
          <main className="flex-1 overflow-y-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
