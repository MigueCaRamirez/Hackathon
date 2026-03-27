"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DepartamentoStats, getDepartamentoColor } from "@/lib/types"
import { MapPin, TrendingUp, TrendingDown, Wifi, Briefcase, Building2, AlertTriangle } from "lucide-react"

// Colores fijos para metricas - consistentes con las graficas
const METRIC_COLORS = {
  pobreza: '#dc2626',     // Rojo - indicador negativo
  internet: '#0891b2',    // Cyan/Teal - indicador positivo
  tech: '#059669'         // Verde esmeralda - empleos tech
}

interface RegionalStatsProps {
  departamentoStats: DepartamentoStats[]
  selectedDepartamento: string | null
  onSelectDepartamento: (dept: string | null) => void
}

export function RegionalStats({
  departamentoStats,
  selectedDepartamento,
  onSelectDepartamento,
}: RegionalStatsProps) {
  const totalMunicipios = departamentoStats.reduce((acc, d) => acc + d.municipios_count, 0)
  const totalEmpleoTech = departamentoStats.reduce((acc, d) => acc + d.total_empleo_tech, 0)

  const getStatComparison = (value: number, type: 'pobreza' | 'internet') => {
    const avg = departamentoStats.reduce((acc, d) => 
      acc + (type === 'pobreza' ? d.promedio_pobreza : d.promedio_internet), 0
    ) / departamentoStats.length

    if (type === 'pobreza') {
      return value < avg ? 'better' : value > avg ? 'worse' : 'equal'
    }
    return value > avg ? 'better' : value < avg ? 'worse' : 'equal'
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-600" />
          Estadisticas por Departamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departamentoStats.map((dept) => {
            const isSelected = selectedDepartamento === dept.departamento
            const pobrezaStatus = getStatComparison(dept.promedio_pobreza, 'pobreza')
            const internetStatus = getStatComparison(dept.promedio_internet, 'internet')
            const deptColor = getDepartamentoColor(dept.departamento)
            const percentage = ((dept.municipios_count / totalMunicipios) * 100).toFixed(0)
            const techPercentage = ((dept.total_empleo_tech / totalEmpleoTech) * 100).toFixed(0)

            return (
              <button
                key={dept.departamento}
                onClick={() => onSelectDepartamento(isSelected ? null : dept.departamento)}
                className={`
                  p-4 rounded-xl text-left transition-all
                  ${isSelected 
                    ? 'ring-2 shadow-md' 
                    : 'hover:bg-secondary/50 border border-border/50'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? `${deptColor}15` : undefined,
                  borderColor: isSelected ? deptColor : undefined,
                  ringColor: deptColor
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: deptColor }}
                    />
                    <span className="font-semibold" style={{ color: isSelected ? deptColor : undefined }}>
                      {dept.departamento}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{dept.municipios_count} municipios ({percentage}%)</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Pobreza */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" style={{ color: METRIC_COLORS.pobreza }} />
                      <span className="text-xs text-muted-foreground">Pobreza</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: METRIC_COLORS.pobreza }}>
                      {dept.promedio_pobreza.toFixed(2)}%
                    </p>
                  </div>

                  {/* Internet */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" style={{ color: METRIC_COLORS.internet }} />
                      <span className="text-xs text-muted-foreground">Internet</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: METRIC_COLORS.internet }}>
                      {dept.promedio_internet.toFixed(2)}%
                    </p>
                  </div>

                  {/* Tech Jobs */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Tech</span>
                    </div>
                    <p className="text-lg font-bold text-teal-600">
                      {dept.total_empleo_tech.toLocaleString('es-CO')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {techPercentage}% del total
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: deptColor
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-600" />
              <span>Mejor que el promedio</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-amber-600" />
              <span>Por debajo del promedio</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
