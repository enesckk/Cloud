// Cloud provider pricing calculator
// Based on real-world pricing models (2024 estimates)

export type UseCase =
  | "web-app"
  | "database"
  | "erp"
  | "archive-backup"
  | "high-traffic"
  | "general-server"

export type OS =
  | "ubuntu-lts"
  | "centos"
  | "rhel"
  | "debian"
  | "windows-server-2019"
  | "windows-server-2022"

export type DiskType = "standard-hdd" | "standard-ssd" | "premium-ssd" | "ultra-ssd"

export type Region =
  | "europe"
  | "middle-east"
  | "asia-pacific"
  | "north-america"
  | "latin-america"
  | "turkey-local"

export interface InfrastructureConfig {
  vcpu: number
  ram: number // GB
  storage: number // GB
  os: OS
  diskType: DiskType
  useCase: UseCase
  region: Region
}

// Provider region availability
export const providerRegions: Record<
  "aws" | "azure" | "gcp" | "huawei",
  Array<{ value: Region; label: string; available: boolean }>
> = {
  aws: [
    { value: "europe", label: "Europe", available: true },
    { value: "middle-east", label: "Middle East", available: true },
    { value: "asia-pacific", label: "Asia Pacific", available: true },
    { value: "north-america", label: "North America", available: true },
    { value: "latin-america", label: "Latin America", available: true },
    { value: "turkey-local", label: "Turkey Local", available: false }, // AWS has no local Turkey region
  ],
  azure: [
    { value: "europe", label: "Europe", available: true },
    { value: "middle-east", label: "Middle East", available: true },
    { value: "asia-pacific", label: "Asia Pacific", available: true },
    { value: "north-america", label: "North America", available: true },
    { value: "latin-america", label: "Latin America", available: true },
    { value: "turkey-local", label: "Turkey Local", available: false }, // Azure has no local Turkey region
  ],
  gcp: [
    { value: "europe", label: "Europe", available: true },
    { value: "middle-east", label: "Middle East", available: true },
    { value: "asia-pacific", label: "Asia Pacific", available: true },
    { value: "north-america", label: "North America", available: true },
    { value: "latin-america", label: "Latin America", available: true },
    { value: "turkey-local", label: "Turkey Local", available: true }, // GCP has Turkey region
  ],
  huawei: [
    { value: "europe", label: "Europe", available: true },
    { value: "middle-east", label: "Middle East", available: true },
    { value: "asia-pacific", label: "Asia Pacific", available: true },
    { value: "north-america", label: "North America", available: true },
    { value: "latin-america", label: "Latin America", available: true },
    { value: "turkey-local", label: "Turkey Local (Istanbul)", available: true }, // Huawei has local Turkey region
  ],
}

export interface ProviderEstimate {
  provider: "aws" | "azure" | "gcp" | "huawei"
  instanceType: string
  monthlyCost: number
  yearlyCost: number
  isMostEconomical?: boolean
}

// Get recommended disk type based on use case
export function getRecommendedDiskType(useCase: UseCase): DiskType {
  switch (useCase) {
    case "database":
    case "erp":
      return "premium-ssd"
    case "high-traffic":
      return "ultra-ssd"
    case "archive-backup":
      return "standard-hdd"
    case "web-app":
    case "general-server":
    default:
      return "standard-ssd"
  }
}

