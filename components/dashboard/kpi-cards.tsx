"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Users, DollarSign, MapPin } from "lucide-react"

interface KPICardsProps {
  totalTrips: number
  totalPassengers: number
  totalRevenue: number
  avgFare: number
  avgDistance: number
  totalDistance: number
}

function useFormattedNumber(num: number, decimals: number = 0): string {
  const [formatted, setFormatted] = useState(num.toFixed(decimals))
  useEffect(() => {
    if (decimals > 0) {
      setFormatted(num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }))
    } else {
      setFormatted(Math.round(num).toLocaleString("en-US"))
    }
  }, [num, decimals])
  return formatted
}

export function KPICards({
  totalTrips,
  totalPassengers,
  totalRevenue,
  avgFare,
  avgDistance,
  totalDistance
}: KPICardsProps) {
  const formattedTrips = useFormattedNumber(totalTrips)
  const formattedPassengers = useFormattedNumber(totalPassengers)
  const formattedRevenue = useFormattedNumber(totalRevenue, 2)
  const formattedDistance = useFormattedNumber(totalDistance, 2)

  const kpis = [
    {
      title: "Total Viajes",
      value: formattedTrips,
      subtitle: `${useFormattedNumber(avgDistance, 2)} mi promedio`,
      icon: Car,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      valueColor: "text-emerald-700"
    },
    {
      title: "Total Pasajeros",
      value: formattedPassengers,
      subtitle: `${(totalPassengers / (totalTrips || 1)).toFixed(1)} por viaje`,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      valueColor: "text-green-700"
    },
    {
      title: "Ingresos Totales",
      value: `$${formattedRevenue}`,
      subtitle: `$${avgFare.toFixed(2)} tarifa promedio`,
      icon: DollarSign,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-700",
      valueColor: "text-teal-700"
    },
    {
      title: "Distancia Total",
      value: `${formattedDistance} mi`,
      subtitle: "Millas recorridas",
      icon: MapPin,
      iconBg: "bg-lime-100",
      iconColor: "text-lime-700",
      valueColor: "text-lime-700"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border/50 hover:border-primary/30 transition-colors shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{kpi.title}</span>
                <span className={`text-3xl font-bold ${kpi.valueColor}`}>{kpi.value}</span>
                <span className="text-xs text-muted-foreground">{kpi.subtitle}</span>
              </div>
              <div className={`p-2 rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
