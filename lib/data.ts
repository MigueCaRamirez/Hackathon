import { TaxiTripData, VendorStats, PaymentTypeStats, HourlyStats, VENDOR_NAMES, PAYMENT_TYPE_NAMES } from './types'

// Dataset de ejemplo vacio - se carga desde archivo
export const defaultTaxiData: TaxiTripData[] = []

export function getVendors(data: TaxiTripData[]): number[] {
  return [...new Set(data.map(t => t.VendorID))].sort((a, b) => a - b)
}

export function getPaymentTypes(data: TaxiTripData[]): number[] {
  return [...new Set(data.map(t => t.payment_type))].sort((a, b) => a - b)
}

export function getVendorStats(data: TaxiTripData[]): VendorStats[] {
  const vendors = getVendors(data)
  
  return vendors.map(vendorID => {
    const trips = data.filter(t => t.VendorID === vendorID)
    const totalTrips = trips.length
    
    if (totalTrips === 0) {
      return {
        vendorID,
        vendorName: VENDOR_NAMES[vendorID] || `Vendor ${vendorID}`,
        total_trips: 0,
        total_passengers: 0,
        total_distance: 0,
        total_revenue: 0,
        avg_fare: 0,
        avg_tip: 0,
        avg_distance: 0
      }
    }
    
    const total_passengers = trips.reduce((acc, t) => acc + t.passenger_count, 0)
    const total_distance = trips.reduce((acc, t) => acc + t.trip_distance, 0)
    const total_revenue = trips.reduce((acc, t) => acc + t.total_amount, 0)
    const total_tips = trips.reduce((acc, t) => acc + t.tip_amount, 0)
    
    return {
      vendorID,
      vendorName: VENDOR_NAMES[vendorID] || `Vendor ${vendorID}`,
      total_trips: totalTrips,
      total_passengers,
      total_distance: Number(total_distance.toFixed(2)),
      total_revenue: Number(total_revenue.toFixed(2)),
      avg_fare: Number((total_revenue / totalTrips).toFixed(2)),
      avg_tip: Number((total_tips / totalTrips).toFixed(2)),
      avg_distance: Number((total_distance / totalTrips).toFixed(2))
    }
  })
}

export function getPaymentTypeStats(data: TaxiTripData[]): PaymentTypeStats[] {
  const paymentTypes = getPaymentTypes(data)
  const totalTrips = data.length
  
  return paymentTypes.map(payment_type => {
    const trips = data.filter(t => t.payment_type === payment_type)
    const count = trips.length
    
    if (count === 0) {
      return {
        payment_type,
        payment_name: PAYMENT_TYPE_NAMES[payment_type] || `Tipo ${payment_type}`,
        total_trips: 0,
        total_revenue: 0,
        avg_fare: 0,
        percentage: 0
      }
    }
    
    const total_revenue = trips.reduce((acc, t) => acc + t.total_amount, 0)
    
    return {
      payment_type,
      payment_name: PAYMENT_TYPE_NAMES[payment_type] || `Tipo ${payment_type}`,
      total_trips: count,
      total_revenue: Number(total_revenue.toFixed(2)),
      avg_fare: Number((total_revenue / count).toFixed(2)),
      percentage: Number(((count / totalTrips) * 100).toFixed(2))
    }
  })
}

export function getHourlyStats(data: TaxiTripData[]): HourlyStats[] {
  const hourlyData: Record<number, TaxiTripData[]> = {}
  
  // Inicializar todas las horas
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = []
  }
  
  // Agrupar por hora de pickup
  data.forEach(trip => {
    try {
      // Formato esperado: "dd/mm/yyyy HH:MM:SS"
      const timePart = trip.tpep_pickup_datetime.split(' ')[1]
      if (timePart) {
        const hour = parseInt(timePart.split(':')[0], 10)
        if (hour >= 0 && hour < 24) {
          hourlyData[hour].push(trip)
        }
      }
    } catch {
      // Ignorar errores de parsing
    }
  })
  
  return Object.entries(hourlyData).map(([hour, trips]) => {
    const h = parseInt(hour, 10)
    const count = trips.length
    
    if (count === 0) {
      return { hour: h, trips: 0, avg_fare: 0, avg_distance: 0 }
    }
    
    const total_fare = trips.reduce((acc, t) => acc + t.total_amount, 0)
    const total_distance = trips.reduce((acc, t) => acc + t.trip_distance, 0)
    
    return {
      hour: h,
      trips: count,
      avg_fare: Number((total_fare / count).toFixed(2)),
      avg_distance: Number((total_distance / count).toFixed(2))
    }
  })
}

export function getGeneralStats(data: TaxiTripData[]) {
  const totalTrips = data.length
  
  if (totalTrips === 0) {
    return {
      totalTrips: 0,
      totalPassengers: 0,
      totalDistance: 0,
      totalRevenue: 0,
      avgFare: 0,
      avgTip: 0,
      avgDistance: 0,
      avgPassengers: 0
    }
  }
  
  const totalPassengers = data.reduce((acc, t) => acc + t.passenger_count, 0)
  const totalDistance = data.reduce((acc, t) => acc + t.trip_distance, 0)
  const totalRevenue = data.reduce((acc, t) => acc + t.total_amount, 0)
  const totalTips = data.reduce((acc, t) => acc + t.tip_amount, 0)
  
  return {
    totalTrips,
    totalPassengers,
    totalDistance: Number(totalDistance.toFixed(2)),
    totalRevenue: Number(totalRevenue.toFixed(2)),
    avgFare: Number((totalRevenue / totalTrips).toFixed(2)),
    avgTip: Number((totalTips / totalTrips).toFixed(2)),
    avgDistance: Number((totalDistance / totalTrips).toFixed(2)),
    avgPassengers: Number((totalPassengers / totalTrips).toFixed(2))
  }
}

export function filterTrips(
  data: TaxiTripData[],
  vendorID: number | null,
  paymentType: number | null,
  searchTerm: string
): TaxiTripData[] {
  return data.filter(t => {
    const matchVendor = !vendorID || t.VendorID === vendorID
    const matchPayment = !paymentType || t.payment_type === paymentType
    const matchSearch = !searchTerm || 
      t.tpep_pickup_datetime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tpep_dropoff_datetime.toLowerCase().includes(searchTerm.toLowerCase())
    return matchVendor && matchPayment && matchSearch
  })
}

export function sortTrips(
  data: TaxiTripData[],
  sortBy: keyof TaxiTripData,
  sortOrder: 'asc' | 'desc'
): TaxiTripData[] {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number)
  })
}
