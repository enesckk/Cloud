"use client"

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
import { Menu, User, Home, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

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

export function PanelHeader({ onMenuClick, sidebarOpen }: PanelHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

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

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

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
