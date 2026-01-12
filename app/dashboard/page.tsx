"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, DollarSign, ArrowRight, BookOpen, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"
import { getSavedAnalyses, type SavedAnalysis } from "@/lib/reports-storage"

function DashboardPage() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalyses = async () => {
      if (user?.id) {
        setLoading(true)
        try {
          const data = await getSavedAnalyses(user.id)
          setAnalyses(data || [])
        } catch (error) {
          console.error("Failed to load analyses:", error)
          setAnalyses([])
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setAnalyses([])
      }
    }
    loadAnalyses()
  }, [user])

  const stats = useMemo(() => {
    const projectCount = analyses.length
    
    // Calculate total savings (difference between highest and lowest cost across all analyses)
    let totalSavings = 0
    if (analyses.length > 0) {
      analyses.forEach((analysis) => {
        if (analysis.estimates && analysis.estimates.length > 0) {
          const costs = analysis.estimates.map((e) => e.yearlyCost).filter((cost) => cost > 0)
          if (costs.length > 0) {
            const maxCost = Math.max(...costs)
            const minCost = Math.min(...costs)
            if (maxCost > minCost) {
              totalSavings += maxCost - minCost
            }
          }
        }
      })
    }

    // Estimate time saved (rough calculation: 2 hours per analysis)
    const estimatedHoursSaved = projectCount * 2

    return {
      projectCount,
      totalSavings,
      estimatedHoursSaved,
    }
  }, [analyses])

  const recentAnalyses = useMemo(() => {
    return analyses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [analyses])

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
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.projectCount}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.projectCount === 0 ? "No projects yet" : `${stats.projectCount} ${stats.projectCount === 1 ? "project" : "projects"}`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.totalSavings > 0
                    ? `$${stats.totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalSavings > 0 ? "Potential annual savings" : "Complete an analysis"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.estimatedHoursSaved > 0 ? `${stats.estimatedHoursSaved}h` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.estimatedHoursSaved > 0 ? "Estimated time saved" : "Complete an analysis"}
                </p>
              </>
            )}
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
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
            </div>
          ) : recentAnalyses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm mt-2">
                Start by creating a cost analysis or exploring our learning resources.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => {
                const bestProvider = analysis.estimates?.find((e) => e.isMostEconomical)
                const date = new Date(analysis.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                return (
                  <Link
                    key={analysis.id}
                    href={`/dashboard/reports/${analysis.id}`}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{analysis.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {analysis.config.vcpu} vCPU, {analysis.config.ram}GB RAM, {analysis.config.storage}GB Storage
                        </p>
                        {bestProvider && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Best: {bestProvider.provider.toUpperCase()} - ${bestProvider.yearlyCost.toLocaleString()}/year
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{date}</p>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
