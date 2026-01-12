"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Cloud, Menu, X, LogIn, User, LogOut } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
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

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/learn", label: "Learn" },
    { href: "/estimate", label: "Estimate Cost" },
    { href: "/about", label: "About" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
    router.refresh()
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Cloud className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">CloudGuide</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline-block">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="rounded-lg px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-muted"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-primary hover:bg-muted"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