// Region pricing multipliers (relative to base pricing)
// Some regions are more expensive, some are cheaper
const regionMultipliers: Record<Region, Record<"aws" | "azure" | "gcp" | "huawei", number>> = {
  europe: {
    aws: 1.0, // Base pricing
    azure: 1.0,
    gcp: 1.0,
    huawei: 1.0,
  },
  "middle-east": {
    aws: 1.05, // Slightly higher
    azure: 1.05,
    gcp: 1.08,
    huawei: 0.95, // Huawei has strong presence in Middle East
  },
  "asia-pacific": {
    aws: 1.02,
    azure: 1.03,
    gcp: 0.98, // GCP has strong APAC presence
    huawei: 0.92, // Huawei is strong in APAC
  },
  "north-america": {
    aws: 0.95, // AWS and GCP are cheaper in NA
    azure: 0.97,
    gcp: 0.95,
    huawei: 1.1, // More expensive for Huawei in NA
  },
  "latin-america": {
    aws: 1.08,
    azure: 1.1,
    gcp: 1.05,
    huawei: 1.15, // Less presence
  },
  "turkey-local": {
    aws: 1.1, // No local region, routed through Europe with premium
    azure: 1.1, // No local region, routed through Europe with premium
    gcp: 0.92, // Local region, cheaper due to reduced latency and data transfer
    huawei: 0.88, // Local region, cheaper due to reduced latency and data transfer
  },
}

