"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, DollarSign, ArrowRight, BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your cloud migration journey from here.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/cost-analysis">
          <Card className="transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer group h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Cost Analysis</CardTitle>
                    <CardDescription>Analyze your cloud migration costs</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/compare">
          <Card className="transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer group h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Compare</CardTitle>
                    <CardDescription>Compare cloud providers</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/education">
          <Card className="transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer group h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Education</CardTitle>
                    <CardDescription>Learn about cloud migration</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Migration Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No projects yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Complete an analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Complete an analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent cloud migration activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
            <p className="text-sm mt-2">
              Start by creating a cost analysis or exploring our learning resources.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
