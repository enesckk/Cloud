"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileDown, Lightbulb, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react"
import { getAnalysisById, type SavedAnalysis } from "@/lib/reports-storage"
import { useAuth } from "@/lib/auth-context"
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
  const { user } = useAuth()
  const [report, setReport] = useState<SavedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReport = async () => {
      try {
        const id = params.id as string
        const foundReport = await getAnalysisById(id)
        if (foundReport) {
          setReport(foundReport)
        }
      } catch (error) {
        console.error("Failed to load report:", error)
      } finally {
        setLoading(false)
      }
    }
    loadReport()
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
    
    const savings = calculateSavings(report)
    const sortedEstimates = [...report.estimates].sort((a, b) => a.yearlyCost - b.yearlyCost)
    
    // Build HTML content from report data
    const buildProviderHTML = (estimate: typeof report.estimates[0]) => {
      const info = providerInfo[estimate.provider as keyof typeof providerInfo] || {
        name: estimate.provider,
        shortName: estimate.provider.toUpperCase(),
      }
      const economical = estimate.isMostEconomical ? 'economical' : ''
      const borderStyle = estimate.isMostEconomical ? 'border: 2px solid #22c55e;' : 'border: 1px solid #000;'
      
      return `
        <div class="provider-card ${economical}" style="${borderStyle} margin-bottom: 15px; padding: 12px; page-break-inside: avoid;">
          ${estimate.isMostEconomical ? '<span class="badge">Most Economical</span>' : ''}
          <h3 style="font-size: 14px; margin: 10px 0 5px 0;">${info.name}</h3>
          <p style="font-size: 11px; margin: 5px 0;">Recommended Instance: <strong>${estimate.instanceType}</strong></p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
            <div>
              <p style="font-size: 10px; color: #666; margin-bottom: 5px;">Monthly Estimate</p>
              <p style="font-size: 18px; font-weight: bold; color: ${estimate.isMostEconomical ? '#22c55e' : '#000'};">${formatCurrency(estimate.monthlyCost)}</p>
            </div>
            <div>
              <p style="font-size: 10px; color: #666; margin-bottom: 5px;">Yearly Estimate</p>
              <p style="font-size: 18px; font-weight: bold;">${formatCurrency(estimate.yearlyCost)}</p>
            </div>
          </div>
        </div>
      `
    }
    
    const configHTML = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 10px;">
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Virtual CPU</div>
          <div style="font-size: 18px; font-weight: bold;">${report.config.vcpu}</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Memory (RAM)</div>
          <div style="font-size: 18px; font-weight: bold;">${report.config.ram} GB</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Storage</div>
          <div style="font-size: 18px; font-weight: bold;">${report.config.storage} GB</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Region</div>
          <div style="font-size: 18px; font-weight: bold;">${report.config.region}</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Operating System</div>
          <div style="font-size: 14px; font-weight: bold;">${report.config.os}</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Disk Type</div>
          <div style="font-size: 14px; font-weight: bold;">${report.config.diskType}</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Use Case</div>
          <div style="font-size: 14px; font-weight: bold;">${report.config.useCase}</div>
        </div>
        <div>
          <div style="font-size: 10px; color: #666; margin-bottom: 5px;">Providers</div>
          <div style="font-size: 12px;">${report.config.providers.map(p => p.toUpperCase()).join(', ')}</div>
        </div>
      </div>
    `
    
    const savingsHTML = savings ? `
      <div style="background: #e0f2fe; border: 2px solid #0284c7; padding: 15px; margin-top: 15px; page-break-inside: avoid;">
        <h3 style="font-size: 16px; margin-bottom: 10px;">Potential Annual Savings</h3>
        <p style="font-size: 24px; font-weight: bold; color: #0284c7; margin: 10px 0;">${formatCurrency(savings.amount)}</p>
        <p style="font-size: 12px; margin-top: 10px;">
          By choosing <strong>${savings.bestProvider?.toUpperCase()}</strong> instead of the most expensive option, 
          you could save <strong>${savings.percent}%</strong> annually on your cloud infrastructure costs.
        </p>
      </div>
    ` : ''
    
    // Create a new window with clean HTML
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title} - Report</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: auto;
              overflow: visible;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #000;
              background: white;
              padding: 0;
              margin: 0;
            }
            
            .report-header {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #000;
              page-break-after: avoid;
            }
            
            .report-header h1 {
              font-size: 22px;
              margin-bottom: 5px;
              font-weight: bold;
            }
            
            .report-header p {
              font-size: 11px;
              color: #666;
            }
            
            .card {
              border: 1px solid #000;
              margin-bottom: 15px;
              padding: 12px;
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            .card-header {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
              padding-bottom: 8px;
              border-bottom: 1px solid #ccc;
              page-break-after: avoid;
            }
            
            .card-description {
              font-size: 11px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .card-content {
              font-size: 11px;
            }
            
            h2 {
              font-size: 18px;
              margin: 15px 0 10px 0;
              font-weight: bold;
            }
            
            h3 {
              font-size: 14px;
              margin: 10px 0 5px 0;
              font-weight: bold;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 10px;
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
            }
            
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            
            .provider-card {
              border: 1px solid #000;
              margin-bottom: 15px;
              padding: 12px;
              page-break-inside: avoid;
            }
            
            .provider-card.economical {
              border: 2px solid #22c55e;
              background-color: #f0fdf4;
            }
            
            .badge {
              display: inline-block;
              padding: 4px 10px;
              background: #22c55e;
              color: white;
              font-size: 10px;
              border-radius: 3px;
              margin-bottom: 10px;
              font-weight: bold;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .card {
                page-break-inside: avoid;
              }
              
              h2, h3 {
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>${report.title}</h1>
            <p>Created on: ${formatDate(report.createdAt)}</p>
          </div>
          
          <div class="card">
            <div class="card-header">Configuration</div>
            <div class="card-description">Infrastructure configuration details</div>
            <div class="card-content">
              ${configHTML}
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">Provider Cost Breakdown</div>
            <div class="card-description">Detailed cost comparison across selected providers</div>
            <div class="card-content">
              ${sortedEstimates.map(buildProviderHTML).join('')}
            </div>
          </div>
          
          ${savings ? `
          <div class="card">
            <div class="card-header">Savings Opportunities</div>
            <div class="card-description">Potential cost savings by choosing the optimal provider</div>
            <div class="card-content">
              ${savingsHTML}
            </div>
          </div>
          ` : ''}
          
          <div class="card">
            <div class="card-header">Cost Summary Table</div>
            <div class="card-content">
              <table>
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Instance Type</th>
                    <th>Monthly Cost</th>
                    <th>Yearly Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedEstimates.map(est => `
                    <tr ${est.isMostEconomical ? 'style="background-color: #f0fdf4;"' : ''}>
                      <td><strong>${(providerInfo[est.provider as keyof typeof providerInfo]?.name || est.provider)}</strong></td>
                      <td>${est.instanceType}</td>
                      <td>${formatCurrency(est.monthlyCost)}</td>
                      <td><strong>${formatCurrency(est.yearlyCost)}</strong></td>
                      <td>${est.isMostEconomical ? '<strong style="color: #22c55e;">Most Economical</strong>' : '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
    }, 500)
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
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          
          /* Hide sidebar, header, navigation, buttons */
          aside,
          header,
          nav,
          button,
          .no-print,
          .sidebar,
          .panel-header,
          [class*="sidebar"],
          [class*="header"] {
            display: none !important;
          }
          
          /* Reset body and html */
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-size: 12px !important;
          }
          
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          
          /* Print content layout */
          .print-content {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          
          /* Cards with page break control */
          .print-content .card,
          .print-content [class*="Card"] {
            box-shadow: none !important;
            border: 1px solid #000 !important;
            margin: 5mm 0 !important;
            padding: 3mm !important;
            page-break-inside: avoid;
            page-break-after: auto;
            background: white !important;
          }
          
          [class*="CardHeader"] {
            padding: 2mm !important;
            margin-bottom: 2mm !important;
            border-bottom: 1px solid #ccc !important;
            page-break-after: avoid;
          }
          
          [class*="CardContent"] {
            padding: 2mm !important;
          }
          
          /* Normal text sizes */
          .print-content h1 { 
            font-size: 18px !important; 
            margin: 2mm 0 !important; 
            font-weight: bold !important;
            line-height: 1.3 !important;
            page-break-after: avoid;
          }
          .print-content h2 { 
            font-size: 16px !important; 
            margin: 2mm 0 !important; 
            font-weight: bold !important;
            line-height: 1.3 !important;
            page-break-after: avoid;
          }
          .print-content h3 { 
            font-size: 14px !important; 
            margin: 1.5mm 0 !important; 
            font-weight: bold !important;
            line-height: 1.3 !important;
            page-break-after: avoid;
          }
          .print-content p, 
          .print-content span, 
          .print-content div, 
          .print-content li { 
            font-size: 11px !important; 
            line-height: 1.4 !important; 
            margin: 1mm 0 !important;
          }
          
          /* Tables */
          .print-content table {
            width: 100% !important;
            font-size: 10px !important;
            border-collapse: collapse !important;
            page-break-inside: avoid;
          }
          
          .print-content th,
          .print-content td {
            padding: 2mm !important;
            border: 1px solid #ccc !important;
          }
          
          /* Charts - normal size */
          .print-content svg,
          .print-content canvas {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
          }
          
          .print-content [class*="recharts"] {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            height: auto !important;
          }
          
          .print-content [class*="ChartContainer"],
          .print-content [class*="chart-container"] {
            width: 100% !important;
            height: 200px !important;
            min-height: 200px !important;
            max-height: 250px !important;
            page-break-inside: avoid;
          }
          
          .print-content .recharts-wrapper {
            width: 100% !important;
            height: 200px !important;
          }
          
          .print-content .recharts-surface {
            width: 100% !important;
            height: 200px !important;
          }
          
          /* Normal spacing */
          .print-content .space-y-6 > * + * { margin-top: 4mm !important; }
          .print-content .space-y-4 > * + * { margin-top: 3mm !important; }
          .print-content .gap-6 { gap: 3mm !important; }
          .print-content .gap-4 { gap: 2mm !important; }
          .print-content .mb-6 { margin-bottom: 4mm !important; }
          .print-content .mb-4 { margin-bottom: 3mm !important; }
          .print-content .mb-2 { margin-bottom: 2mm !important; }
          .print-content .mt-4 { margin-top: 3mm !important; }
          .print-content .mt-2 { margin-top: 2mm !important; }
          
          /* Badges */
          .print-content [class*="Badge"] {
            font-size: 9px !important;
            padding: 1mm 2mm !important;
            border: 1px solid #000 !important;
          }
          
          /* Provider cards */
          .print-content [class*="rounded-xl"] {
            padding: 3mm !important;
            margin: 2mm 0 !important;
            page-break-inside: avoid;
          }
          
          .print-content .grid {
            gap: 2mm !important;
          }
          
          /* Ensure everything fits and can break pages */
          .print-content * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Allow page breaks between major sections */
          .print-content > div {
            page-break-inside: auto;
          }
        }
      `}</style>
      <div className="p-6 max-w-7xl mx-auto print-container print-content">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/reports")} className="mb-4 no-print">
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
          <div className="flex gap-2 no-print">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
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
                  const info = providerInfo[estimate.provider as keyof typeof providerInfo] || {
                    name: estimate.provider,
                    shortName: estimate.provider.toUpperCase(),
                    logo: estimate.provider.toUpperCase(),
                    color: "text-gray-600",
                  }
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
                          } text-2xl font-bold ${info.color || "text-gray-600"}`}
                        >
                          {info.logo || estimate.provider.toUpperCase()}
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
    </>
  )
}
