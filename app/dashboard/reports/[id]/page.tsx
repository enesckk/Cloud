"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileSpreadsheet, FileDown, Lightbulb, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react"
import { getAnalysisById, type SavedAnalysis } from "@/lib/reports-storage"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"

const providerInfo = {
  aws: {
    name: "Amazon Web Services",
    shortName: "AWS",
    logo: "AWS",
    color: "text-orange-600",
  },
  azure: {
    name: "Microsoft Azure",
    shortName: "Azure",
    logo: "Azure",
    color: "text-blue-600",
  },
  gcp: {
    name: "Google Cloud Platform",
    shortName: "GCP",
    logo: "GCP",
    color: "text-blue-500",
  },
  huawei: {
    name: "Huawei Cloud",
    shortName: "Huawei",
    logo: "Huawei",
    color: "text-red-600",
  },
}

export default function ReportDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [report, setReport] = useState<SavedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const foundReport = getAnalysisById(id)
    if (foundReport) {
      setReport(foundReport)
    }
    setLoading(false)
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const calculateSavings = (report: SavedAnalysis) => {
    if (!report.estimates || report.estimates.length === 0) return null

    const costs = report.estimates.map((e) => e.yearlyCost)
    const minCost = Math.min(...costs)
    const maxCost = Math.max(...costs)
    const savings = maxCost - minCost
    const savingsPercent = ((savings / maxCost) * 100).toFixed(1)

    return {
      amount: savings,
      percent: savingsPercent,
      bestProvider: report.estimates.find((e) => e.yearlyCost === minCost)?.provider,
    }
  }

  const handleExportPDF = () => {
    if (!report) return
    console.log("Exporting PDF for report:", report.id)
    alert(`PDF export for "${report.title}" would be generated here.`)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Report not found</p>
          <Button onClick={() => router.push("/dashboard/reports")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
      </div>
    )
  }

  const savings = calculateSavings(report)

  // Generate trend data if not exists (simulated monthly trends)
  const generateTrendData = () => {
    if (report.trends && report.trends.length > 0) {
      return report.trends
    }
    
    // Generate mock trend data based on current estimates
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const baseCost = report.estimates.reduce((sum, e) => sum + e.monthlyCost, 0) / report.estimates.length
    const variation = baseCost * 0.1 // 10% variation
    
    return months.map((month, idx) => ({
      month,
      cost: Math.round(baseCost + (Math.random() - 0.5) * variation * 2),
    }))
  }

  const trendData = generateTrendData()

  // Prepare chart data for provider comparison
  const chartData = report.estimates.map((est) => ({
    provider: est.provider.toUpperCase(),
    monthly: est.monthlyCost,
    yearly: est.yearlyCost,
  }))

  const chartConfig: ChartConfig = {
    monthly: {
      label: "Monthly Cost",
      theme: {
        light: "oklch(0.55 0.15 250)", // Primary blue (light mode)
        dark: "oklch(0.65 0.15 250)", // Primary blue (dark mode)
      },
    },
    yearly: {
      label: "Yearly Cost",
      theme: {
        light: "oklch(0.6 0.15 180)", // Chart-2 (light mode)
        dark: "oklch(0.65 0.15 180)", // Chart-2 (dark mode)
      },
    },
  }

  const trendChartConfig: ChartConfig = {
    cost: {
      label: "Monthly Cost",
      theme: {
        light: "oklch(0.55 0.15 250)", // Primary blue (light mode)
        dark: "oklch(0.65 0.15 250)", // Primary blue (dark mode)
      },
    },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/reports")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{report.title}</h1>
            <p className="text-muted-foreground">
              Created on {formatDate(report.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Infrastructure configuration details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Virtual CPU</div>
                <div className="text-2xl font-bold">{report.config.vcpu}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Memory (RAM)</div>
                <div className="text-2xl font-bold">{report.config.ram} GB</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Storage</div>
                <div className="text-2xl font-bold">{report.config.storage} GB</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Region</div>
                <div className="text-2xl font-bold">{report.config.region}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Operating System</div>
                <div className="text-lg font-semibold">{report.config.os}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Disk Type</div>
                <div className="text-lg font-semibold">{report.config.diskType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Use Case</div>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {report.config.useCase}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Providers</div>
                <div className="flex flex-wrap gap-1">
                  {report.config.providers.map((provider) => (
                    <Badge key={provider} variant="secondary">
                      {provider.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Cost Breakdown</CardTitle>
            <CardDescription>Detailed cost comparison across selected providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.estimates
                .sort((a, b) => a.yearlyCost - b.yearlyCost)
                .map((estimate) => {
                  const info = providerInfo[estimate.provider as keyof typeof providerInfo]
                  return (
                    <div
                      key={estimate.provider}
                      className={`relative rounded-xl border-2 p-6 transition-all ${
                        estimate.isMostEconomical
                          ? "border-green-500 bg-green-50/50 dark:bg-green-950/30 shadow-green-500/10"
                          : "border-border bg-card hover:shadow-md"
                      }`}
                    >
                      {estimate.isMostEconomical && (
                        <Badge
                          className="absolute right-6 top-6 bg-green-600 hover:bg-green-700 text-white border-0"
                          variant="default"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Most Economical
                        </Badge>
                      )}

                      <div className="flex items-start gap-6 pr-24">
                        <div
                          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-background border-2 ${
                            estimate.isMostEconomical ? "border-green-500" : "border-border"
                          } text-2xl font-bold ${info.color}`}
                        >
                          {info.logo}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-xl mb-2">{info.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Recommended Instance:{" "}
                            <span className="font-medium text-foreground">
                              {estimate.instanceType}
                            </span>
                          </p>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
                                Monthly Estimate
                              </p>
                              <p
                                className={`text-3xl font-bold ${
                                  estimate.isMostEconomical
                                    ? "text-green-600 dark:text-green-500"
                                    : "text-foreground"
                                }`}
                              >
                                {formatCurrency(estimate.monthlyCost)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
                                Yearly Estimate
                              </p>
                              <p className="text-3xl font-bold text-foreground">
                                {formatCurrency(estimate.yearlyCost)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Savings Opportunities */}
        {savings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Savings Opportunities
              </CardTitle>
              <CardDescription>Potential cost savings by choosing the optimal provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Potential Annual Savings</span>
                  <Badge className="bg-blue-600 text-lg px-3 py-1">
                    {savings.percent}%
                  </Badge>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatCurrency(savings.amount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  By choosing <strong>{savings.bestProvider?.toUpperCase()}</strong> instead of the most
                  expensive option, you could save {savings.percent}% annually on your cloud infrastructure
                  costs.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cost Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Cost Trends
            </CardTitle>
            <CardDescription>Monthly cost trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[300px]">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  className="text-xs"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="var(--color-cost)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-cost)", r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  activeDot={{ r: 6, fill: "var(--color-cost)", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Provider Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Provider Comparison
            </CardTitle>
            <CardDescription>Visual comparison of provider costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="provider"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  className="text-xs"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="monthly"
                  fill="var(--color-monthly)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
            <CardDescription>Overview of estimated costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Average Annual Cost</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    report.estimates.reduce((sum, e) => sum + e.yearlyCost, 0) /
                      report.estimates.length,
                  )}
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Lowest Annual Cost</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.min(...report.estimates.map((e) => e.yearlyCost)))}
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Highest Annual Cost</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(Math.max(...report.estimates.map((e) => e.yearlyCost)))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
