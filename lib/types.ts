export interface TaxiTripData {
  VendorID: number
  tpep_pickup_datetime: string
  tpep_dropoff_datetime: string
  passenger_count: number
  trip_distance: number
  pickup_longitude: number
  pickup_latitude: number
  RateCodeID: number
  store_and_fwd_flag: string
  dropoff_longitude: number
  dropoff_latitude: number
  payment_type: number
  fare_amount: number
  extra: number
  mta_tax: number
  tip_amount: number
  tolls_amount: number
  improvement_surcharge: number
  total_amount: number
}

export interface VendorStats {
  vendorID: number
  vendorName: string
  total_trips: number
  total_passengers: number
  total_distance: number
  total_revenue: number
  avg_fare: number
  avg_tip: number
  avg_distance: number
}

export interface PaymentTypeStats {
  payment_type: number
  payment_name: string
  total_trips: number
  total_revenue: number
  avg_fare: number
  percentage: number
}

export interface HourlyStats {
  hour: number
  trips: number
  avg_fare: number
  avg_distance: number
}

export interface FilterState {
  vendorID: number | null
  paymentType: number | null
  searchTerm: string
  sortBy: keyof TaxiTripData
  sortOrder: 'asc' | 'desc'
}

// Nombres de proveedores
export const VENDOR_NAMES: Record<number, string> = {
  1: 'Creative Mobile Technologies',
  2: 'VeriFone Inc.'
}

// Nombres de tipos de pago
export const PAYMENT_TYPE_NAMES: Record<number, string> = {
  1: 'Tarjeta de Credito',
  2: 'Efectivo',
  3: 'Sin Cargo',
  4: 'Disputa',
  5: 'Desconocido',
  6: 'Viaje Anulado'
}

// Nombres de Rate Codes
export const RATE_CODE_NAMES: Record<number, string> = {
  1: 'Tarifa Estandar',
  2: 'JFK',
  3: 'Newark',
  4: 'Nassau o Westchester',
  5: 'Tarifa Negociada',
  6: 'Viaje Grupal'
}

// Paleta de colores para vendors y payment types
const COLOR_PALETTE = [
  '#059669', // Verde esmeralda oscuro
  '#10b981', // Verde esmeralda medio
  '#14b8a6', // Teal
  '#0d9488', // Teal oscuro
  '#22c55e', // Verde
  '#16a34a', // Verde oscuro
  '#84cc16', // Lima
  '#65a30d', // Lima oscuro
  '#06b6d4', // Cyan
  '#0891b2', // Cyan oscuro
]

// Colores para vendors
export const VENDOR_COLORS: Record<number, string> = {
  1: '#059669',
  2: '#0891b2'
}

// Colores para tipos de pago
export const PAYMENT_TYPE_COLORS: Record<number, string> = {
  1: '#059669', // Tarjeta - Verde
  2: '#0891b2', // Efectivo - Cyan
  3: '#84cc16', // Sin cargo - Lima
  4: '#dc2626', // Disputa - Rojo
  5: '#6b7280', // Desconocido - Gris
  6: '#f59e0b'  // Anulado - Amber
}

export function getVendorColor(vendorID: number): string {
  return VENDOR_COLORS[vendorID] || COLOR_PALETTE[vendorID % COLOR_PALETTE.length]
}

export function getPaymentTypeColor(paymentType: number): string {
  return PAYMENT_TYPE_COLORS[paymentType] || COLOR_PALETTE[paymentType % COLOR_PALETTE.length]
}
