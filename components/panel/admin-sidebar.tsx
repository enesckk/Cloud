"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Cloud,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Education Modules",
    href: "/dashboard/admin/education",
    icon: BookOpen,
  },
  {
    title: "Providers",
    href: "/dashboard/admin/providers",
    icon: Cloud,
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onToggle, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose || onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full border-r border-border bg-card transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            {isOpen ? (
              <Link href="/dashboard/admin" className="flex items-center gap-2.5 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold whitespace-nowrap">Admin Panel</span>
              </Link>
            ) : (
              <Link href="/dashboard/admin" className="flex items-center justify-center w-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
              </Link>
            )}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden lg:flex"
                onClick={onToggle}
              >
                {isOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 lg:hidden"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {adminMenuItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/dashboard/admin"
                  ? pathname === "/dashboard/admin"
                  : pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close mobile menu on navigation
                    if (window.innerWidth < 1024) {
                      onToggle()
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !isOpen && "justify-center px-2",
                  )}
                  title={!isOpen ? item.title : undefined}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", !isOpen && "mx-auto")} />
                  {isOpen && <span className="whitespace-nowrap">{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Section & Logout */}
          <div className="border-t border-border p-3 space-y-2">
            {isOpen && user && (
              <div className="px-3 py-2 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                {user.title && (
                  <p className="text-xs text-muted-foreground truncate">{user.title}</p>
                )}
                <p className="text-xs text-primary font-semibold mt-1">Admin</p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                !isOpen && "justify-center px-2",
              )}
              title={!isOpen ? "Logout" : undefined}
            >
              <LogOut className={cn("h-5 w-5 shrink-0", !isOpen && "mx-auto")} />
              {isOpen && <span className="whitespace-nowrap">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
