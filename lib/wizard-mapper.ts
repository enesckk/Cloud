/**
 * Wizard Data Mapper
 * 
 * Maps frontend wizard data to backend API format.
 * Handles the transformation between frontend field names and backend question IDs.
 */

import { WizardData } from "./wizard-context"
import { EstimateRequest } from "./api-client"

/**
 * Map frontend wizard data to backend API request format
 */
export function mapWizardToBackendRequest(data: WizardData): EstimateRequest {
  // Map frontend fields to backend question IDs
  // Note: This is a simplified mapping - in production, you'd need to handle
  // all 18 questions. For now, we map the existing 12 questions.
  
  return {
    // Company Size - map from infrastructureSize
    company_size: mapInfrastructureSizeToCompanySize(data.infrastructureSize),
    
    // Current Infrastructure Type - default to on-premise for now
    current_infrastructure_type: "on-premise",
    
    // Data Size - map from dataVolume
    data_size: mapDataVolumeToDataSize(data.dataVolume),
    
    // Database Complexity - map from databaseType
    database_complexity: mapDatabaseTypeToComplexity(data.databaseType),
    
    // Monthly Traffic - default to medium
    monthly_traffic: "medium",
    
    // Application Architecture - map from applicationComplexity
    application_architecture: mapComplexityToArchitecture(data.applicationComplexity),
    
    // Number of Applications - map from numberOfServers
    number_of_applications: mapServersToApplications(data.numberOfServers),
    
    // Operating System Diversity - default
    operating_system_diversity: "few",
    
    // Security Requirements - default
    security_requirements: [],
    
    // Compliance Requirements - map from complianceRequirements
    compliance_requirements: mapComplianceRequirements(data.complianceRequirements),
    
    // Backup & Disaster Recovery - default
    backup_disaster_recovery: "standard",
    
    // Availability Requirement - map from downTimeTolerrance
    availability_requirement: mapDowntimeToAvailability(data.downTimeTolerrance),
    
    // Peak Load Variability - default
    peak_load_variability: "moderate",
    
    // CI/CD & Automation Level - default
    cicd_automation_level: "basic",
    
    // Monitoring & Logging Needs - default
    monitoring_logging_needs: "standard",
    
    // Team Cloud Experience - map from cloudExperience
    team_cloud_experience: mapCloudExperience(data.cloudExperience),
    
    // Migration Timeline - map from timelineExpectation
    migration_timeline: mapTimelineExpectation(data.timelineExpectation),
    
    // Migration Strategy - default to lift_shift
    migration_strategy: "lift_shift",
  }
}

// Helper mapping functions

function mapInfrastructureSizeToCompanySize(size: string): string {
  const mapping: Record<string, string> = {
    small: "startup",
    medium: "small",
    large: "medium",
  }
  return mapping[size] || "small"
}

function mapDataVolumeToDataSize(volume: string): string {
  const mapping: Record<string, string> = {
    "under-100gb": "0",
    "100gb-1tb": "1",
    "1tb-10tb": "2",
    "10tb-100tb": "3",
    "over-100tb": "4",
  }
  return mapping[volume] || "1"
}

function mapDatabaseTypeToComplexity(dbType: string): string {
  const mapping: Record<string, string> = {
    relational: "moderate",
    nosql: "moderate",
    mixed: "complex",
    "data-warehouse": "enterprise",
    none: "simple",
  }
  return mapping[dbType] || "moderate"
}

function mapComplexityToArchitecture(complexity: string): string {
  const mapping: Record<string, string> = {
    simple: "monolithic",
    moderate: "microservices",
    complex: "microservices",
  }
  return mapping[complexity] || "monolithic"
}

function mapServersToApplications(servers: string): string {
  const mapping: Record<string, string> = {
    "1-5": "0",
    "6-20": "1",
    "21-50": "2",
    "51-100": "3",
    "100+": "4",
  }
  return mapping[servers] || "1"
}

function mapComplianceRequirements(requirements: string[]): string[] {
  if (!requirements || requirements.length === 0) {
    return ["none"]
  }
  // Map frontend compliance IDs to backend format
  return requirements.map((req) => {
    const mapping: Record<string, string> = {
      hipaa: "hipaa",
      gdpr: "gdpr",
      pci: "pci_dss",
      sox: "sox",
      none: "none",
    }
    return mapping[req] || req
  })
}

function mapDowntimeToAvailability(downtime: string): string {
  const mapping: Record<string, string> = {
    zero: "99_99",
    minimal: "99_9",
    flexible: "99_5",
  }
  return mapping[downtime] || "99_9"
}

function mapCloudExperience(experience: string): string {
  const mapping: Record<string, string> = {
    none: "none",
    some: "some",
    experienced: "experienced",
  }
  return mapping[experience] || "some"
}

function mapTimelineExpectation(timeline: string): string {
  const mapping: Record<string, string> = {
    "1-3months": "0",
    "3-6months": "1",
    "6-12months": "2",
    "over-12months": "3",
    flexible: "4",
  }
  return mapping[timeline] || "2"
}
