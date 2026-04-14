"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VendorStats, getVendorColor, VENDOR_NAMES } from "@/lib/types"
import { Car, DollarSign, Users, MapPin, TrendingUp } from "lucide-react"

interface VendorStatsProps {
  vendorStats: VendorStats[]
  selectedVendor: number | null
  onSelectVendor: (vendor: number | null) => void
}

export function RegionalStats({
  vendorStats,
  selectedVendor,
  onSelectVendor,
}: VendorStatsProps) {
  const totalTrips = vendorStats.reduce((acc, v) => acc + v.total_trips, 0)
  const totalRevenue = vendorStats.reduce((acc, v) => acc + v.total_revenue, 0)

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Car className="h-5 w-5 text-emerald-600" />
          Estadisticas por Proveedor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vendorStats.map((vendor) => {
            const isSelected = selectedVendor === vendor.vendorID
            const vendorColor = getVendorColor(vendor.vendorID)
            const tripPercentage = ((vendor.total_trips / totalTrips) * 100).toFixed(1)
            const revenuePercentage = ((vendor.total_revenue / totalRevenue) * 100).toFixed(1)

            return (
              <button
                key={vendor.vendorID}
                onClick={() => onSelectVendor(isSelected ? null : vendor.vendorID)}
                className={`
                  p-4 rounded-xl text-left transition-all
                  ${isSelected 
                    ? 'ring-2 shadow-md' 
                    : 'hover:bg-secondary/50 border border-border/50'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? `${vendorColor}15` : undefined,
                  borderColor: isSelected ? vendorColor : undefined,
                  ringColor: vendorColor
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: vendorColor }}
                    />
                    <span className="font-semibold text-sm" style={{ color: isSelected ? vendorColor : undefined }}>
                      {vendor.vendorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Car className="h-3 w-3" />
                    <span>{vendor.total_trips.toLocaleString()} viajes ({tripPercentage}%)</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Ingresos */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-muted-foreground">Ingresos</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-700">
                      ${(vendor.total_revenue / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {revenuePercentage}% del total
                    </p>
                  </div>

                  {/* Tarifa Promedio */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-teal-600" />
                      <span className="text-xs text-muted-foreground">Tarifa Prom.</span>
                    </div>
                    <p className="text-lg font-bold text-teal-700">
                      ${vendor.avg_fare.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +${vendor.avg_tip.toFixed(2)} propina
                    </p>
                  </div>

                  {/* Distancia */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-lime-600" />
                      <span className="text-xs text-muted-foreground">Dist. Prom.</span>
                    </div>
                    <p className="text-lg font-bold text-lime-700">
                      {vendor.avg_distance.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      millas
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${tripPercentage}%`,
                      backgroundColor: vendorColor
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Summary */}
        {vendorStats.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{totalTrips.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Viajes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">${(totalRevenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">Total Ingresos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-700">
                  ${(totalRevenue / totalTrips || 0).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Tarifa Promedio</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-lime-700">
                  {(vendorStats.reduce((acc, v) => acc + v.total_distance, 0) / totalTrips || 0).toFixed(2)} mi
                </p>
                <p className="text-xs text-muted-foreground">Distancia Promedio</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
