/**
 * GeoMap Module Types
 * 
 * Defines all TypeScript interfaces and types used across the geomap module.
 * Includes state shapes, API responses, and component props.
 */

// GeoMap State Management Types
export interface GeoMapState {
  locations: MapLocation[]
  markers: MapMarker[]
  currentLocation: MapLocation | null
  mapRegion: MapRegion
  loading: boolean
  error: string | null
  tracking: boolean
}

// Core GeoMap Types
export interface MapLocation {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  address?: string
  category: LocationCategory
  createdAt: Date
  updatedAt?: Date
  createdBy: string
}

export interface MapMarker {
  id: string
  locationId: string
  title: string
  description?: string
  coordinate: {
    latitude: number
    longitude: number
  }
  markerType: MarkerType
  isVisible: boolean
}

export interface MapRegion {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

// Enums
export enum LocationCategory {
  POINT_OF_INTEREST = 'poi',
  OFFICE = 'office',
  HOME = 'home',
  RESTAURANT = 'restaurant',
  STORE = 'store',
  LANDMARK = 'landmark',
  OTHER = 'other'
}

export enum MarkerType {
  STANDARD = 'standard',
  CUSTOM = 'custom',
  USER = 'user',
  POINT_OF_INTEREST = 'poi'
}

// Location Creation Types
export interface CreateLocationRequest {
  name: string
  description?: string
  latitude: number
  longitude: number
  address?: string
  category: LocationCategory
}

export interface UpdateLocationRequest {
  locationId: string
  name?: string
  description?: string
  address?: string
  category?: LocationCategory
}

// Map Filters
export interface LocationFilters {
  category?: LocationCategory
  withinRadius?: {
    latitude: number
    longitude: number
    radiusKm: number
  }
  search?: string
}

// Component Props Types
export interface GeoMapCardProps {
  location: MapLocation
  onEdit?: (locationId: string) => void
  onDelete?: (locationId: string) => void
  onNavigate?: (location: MapLocation) => void
  className?: string
}

// Hook Return Types
export interface UseGeoMapReturn {
  locations: MapLocation[]
  markers: MapMarker[]
  currentLocation: MapLocation | null
  mapRegion: MapRegion
  loading: boolean
  error: string | null
  tracking: boolean
  createLocation: (data: CreateLocationRequest) => Promise<void>
  updateLocation: (data: UpdateLocationRequest) => Promise<void>
  deleteLocation: (locationId: string) => Promise<void>
  setMapRegion: (region: MapRegion) => void
  startTracking: () => void
  stopTracking: () => void
  refreshLocations: () => Promise<void>
}