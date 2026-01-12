"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/panel/sidebar"
import { PanelHeader } from "@/components/panel/panel-header"
import { ProtectedRoute } from "@/components/protected-route"
import { cn } from "@/lib/utils"

const SIDEBAR_STORAGE_KEY = "cloudguide_sidebar_open"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Check if this is an admin route - check pathname directly
  const isAdminRoute = pathname?.startsWith("/dashboard/admin") ?? false

  useEffect(() => {
    // Don't load sidebar state for admin pages
    if (isAdminRoute) return
    
    // Load sidebar state from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        setSidebarOpen(JSON.parse(stored))
      }
    }
  }, [isAdminRoute, pathname])

  const handleToggle = () => {
    if (isAdminRoute) return
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState))
    }
  }

  const handleClose = () => {
    if (isAdminRoute) return
    setSidebarOpen(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(false))
    }
  }

  // Don't render user dashboard layout for admin pages - they have their own layout
  // This must be checked after hooks but before render
  if (isAdminRoute) {
    // Return children without any wrapper - admin layout will handle everything
    return <>{children}</>
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleClose}
          onToggle={handleToggle}
        />
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-300",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          )}
        >
          <PanelHeader
            onMenuClick={handleToggle}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 overflow-y-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
