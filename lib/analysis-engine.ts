import type { WizardData } from "./wizard-context"

export interface AnalysisResult {
  migrationStrategy: string
  strategyDescription: string
  costEstimate: {
    level: "low" | "medium" | "high"
    range: string
    factors: string[]
  }
  timelineEstimate: {
    range: string
    factors: string[]
  }
  risks: Array<{
    title: string
    description: string
    severity: "low" | "medium" | "high"
  }>
  recommendations: string[]
  considerations: string[]
}

export function analyzeData(data: WizardData): AnalysisResult {
  // Determine migration strategy based on inputs
  let migrationStrategy = "Lift and Shift"
  let strategyDescription =
    "Move your existing applications to the cloud with minimal changes. This approach is fastest but may not fully leverage cloud-native benefits."

  if (data.applicationComplexity === "complex" || data.legacyDependencies === "significant") {
    migrationStrategy = "Phased Migration"
    strategyDescription =
      "A gradual approach that migrates systems in stages, allowing for modernization and risk mitigation throughout the process."
  } else if (data.applicationComplexity === "simple" && data.cloudExperience === "experienced") {
    migrationStrategy = "Replatform"
    strategyDescription =
      "Move to the cloud while making targeted optimizations to leverage cloud services without a full redesign."
  }

  // Cost estimation
  let costLevel: "low" | "medium" | "high" = "medium"
  const costFactors: string[] = []

  if (data.infrastructureSize === "large" || data.dataVolume === "over-100tb") {
    costLevel = "high"
    costFactors.push("Large infrastructure scale increases migration complexity and costs")
  } else if (data.infrastructureSize === "small" && data.dataVolume === "under-100gb") {
    costLevel = "low"
    costFactors.push("Small infrastructure allows for streamlined migration")
  }

  if (data.legacyDependencies === "significant") {
    costFactors.push("Legacy system modernization requires additional investment")
  }

  if (data.downTimeTolerrance === "zero") {
    costFactors.push("Zero-downtime requirement increases infrastructure costs")
  }

  if (data.cloudExperience === "none") {
    costFactors.push("Training and potential consulting needs add to costs")
  }

  const costRanges = {
    low: "$10,000 - $50,000",
    medium: "$50,000 - $200,000",
    high: "$200,000 - $500,000+",
  }

  // Timeline estimation
  let timelineRange = "3-6 months"
  const timelineFactors: string[] = []

  if (data.infrastructureSize === "large") {
    timelineRange = "9-18 months"
    timelineFactors.push("Large infrastructure requires extended migration phases")
  } else if (data.applicationComplexity === "complex") {
    timelineRange = "6-12 months"
    timelineFactors.push("Complex applications need thorough testing and validation")
  } else if (data.infrastructureSize === "small" && data.applicationComplexity === "simple") {
    timelineRange = "1-3 months"
    timelineFactors.push("Simple infrastructure enables faster migration")
  }

  if (data.dedicatedTeam === "no") {
    timelineFactors.push("Without dedicated resources, timeline may extend")
  }

  // Risk assessment
  const risks: AnalysisResult["risks"] = []

  if (data.downTimeTolerrance === "zero" && data.applicationComplexity !== "simple") {
    risks.push({
      title: "Zero-Downtime Challenge",
      description:
        "Achieving zero downtime with complex applications requires advanced strategies like blue-green deployments and extensive testing.",
      severity: "high",
    })
  }

  if (data.legacyDependencies === "significant") {
    risks.push({
      title: "Legacy System Compatibility",
      description: "Significant legacy dependencies may create unexpected compatibility issues during migration.",
      severity: "high",
    })
  }

  if (data.cloudExperience === "none") {
    risks.push({
      title: "Skills Gap",
      description: "Limited cloud experience may lead to misconfigurations and longer troubleshooting periods.",
      severity: "medium",
    })
  }

  if (data.complianceRequirements?.length > 0 && !data.complianceRequirements.includes("none")) {
    risks.push({
      title: "Compliance Requirements",
      description:
        "Regulatory compliance adds complexity to cloud architecture and may limit available services or regions.",
      severity: "medium",
    })
  }

  if (data.dataVolume === "10tb-100tb" || data.dataVolume === "over-100tb") {
    risks.push({
      title: "Data Transfer Challenges",
      description:
        "Large data volumes require careful planning for transfer methods, bandwidth, and potential offline migration tools.",
      severity: "medium",
    })
  }

  // Recommendations
  const recommendations: string[] = [
    "Conduct a detailed application dependency mapping before starting migration",
    "Establish clear success metrics and monitoring from day one",
    "Plan for a parallel running period to validate the migration",
  ]

  if (data.cloudExperience === "none" || data.cloudExperience === "some") {
    recommendations.push("Invest in cloud training for your team or consider engaging cloud consultants")
  }

  if (data.dedicatedTeam !== "yes") {
    recommendations.push("Consider allocating dedicated resources for the migration project")
  }

  if (data.legacyDependencies === "significant") {
    recommendations.push("Evaluate which legacy systems can be modernized versus those requiring lift-and-shift")
  }

  // Considerations
  const considerations: string[] = [
    "This analysis provides guidance based on the information provided. Actual results may vary based on specific circumstances.",
    "Cloud costs are dynamic and should be monitored continuously after migration.",
    "Consider engaging cloud providers' professional services for complex migrations.",
  ]

  return {
    migrationStrategy,
    strategyDescription,
    costEstimate: {
      level: costLevel,
      range: costRanges[costLevel],
      factors: costFactors,
    },
    timelineEstimate: {
      range: timelineRange,
      factors: timelineFactors,
    },
    risks,
    recommendations,
    considerations,
  }
}
