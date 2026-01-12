"use client"

import { useWizard } from "@/lib/wizard-context"
import { TooltipLabel } from "./tooltip-label"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, DollarSign } from "lucide-react"

const complianceOptions = [
  { id: "hipaa", label: "HIPAA (Healthcare)" },
  { id: "gdpr", label: "GDPR (European Data)" },
  { id: "pci", label: "PCI DSS (Payment Data)" },
  { id: "sox", label: "SOX (Financial)" },
  { id: "none", label: "No specific requirements" },
]

export function StepRequirements() {
  const { data, updateData } = useWizard()

  const handleComplianceChange = (id: string, checked: boolean) => {
    const current = data.complianceRequirements || []
    if (checked) {
      updateData({ complianceRequirements: [...current, id] })
    } else {
      updateData({ complianceRequirements: current.filter((item) => item !== id) })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Business Requirements</h2>
            <p className="text-sm text-muted-foreground">Your constraints and compliance needs</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Compliance Requirements */}
        <div className="space-y-4">
          <TooltipLabel
            label="Compliance Requirements"
            tooltip="Regulatory compliance affects which cloud services and configurations are appropriate."
          />
          <div className="space-y-3">
            {complianceOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <Checkbox
                  id={option.id}
                  checked={(data.complianceRequirements || []).includes(option.id)}
                  onCheckedChange={(checked) => handleComplianceChange(option.id, checked as boolean)}
                />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer text-foreground">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Downtime Tolerance */}
        <div className="space-y-4">
          <TooltipLabel
            label="Downtime Tolerance"
            tooltip="How much service interruption is acceptable during migration affects the strategy and timeline."
          />
          <RadioGroup
            value={data.downTimeTolerrance}
            onValueChange={(value) => updateData({ downTimeTolerrance: value })}
            className="grid gap-3"
          >
            {[
              { value: "zero", label: "Zero downtime required", description: "Mission-critical systems" },
              { value: "minimal", label: "Minimal downtime", description: "A few hours during off-peak" },
              { value: "flexible", label: "Flexible", description: "Weekend or extended maintenance window" },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={`downtime-${option.value}`} />
                <Label htmlFor={`downtime-${option.value}`} className="flex-1 cursor-pointer">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Budget Range */}
        <div className="space-y-4">
          <TooltipLabel
            label="Budget Range"
            tooltip="Your budget influences the pace of migration and available tooling options."
          />
          <Select value={data.budgetRange} onValueChange={(value) => updateData({ budgetRange: value })}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select budget range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-50k">Under $50,000</SelectItem>
              <SelectItem value="50k-200k">$50,000 - $200,000</SelectItem>
              <SelectItem value="200k-500k">$200,000 - $500,000</SelectItem>
              <SelectItem value="over-500k">Over $500,000</SelectItem>
              <SelectItem value="not-defined">Not yet defined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
