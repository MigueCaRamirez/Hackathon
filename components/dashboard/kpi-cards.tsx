"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Wifi, Briefcase, TrendingDown } from "lucide-react"

interface KPICardsProps {
  totalMunicipios: number
  totalDepartamentos: number
  promedioPobreza: number
  promedioInternet: number
  totalEmpleoTech: number
}

// Formatted on the client only to avoid SSR/client locale mismatch
function useFormattedNumber(num: number): string {
  const [formatted, setFormatted] = useState(String(Math.round(num)))
  useEffect(() => {
    setFormatted(Math.round(num).toLocaleString("es-CO"))
  }, [num])
  return formatted
}

export function KPICards({
  totalMunicipios,
  totalDepartamentos,
  promedioPobreza,
  promedioInternet,
  totalEmpleoTech
}: KPICardsProps) {
  const formattedEmpleoTech = useFormattedNumber(totalEmpleoTech)
  const kpis = [
    {
      title: "Municipios Analizados",
      value: totalMunicipios,
      subtitle: `${totalDepartamentos} departamentos`,
      icon: Users,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      valueColor: "text-emerald-700"
    },
    {
      title: "Promedio Pobreza",
      value: `${promedioPobreza}%`,
      subtitle: "Indice de pobreza regional",
      icon: TrendingDown,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      valueColor: "text-green-700"
    },
    {
      title: "Acceso a Internet",
      value: `${promedioInternet}%`,
      subtitle: "Cobertura promedio",
      icon: Wifi,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-700",
      valueColor: "text-teal-700"
    },
    {
      title: "Empleos Tech",
      value: formattedEmpleoTech,
      subtitle: "Total en la region",
      icon: Briefcase,
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