// Realistic pricing calculation based on instance types
export function calculateProviderCosts(config: InfrastructureConfig): ProviderEstimate[] {
  const { vcpu, ram, storage, os, diskType, useCase, region } = config

  // Determine OS type for pricing
  const isWindows = os.startsWith("windows")
  const osType = isWindows ? "windows" : "linux"

  // Base compute costs per vCPU-hour (USD)
  // Adjusted to ensure competitive pricing across providers
  const computeRates = {
    aws: {
      linux: 0.0415, // t3.large pricing
      windows: 0.083,
    },
    azure: {
      linux: 0.0468, // Standard_B4ms pricing
      windows: 0.0936,
    },
    gcp: {
      linux: 0.0495, // e2-standard-2 pricing
      windows: 0.099,
    },
    huawei: {
      linux: 0.042, // Adjusted - slightly higher to be more competitive
      windows: 0.084,
    },
  }

  // Storage costs per GB-month - more realistic pricing
  const storageRates = {
    "standard-hdd": {
      aws: 0.045, // st1
      azure: 0.04, // Standard HDD
      gcp: 0.04, // pd-standard
      huawei: 0.038, // SATA
    },
    "standard-ssd": {
      aws: 0.08, // gp3 general purpose SSD
      azure: 0.10, // Standard SSD
      gcp: 0.17, // pd-ssd
      huawei: 0.075, // Standard SSD
    },
    "premium-ssd": {
      aws: 0.125, // io1/io2
      azure: 0.15, // Premium SSD LRS
      gcp: 0.24, // pd-ssd (high IOPS)
      huawei: 0.12, // Ultra SSD
    },
    "ultra-ssd": {
      aws: 0.16, // io2 Block Express
      azure: 0.18, // Ultra SSD
      gcp: 0.30, // pd-ssd (extreme)
      huawei: 0.15, // High Performance SSD
    },
  }

  // Use case multipliers (affect compute costs)
  const useCaseMultipliers: Record<UseCase, number> = {
    "web-app": 1.0,
    "general-server": 1.0,
    database: 1.15, // Higher compute for DB workloads
    erp: 1.2, // Enterprise workloads need more resources
    "high-traffic": 1.25, // Need more compute power
    "archive-backup": 0.9, // Lower compute needs
  }

  // RAM multiplier (more RAM = higher cost, but less than linear)
  const baseRamPerVcpu = 4
  const ramRatio = ram / vcpu
  const ramMultiplier = 1 + ((ramRatio - baseRamPerVcpu) / baseRamPerVcpu) * 0.25

  // Calculate monthly costs
  const calculateMonthly = (
    provider: keyof typeof computeRates,
    baseRate: number,
    storageRate: number,
  ) => {
    // Get region multiplier for this provider
    const regionMultiplier = regionMultipliers[region][provider]

    // Compute cost: vCPU * base rate * hours per month (730) * RAM multiplier * use case multiplier * region multiplier
    const adjustedMultiplier = Math.max(0.85, Math.min(1.4, ramMultiplier))
    const useCaseMultiplier = useCaseMultipliers[useCase]
    const computeCost =
      vcpu * baseRate * 730 * adjustedMultiplier * useCaseMultiplier * regionMultiplier

    // Storage cost: storage GB * storage rate per GB-month * region multiplier
    const storageCost = storage * storageRate * regionMultiplier

    // Network/Data transfer cost (varies by use case and region)
    const networkMultiplier = useCase === "high-traffic" ? 0.08 : useCase === "archive-backup" ? 0.02 : 0.04
    // Turkey local has lower network costs for Huawei
    const networkRegionMultiplier = region === "turkey-local" && provider === "huawei" ? 0.7 : 1.0
    const networkCost = computeCost * networkMultiplier * networkRegionMultiplier

    // Total monthly cost
    return Math.round((computeCost + storageCost + networkCost) * 100) / 100
  }

  // Determine instance types based on configuration
  const getInstanceType = (provider: string, vcpu: number, ram: number) => {
    if (provider === "aws") {
      if (vcpu === 2 && ram === 8) return "t3.medium"
      if (vcpu === 4 && ram === 16) return "t3.large"
      if (vcpu === 8 && ram === 32) return "t3.xlarge"
      return `t3.${vcpu >= 8 ? "xlarge" : vcpu >= 4 ? "large" : "medium"}`
    }
    if (provider === "azure") {
      if (vcpu === 2 && ram === 4) return "Standard_B2s"
      if (vcpu === 4 && ram === 8) return "Standard_B2s"
      if (vcpu === 4 && ram === 16) return "Standard_B4ms"
      return `Standard_B${vcpu}s`
    }
    if (provider === "gcp") {
      if (vcpu === 2 && ram === 8) return "e2-standard-2"
      if (vcpu === 4 && ram === 16) return "e2-standard-2"
      if (vcpu === 8 && ram === 32) return "e2-standard-4"
      return `e2-standard-${vcpu}`
    }
    if (provider === "huawei") {
      if (vcpu === 2 && ram === 8) return "s6.large.2"
      if (vcpu === 4 && ram === 16) return "s6.xlarge.2"
      if (vcpu === 8 && ram === 32) return "s6.2xlarge.2"
      return `s6.${vcpu >= 8 ? "2xlarge" : vcpu >= 4 ? "xlarge" : "large"}.2`
    }
    return "custom"
  }

  const estimates: ProviderEstimate[] = [
    {
      provider: "aws",
      instanceType: getInstanceType("aws", vcpu, ram),
      monthlyCost: calculateMonthly(
        "aws",
        computeRates.aws[osType],
        storageRates[diskType].aws,
      ),
      yearlyCost: 0, // Will calculate
    },
    {
      provider: "azure",
      instanceType: getInstanceType("azure", vcpu, ram),
      monthlyCost: calculateMonthly(
        "azure",
        computeRates.azure[osType],
        storageRates[diskType].azure,
      ),
      yearlyCost: 0,
    },
    {
      provider: "gcp",
      instanceType: getInstanceType("gcp", vcpu, ram),
      monthlyCost: calculateMonthly(
        "gcp",
        computeRates.gcp[osType],
        storageRates[diskType].gcp,
      ),
      yearlyCost: 0,
    },
    {
      provider: "huawei",
      instanceType: getInstanceType("huawei", vcpu, ram),
      monthlyCost: calculateMonthly(
        "huawei",
        computeRates.huawei[osType],
        storageRates[diskType].huawei,
      ),
      yearlyCost: 0,
    },
  ]

  // Calculate yearly costs (monthly * 12, with slight discount)
  estimates.forEach((est) => {
    est.yearlyCost = Math.round(est.monthlyCost * 12 * 0.95 * 100) / 100
  })

  // Find most economical option
  const mostEconomical = estimates.reduce((min, current) =>
    current.monthlyCost < min.monthlyCost ? current : min,
  )
  mostEconomical.isMostEconomical = true

  return estimates
}
