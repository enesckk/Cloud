"use client"

import { useWizard } from "@/lib/wizard-context"
import { TooltipLabel } from "./tooltip-label"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Server, Database, HardDrive } from "lucide-react"

export function StepInfrastructure() {
  const { data, updateData } = useWizard()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Current Infrastructure</h2>
            <p className="text-sm text-muted-foreground">Tell us about your existing setup</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Infrastructure Size */}
        <div className="space-y-4">
          <TooltipLabel
            label="Infrastructure Size"
            tooltip="The overall scale of your IT infrastructure helps determine migration complexity and resource requirements."
          />
          <RadioGroup
            value={data.infrastructureSize}
            onValueChange={(value) => updateData({ infrastructureSize: value })}
            className="grid gap-3"
          >
            {[
              { value: "small", label: "Small", description: "Up to 10 servers or services" },
              { value: "medium", label: "Medium", description: "11-50 servers or services" },
              { value: "large", label: "Large", description: "50+ servers or services" },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={`size-${option.value}`} />
                <Label htmlFor={`size-${option.value}`} className="flex-1 cursor-pointer">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Number of Servers */}
        <div className="space-y-4">
          <TooltipLabel
            label="Approximate Number of Servers"
            tooltip="Include physical servers, virtual machines, and containerized workloads."
          />
          <Select value={data.numberOfServers} onValueChange={(value) => updateData({ numberOfServers: value })}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5 servers</SelectItem>
              <SelectItem value="6-20">6-20 servers</SelectItem>
              <SelectItem value="21-50">21-50 servers</SelectItem>
              <SelectItem value="51-100">51-100 servers</SelectItem>
              <SelectItem value="100+">100+ servers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Volume */}
        <div className="space-y-4">
          <TooltipLabel
            label="Total Data Volume"
            tooltip="Estimate all data that needs to be migrated, including databases, files, and backups."
          />
          <Select value={data.dataVolume} onValueChange={(value) => updateData({ dataVolume: value })}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-3">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select volume" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-100gb">Under 100 GB</SelectItem>
              <SelectItem value="100gb-1tb">100 GB - 1 TB</SelectItem>
              <SelectItem value="1tb-10tb">1 TB - 10 TB</SelectItem>
              <SelectItem value="10tb-100tb">10 TB - 100 TB</SelectItem>
              <SelectItem value="over-100tb">Over 100 TB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
