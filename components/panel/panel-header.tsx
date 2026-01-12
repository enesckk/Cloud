"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, User, Home, Bell, Search, CheckCircle2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "success" | "info" | "error" | "warning"
  title: string
  description?: string
  timestamp: number
  read: boolean
}

interface PanelHeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/cost-analysis": "Cost Analysis",
  "/dashboard/compare": "Compare",
  "/dashboard/reports": "Reports",
  "/dashboard/education": "Education",
  "/dashboard/settings": "Settings",
}

const getNotificationStorageKey = (userId: string | undefined, isAdmin: boolean) => {
  if (!userId) return "cloudguide_notifications_guest"
  return isAdmin ? `cloudguide_notifications_admin_${userId}` : `cloudguide_notifications_user_${userId}`
}

export function PanelHeader({ onMenuClick, sidebarOpen }: PanelHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationOpen, setNotificationOpen] = useState(false)

  const storageKey = getNotificationStorageKey(user?.id, false)

  // Load notifications from storage
  useEffect(() => {
    if (typeof window !== "undefined" && user?.id) {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          setNotifications(JSON.parse(stored))
        } catch {
          setNotifications([])
        }
      }
    }
  }, [user?.id, storageKey])

  // Listen for new notifications from toast
  useEffect(() => {
    if (typeof window === "undefined" || !user?.id) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue))
        } catch {
          setNotifications([])
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [user?.id, storageKey])

  // Listen for custom notification events (only for user panel)
  useEffect(() => {
    if (typeof window === "undefined" || !user?.id || user?.is_admin) return

    const handleNotification = (e: CustomEvent) => {
      // Only handle user panel notifications
      if (e.detail.target === "admin") return
      
      const notification: Notification = {
        id: `${Date.now()}_${Math.random()}`,
        type: e.detail.type || "info",
        title: e.detail.title || "Notification",
        description: e.detail.description,
        timestamp: Date.now(),
        read: false,
      }
      
      const updated = [notification, ...notifications].slice(0, 10) // Keep last 10
      setNotifications(updated)
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }

    window.addEventListener("cloudguide:notification" as any, handleNotification as EventListener)
    return () => window.removeEventListener("cloudguide:notification" as any, handleNotification as EventListener)
  }, [notifications, user?.id, user?.is_admin, storageKey])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    if (user?.id) {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    if (user?.id) {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    if (user?.id) {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-primary" />
      case "error":
        return <X className="h-4 w-4 text-destructive" />
      default:
        return <Bell className="h-4 w-4 text-primary" />
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const getPageTitle = () => {
    // Find exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname]
    }
    // Find partial match
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path + "/")) {
        return title
      }
    }
    return "Dashboard"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="h-9 w-9"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground hidden sm:block">
            {getPageTitle()}
          </h1>
          <div className="relative flex-1 hidden md:block max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="h-9 w-9"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Button>

          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 backdrop-blur-md bg-background/95 border border-border/50">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAllAsRead()
                    }}
                    className="h-6 text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors backdrop-blur-sm bg-background/80",
                        !notification.read && "bg-primary/10 border-l-2 border-l-primary"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn("text-sm font-medium text-foreground", !notification.read && "font-semibold text-primary")}>
                              {notification.title}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          {notification.description && (
                            <p className="text-xs text-foreground/70 mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground/70">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-5 text-xs"
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left lg:flex">
                  <span className="text-sm font-medium leading-none">{user?.name}</span>
                  {user?.title && (
                    <span className="text-xs text-muted-foreground leading-none mt-0.5">
                      {user.title}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  {user?.title && (
                    <p className="text-xs text-muted-foreground">{user.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
