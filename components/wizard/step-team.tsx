"use client"

import { useWizard } from "@/lib/wizard-context"
import { TooltipLabel } from "./tooltip-label"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar } from "lucide-react"

export function StepTeam() {
  const { data, updateData } = useWizard()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Team & Timeline</h2>
            <p className="text-sm text-muted-foreground">Your capabilities and expectations</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Cloud Experience */}
        <div className="space-y-4">
          <TooltipLabel
            label="Team's Cloud Experience"
            tooltip="Your team's familiarity with cloud technologies affects training needs and migration approach."
          />
          <RadioGroup
            value={data.cloudExperience}
            onValueChange={(value) => updateData({ cloudExperience: value })}
            className="grid gap-3"
          >
            {[
              { value: "none", label: "No cloud experience", description: "Team is new to cloud technologies" },
              {
                value: "some",
                label: "Some experience",
                description: "Basic cloud knowledge, limited production use",
              },
              {
                value: "experienced",
                label: "Experienced",
                description: "Running production workloads in the cloud",
              },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={`exp-${option.value}`} />
                <Label htmlFor={`exp-${option.value}`} className="flex-1 cursor-pointer">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Dedicated Team */}
        <div className="space-y-4">
          <TooltipLabel
            label="Dedicated Migration Team"
            tooltip="Having dedicated resources for migration affects timeline and quality of the migration."
          />
          <RadioGroup
            value={data.dedicatedTeam}
            onValueChange={(value) => updateData({ dedicatedTeam: value })}
            className="grid gap-3"
          >
            {[
              { value: "yes", label: "Yes, we have a dedicated team" },
              { value: "partial", label: "Partially dedicated (shared responsibilities)" },
              { value: "no", label: "No, migration will be handled alongside other work" },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={`team-${option.value}`} />
                <Label htmlFor={`team-${option.value}`} className="flex-1 cursor-pointer text-foreground">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Timeline Expectation */}
        <div className="space-y-4">
          <TooltipLabel
            label="Expected Timeline"
            tooltip="Your desired completion timeline helps us recommend an appropriate migration pace."
          />
          <Select
            value={data.timelineExpectation}
            onValueChange={(value) => updateData({ timelineExpectation: value })}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select timeline" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3months">1-3 months</SelectItem>
              <SelectItem value="3-6months">3-6 months</SelectItem>
              <SelectItem value="6-12months">6-12 months</SelectItem>
              <SelectItem value="over-12months">Over 12 months</SelectItem>
              <SelectItem value="flexible">Flexible / No deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
