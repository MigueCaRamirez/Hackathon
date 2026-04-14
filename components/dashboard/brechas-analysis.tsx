"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TaxiTripData, PaymentTypeStats, HourlyStats, getPaymentTypeColor, PAYMENT_TYPE_NAMES } from "@/lib/types"
import { Clock, DollarSign, TrendingUp, TrendingDown, MapPin, Users, Lightbulb, Star, AlertTriangle } from "lucide-react"

interface TripAnalysisProps {
  data: TaxiTripData[]
  paymentStats: PaymentTypeStats[]
  hourlyStats: HourlyStats[]
}

interface TopTrip {
  pickup_datetime: string
  distance: number
  fare: number
  tip: number
  passengers: number
  payment_type: number
}

export function BrechasAnalysis({ data, paymentStats, hourlyStats }: TripAnalysisProps) {
  
  // Analisis de viajes
  const tripAnalysis = useMemo(() => {
    if (data.length === 0) {
      return {
        topFareTrips: [],
        topDistanceTrips: [],
        topTipTrips: [],
        avgTipByPayment: [],
        peakHours: [],
        lowHours: []
      }
    }

    // Top 5 viajes por tarifa
    const topFareTrips: TopTrip[] = [...data]
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 5)
      .map(t => ({
        pickup_datetime: t.tpep_pickup_datetime,
        distance: t.trip_distance,
        fare: t.total_amount,
        tip: t.tip_amount,
        passengers: t.passenger_count,
        payment_type: t.payment_type
      }))

    // Top 5 viajes por distancia
    const topDistanceTrips: TopTrip[] = [...data]
      .sort((a, b) => b.trip_distance - a.trip_distance)
      .slice(0, 5)
      .map(t => ({
        pickup_datetime: t.tpep_pickup_datetime,
        distance: t.trip_distance,
        fare: t.total_amount,
        tip: t.tip_amount,
        passengers: t.passenger_count,
        payment_type: t.payment_type
      }))

    // Top 5 viajes por propina
    const topTipTrips: TopTrip[] = [...data]
      .sort((a, b) => b.tip_amount - a.tip_amount)
      .slice(0, 5)
      .map(t => ({
        pickup_datetime: t.tpep_pickup_datetime,
        distance: t.trip_distance,
        fare: t.total_amount,
        tip: t.tip_amount,
        passengers: t.passenger_count,
        payment_type: t.payment_type
      }))

    // Propina promedio por tipo de pago
    const tipByPayment: Record<number, { total: number; count: number }> = {}
    data.forEach(t => {
      if (!tipByPayment[t.payment_type]) {
        tipByPayment[t.payment_type] = { total: 0, count: 0 }
      }
      tipByPayment[t.payment_type].total += t.tip_amount
      tipByPayment[t.payment_type].count++
    })
    const avgTipByPayment = Object.entries(tipByPayment)
      .map(([type, { total, count }]) => ({
        payment_type: parseInt(type),
        avg_tip: count > 0 ? total / count : 0
      }))
      .sort((a, b) => b.avg_tip - a.avg_tip)

    // Horas pico y bajas
    const sortedHours = [...hourlyStats].sort((a, b) => b.trips - a.trips)
    const peakHours = sortedHours.slice(0, 3)
    const lowHours = sortedHours.slice(-3).reverse()

    return {
      topFareTrips,
      topDistanceTrips,
      topTipTrips,
      avgTipByPayment,
      peakHours,
      lowHours
    }
  }, [data, hourlyStats])

  // Estadisticas generales
  const generalStats = useMemo(() => {
    if (data.length === 0) return null

    const avgPassengers = data.reduce((acc, t) => acc + t.passenger_count, 0) / data.length
    const avgDistance = data.reduce((acc, t) => acc + t.trip_distance, 0) / data.length
    const avgFare = data.reduce((acc, t) => acc + t.total_amount, 0) / data.length
    const avgTip = data.reduce((acc, t) => acc + t.tip_amount, 0) / data.length
    const tipRate = avgTip / (avgFare - avgTip) * 100

    return { avgPassengers, avgDistance, avgFare, avgTip, tipRate }
  }, [data])

  if (data.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="py-12 text-center text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
          <p>Cargue un dataset para ver el analisis de viajes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      {generalStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Pasajeros/Viaje</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700">{generalStats.avgPassengers.toFixed(1)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-teal-200 bg-teal-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">Distancia Prom.</span>
              </div>
              <p className="text-3xl font-bold text-teal-700">{generalStats.avgDistance.toFixed(2)} mi</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Tarifa Prom.</span>
              </div>
              <p className="text-3xl font-bold text-green-700">${generalStats.avgFare.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-lime-200 bg-lime-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-lime-600" />
                <span className="text-sm font-medium text-lime-800">Propina Prom.</span>
              </div>
              <p className="text-3xl font-bold text-lime-700">${generalStats.avgTip.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-cyan-200 bg-cyan-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-800">% Propina</span>
              </div>
              <p className="text-3xl font-bold text-cyan-700">{generalStats.tipRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Horas Pico y Bajas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Horas Pico
            </CardTitle>
            <CardDescription>
              Horas con mayor demanda de viajes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tripAnalysis.peakHours.map((h, index) => (
                <div 
                  key={h.hour}
                  className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-emerald-700">#{index + 1}</span>
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">{h.hour.toString().padStart(2, '0')}:00 - {(h.hour + 1).toString().padStart(2, '0')}:00</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {h.trips.toLocaleString()} viajes
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-1.5 rounded bg-white/80">
                      <p className="font-semibold text-teal-600">${h.avg_fare.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Tarifa Prom.</p>
                    </div>
                    <div className="text-center p-1.5 rounded bg-white/80">
                      <p className="font-semibold text-lime-600">{h.avg_distance.toFixed(2)} mi</p>
                      <p className="text-xs text-muted-foreground">Distancia Prom.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-600" />
              Horas Bajas
            </CardTitle>
            <CardDescription>
              Horas con menor demanda de viajes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tripAnalysis.lowHours.map((h, index) => (
                <div 
                  key={h.hour}
                  className="p-3 rounded-lg border border-amber-200 bg-amber-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-amber-700">#{index + 1}</span>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">{h.hour.toString().padStart(2, '0')}:00 - {(h.hour + 1).toString().padStart(2, '0')}:00</span>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      {h.trips.toLocaleString()} viajes
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-1.5 rounded bg-white/80">
                      <p className="font-semibold text-teal-600">${h.avg_fare.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Tarifa Prom.</p>
                    </div>
                    <div className="text-center p-1.5 rounded bg-white/80">
                      <p className="font-semibold text-lime-600">{h.avg_distance.toFixed(2)} mi</p>
                      <p className="text-xs text-muted-foreground">Distancia Prom.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Viajes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top por Tarifa */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Top 5 por Tarifa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tripAnalysis.topFareTrips.map((trip, index) => (
                <div key={index} className="p-2 rounded border border-border/50 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-700">${trip.fare.toFixed(2)}</span>
                    <Badge variant="outline" className="text-xs">
                      {trip.distance.toFixed(1)} mi
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{trip.pickup_datetime}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top por Distancia */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              Top 5 por Distancia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tripAnalysis.topDistanceTrips.map((trip, index) => (
                <div key={index} className="p-2 rounded border border-border/50 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-teal-700">{trip.distance.toFixed(2)} mi</span>
                    <Badge variant="outline" className="text-xs">
                      ${trip.fare.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{trip.pickup_datetime}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top por Propina */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-lime-600" />
              Top 5 por Propina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tripAnalysis.topTipTrips.map((trip, index) => (
                <div key={index} className="p-2 rounded border border-border/50 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lime-700">${trip.tip.toFixed(2)}</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        color: getPaymentTypeColor(trip.payment_type),
                        borderColor: getPaymentTypeColor(trip.payment_type)
                      }}
                    >
                      {PAYMENT_TYPE_NAMES[trip.payment_type] || `Tipo ${trip.payment_type}`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{trip.pickup_datetime}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Propina por Tipo de Pago */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Propina Promedio por Tipo de Pago
          </CardTitle>
          <CardDescription>
            Analisis de propinas segun metodo de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {tripAnalysis.avgTipByPayment.map(({ payment_type, avg_tip }) => (
              <div 
                key={payment_type}
                className="p-3 rounded-lg border text-center"
                style={{ 
                  borderColor: getPaymentTypeColor(payment_type),
                  backgroundColor: `${getPaymentTypeColor(payment_type)}10`
                }}
              >
                <p className="text-2xl font-bold" style={{ color: getPaymentTypeColor(payment_type) }}>
                  ${avg_tip.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {PAYMENT_TYPE_NAMES[payment_type] || `Tipo ${payment_type}`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>Insight:</strong> Las propinas son significativamente mayores en pagos con tarjeta de credito 
              comparado con efectivo, probablemente debido a la facilidad de agregar propina en terminales digitales.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
