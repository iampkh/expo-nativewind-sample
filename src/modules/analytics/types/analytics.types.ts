/**
 * Analytics Module Types
 * 
 * Defines all TypeScript interfaces and types used across the analytics module.
 * Includes state shapes, API responses, and component props.
 */

// Analytics State Management Types
export interface AnalyticsState {
  reports: AnalyticsReport[]
  currentReport: AnalyticsReport | null
  metrics: AnalyticsMetrics
  loading: boolean
  error: string | null
  generating: boolean
}

// Core Analytics Types
export interface AnalyticsReport {
  id: string
  name: string
  description?: string
  type: ReportType
  dateRange: DateRange
  data: ReportData
  status: ReportStatus
  createdAt: Date
  updatedAt?: Date
  createdBy: string
}

export interface AnalyticsMetrics {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  averageSessionDuration: number
  retentionRate: number
  conversionRate: number
  topFeatures: FeatureUsage[]
  userActivity: ActivityData[]
}

export interface ReportData {
  chartData: ChartDataPoint[]
  summary: ReportSummary
  insights: string[]
  recommendations: string[]
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
  category?: string
}

export interface ReportSummary {
  totalValue: number
  change: number
  changePercent: number
  period: string
}

export interface FeatureUsage {
  feature: string
  usage: number
  changePercent: number
}

export interface ActivityData {
  date: string
  sessions: number
  users: number
  duration: number
}

export interface DateRange {
  startDate: string
  endDate: string
}

// Enums
export enum ReportType {
  USER_ENGAGEMENT = 'user_engagement',
  FEATURE_USAGE = 'feature_usage',
  PERFORMANCE = 'performance',
  RETENTION = 'retention',
  CONVERSION = 'conversion',
  CUSTOM = 'custom'
}

export enum ReportStatus {
  GENERATING = 'generating',
  READY = 'ready',
  ERROR = 'error',
  EXPIRED = 'expired'
}

// Report Creation Types
export interface CreateReportRequest {
  name: string
  description?: string
  type: ReportType
  dateRange: DateRange
  filters?: AnalyticsFilters
}

// Analytics Filters
export interface AnalyticsFilters {
  userSegment?: string
  feature?: string
  platform?: string
  version?: string
}

// Component Props Types
export interface AnalyticsCardProps {
  report: AnalyticsReport
  onView?: (reportId: string) => void
  onDelete?: (reportId: string) => void
  onRefresh?: (reportId: string) => void
  className?: string
}

export interface MetricsCardProps {
  metrics: AnalyticsMetrics
  className?: string
}

// Hook Return Types
export interface UseAnalyticsReturn {
  reports: AnalyticsReport[]
  currentReport: AnalyticsReport | null
  metrics: AnalyticsMetrics
  loading: boolean
  error: string | null
  generating: boolean
  createReport: (data: CreateReportRequest) => Promise<void>
  refreshReport: (reportId: string) => Promise<void>
  deleteReport: (reportId: string) => Promise<void>
  refreshMetrics: () => Promise<void>
  refreshReports: () => Promise<void>
}