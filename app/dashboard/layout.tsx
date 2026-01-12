"use client"

import { useState, useEffect } from "react"
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
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Load sidebar state from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        setSidebarOpen(JSON.parse(stored))
      }
    }
  }, [])

  const handleToggle = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState))
    }
  }

  const handleClose = () => {
    setSidebarOpen(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(false))
    }
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
