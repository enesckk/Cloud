"use client"

import { useWizard } from "@/lib/wizard-context"
import { TooltipLabel } from "./tooltip-label"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, Database } from "lucide-react"

export function StepApplications() {
  const { data, updateData } = useWizard()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Application Details</h2>
            <p className="text-sm text-muted-foreground">Tell us about your applications</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Application Complexity */}
        <div className="space-y-4">
          <TooltipLabel
            label="Application Architecture Complexity"
            tooltip="Consider how your applications are structured and how they communicate with each other."
          />
          <RadioGroup
            value={data.applicationComplexity}
            onValueChange={(value) => updateData({ applicationComplexity: value })}
            className="grid gap-3"
          >
            {[
              {
                value: "simple",
                label: "Simple",
                description: "Standalone applications with minimal dependencies",
              },
              {
                value: "moderate",
                label: "Moderate",
                description: "Some interconnected services and databases",
              },
              {
                value: "complex",
                label: "Complex",
                description: "Microservices or heavily integrated systems",
              },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={`complexity-${option.value}`} />
                <Label htmlFor={`complexity-${option.value}`} className="flex-1 cursor-pointer">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Legacy Dependencies */}
        <div className="space-y-4">
          <TooltipLabel
            label="Legacy System Dependencies"
            tooltip="Legacy systems may require special handling or modernization during migration."
          />
          <RadioGroup
            value={data.legacyDependencies}
            onValueChange={(value) => updateData({ legacyDependencies: value })}
            className="grid gap-3"
          >
            {[
              { value: "none", label: "No legacy dependencies" },
              { value: "some", label: "Some legacy systems that can be modernized" },
              { value: "significant", label: "Significant legacy dependencies requiring special handling" },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={`legacy-${option.value}`} />
                <Label htmlFor={`legacy-${option.value}`} className="flex-1 cursor-pointer text-foreground">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Database Type */}
        <div className="space-y-4">
          <TooltipLabel
            label="Primary Database Type"
            tooltip="Different database types have varying migration complexity and cloud options."
          />
          <Select value={data.databaseType} onValueChange={(value) => updateData({ databaseType: value })}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select database type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relational">Relational (MySQL, PostgreSQL, SQL Server)</SelectItem>
              <SelectItem value="nosql">NoSQL (MongoDB, Cassandra, DynamoDB)</SelectItem>
              <SelectItem value="mixed">Mixed (Multiple database types)</SelectItem>
              <SelectItem value="data-warehouse">Data Warehouse (Snowflake, Redshift)</SelectItem>
              <SelectItem value="none">No databases</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
