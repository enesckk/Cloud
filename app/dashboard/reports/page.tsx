"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Download,
  FileText,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Trash2,
  MoreVertical,
  FileSpreadsheet,
  FileDown,
  RefreshCw,
  Plus,
  PieChart,
  CheckCircle2,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSavedAnalyses, deleteAnalysis, type SavedAnalysis } from "@/lib/reports-storage"
import { useAuth } from "@/lib/auth-context"

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

export default function ReportsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [reports, setReports] = useState<SavedAnalysis[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRegion, setFilterRegion] = useState<string>("all")

  // Load reports on mount
  useEffect(() => {
    const loadReports = async () => {
      if (user?.id) {
        const analyses = await getSavedAnalyses(user.id)
        setReports(analyses)
      } else {
        // Fallback to localStorage if not logged in
        setReports(getSavedAnalyses())
      }
    }
    loadReports()
  }, [user])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        searchQuery === "" ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.config.providers.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRegion = filterRegion === "all" || report.config.region === filterRegion

      return matchesSearch && matchesRegion
    })
  }, [reports, searchQuery, filterRegion])

  // Calculate total cost summary by provider
  const totalCostByProvider = useMemo(() => {
    const totals: Record<string, { monthly: number; yearly: number; count: number }> = {}

    reports.forEach((report) => {
      report.estimates.forEach((est) => {
        const provider = est.provider.toUpperCase()
        if (!totals[provider]) {
          totals[provider] = { monthly: 0, yearly: 0, count: 0 }
        }
        totals[provider].monthly += est.monthlyCost
        totals[provider].yearly += est.yearlyCost
        totals[provider].count += 1
      })
    })

    return totals
  }, [reports])

  // Find most economical provider
  const mostEconomicalProvider = useMemo(() => {
    if (Object.keys(totalCostByProvider).length === 0) return null
    return Object.entries(totalCostByProvider).reduce((min, [provider, data]) => {
      return data.yearly < min[1].yearly ? [provider, data] : min
    })[0]
  }, [totalCostByProvider])

  // Calculate potential savings for a report
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

  const stats = useMemo(() => {
    const total = reports.length
    const totalEstimated = reports.reduce((sum, r) => {
      const avg = r.estimates.reduce((s, e) => s + e.yearlyCost, 0) / r.estimates.length
      return sum + avg
    }, 0)

    return {
      total,
      totalEstimated,
    }
  }, [reports])

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleViewDetails = (report: SavedAnalysis) => {
    router.push(`/dashboard/reports/${report.id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteAnalysis(id)
      setReports(getSavedAnalyses())
    }
  }

  const handleExportPDF = (report: SavedAnalysis) => {
    // In real app, this would generate and download PDF
    console.log("Exporting PDF for report:", report.id)
    alert(`PDF export for "${report.title}" would be generated here.`)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Total Estimated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.totalEstimated)}</div>
            <p className="text-xs text-muted-foreground mt-1">Combined estimates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-600" />
              Potential Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {mostEconomicalProvider
                ? formatCurrency(
                    Object.values(totalCostByProvider).reduce(
                      (max, data) => Math.max(max, data.yearly),
                      0,
                    ) - totalCostByProvider[mostEconomicalProvider].yearly,
                  )
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">By choosing best provider</p>
          </CardContent>
        </Card>
      </div>

      {/* Total Cost Summary by Provider */}
      {Object.keys(totalCostByProvider).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Total Cost Summary by Provider
            </CardTitle>
            <CardDescription>Aggregated costs across all reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(totalCostByProvider)
                .sort(([, a], [, b]) => b.yearly - a.yearly)
                .map(([provider, data]) => (
                  <div
                    key={provider}
                    className={`p-4 rounded-lg border-2 ${
                      provider === mostEconomicalProvider
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{provider}</span>
                      {provider === mostEconomicalProvider && (
                        <Badge className="bg-green-600">Best Value</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Monthly</div>
                        <div className="text-lg font-bold">{formatCurrency(data.monthly)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Yearly</div>
                        <div className="text-xl font-bold">{formatCurrency(data.yearly)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Used in {data.count} report{data.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <div className="flex gap-2">
              <Link href="/dashboard/cost-analysis">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setReports(getSavedAnalyses())}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="turkey-local">Turkey Local</SelectItem>
                  <SelectItem value="middle-east">Middle East</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports ({filteredReports.length})</CardTitle>
              <CardDescription>Click on a report to view detailed information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">No reports found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || filterRegion !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first cost analysis to generate a report"}
              </p>
              <Link href="/dashboard/cost-analysis">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Analysis
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Use Case</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Providers</TableHead>
                    <TableHead>Best Provider</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => {
                    const savings = calculateSavings(report)
                    const bestProvider = report.estimates.find((e) => e.isMostEconomical)
                    const avgCost =
                      report.estimates.reduce((sum, e) => sum + e.yearlyCost, 0) /
                      report.estimates.length

                    return (
                      <TableRow
                        key={report.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewDetails(report)}
                      >
                        <TableCell>
                          <div className="font-medium">{report.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.config.useCase}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{report.config.region}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {report.config.providers.map((provider) => (
                              <Badge key={provider} variant="secondary" className="text-xs">
                                {provider.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {bestProvider ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{bestProvider.provider.toUpperCase()}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{formatCurrency(avgCost)}</div>
                            {savings && (
                              <div className="text-xs text-muted-foreground">
                                Save {savings.percent}% with {savings.bestProvider?.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(report.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(report)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExportPDF(report)}>
                                <FileDown className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Export Excel
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(report.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
