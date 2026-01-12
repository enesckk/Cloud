"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Cloud,
  TrendingUp,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { getAdminUsers, getAdminProviders, getEducation, getAdminAnalysesCount } from "@/lib/api-client"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEducation: 0,
    totalProviders: 0,
    totalAnalyses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const [usersResponse, providersResponse, educationResponse, analysesCountResponse] = await Promise.all([
          getAdminUsers(user.id).catch(() => ({ users: [] })),
          getAdminProviders(user.id).catch(() => ({ providers: [] })),
          getEducation().catch(() => ({ education: [] })),
          getAdminAnalysesCount(user.id).catch(() => ({ count: 0 })),
        ])

        // Count only non-admin users
        const regularUsers = usersResponse.users?.filter((u) => !u.is_admin) || []
        
        setStats({
          totalUsers: regularUsers.length,
          totalEducation: educationResponse.education?.length || 0,
          totalProviders: providersResponse.providers?.length || 0,
          totalAnalyses: analysesCountResponse.count || 0,
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  const quickActions = [
    {
      title: "User Management",
      description: "View, add, edit or delete users",
      href: "/dashboard/admin/users",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Education Modules",
      description: "Manage education content",
      href: "/dashboard/admin/education",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Provider Management",
      description: "Manage cloud providers and pricing",
      href: "/dashboard/admin/providers",
      icon: Cloud,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <Link href="/dashboard/admin/users" className="text-xs text-muted-foreground hover:text-primary mt-1 inline-block">
                  View details →
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Education Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalEducation}</div>
                <Link href="/dashboard/admin/education" className="text-xs text-muted-foreground hover:text-primary mt-1 inline-block">
                  View details →
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cloud Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalProviders}</div>
                <Link href="/dashboard/admin/providers" className="text-xs text-muted-foreground hover:text-primary mt-1 inline-block">
                  View details →
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
                <p className="text-xs text-muted-foreground mt-1">All users</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
