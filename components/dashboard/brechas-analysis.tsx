"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MunicipioData, DepartamentoStats, getDepartamentoColor } from "@/lib/types"
import { AlertTriangle, AlertCircle, CheckCircle2, TrendingUp, Wifi, WifiOff, Target, Lightbulb } from "lucide-react"

interface BrechasAnalysisProps {
  data: MunicipioData[]
  departamentoStats: DepartamentoStats[]
}

interface MunicipioPriorizado {
  municipio: string
  departamento: string
  pobreza: number
  acceso_internet: number
  empleo_tech: number
  indiceBrechaDigital: number
  prioridad: 'critica' | 'alta' | 'media' | 'baja'
}

export function BrechasAnalysis({ data, departamentoStats }: BrechasAnalysisProps) {
  
  // Calcular indice de brecha digital para cada municipio
  // Formula: (Pobreza * 0.4) + ((100 - Internet) * 0.4) + (Falta de Tech relativa * 0.2)
  const municipiosPriorizados = useMemo(() => {
    const maxEmpleoTech = Math.max(...data.map(d => d.empleo_tech), 1)
    
    return data.map(m => {
      // Normalizar empleo tech (invertido: menos empleo = mas brecha)
      const faltaEmpleoTech = 100 - (m.empleo_tech / maxEmpleoTech * 100)
      
      // Indice de brecha digital (0-100, donde 100 es maxima brecha)
      const indiceBrechaDigital = 
        (m.pobreza * 0.4) + 
        ((100 - m.acceso_internet) * 0.4) + 
        (faltaEmpleoTech * 0.2)
      
      let prioridad: 'critica' | 'alta' | 'media' | 'baja'
      if (indiceBrechaDigital >= 70) prioridad = 'critica'
      else if (indiceBrechaDigital >= 50) prioridad = 'alta'
      else if (indiceBrechaDigital >= 30) prioridad = 'media'
      else prioridad = 'baja'
      
      return {
        ...m,
        indiceBrechaDigital: Number(indiceBrechaDigital.toFixed(2)),
        prioridad
      }
    }).sort((a, b) => b.indiceBrechaDigital - a.indiceBrechaDigital) as MunicipioPriorizado[]
  }, [data])

  // Estadisticas de prioridad
  const prioridadStats = useMemo(() => {
    const criticos = municipiosPriorizados.filter(m => m.prioridad === 'critica')
    const altos = municipiosPriorizados.filter(m => m.prioridad === 'alta')
    const medios = municipiosPriorizados.filter(m => m.prioridad === 'media')
    const bajos = municipiosPriorizados.filter(m => m.prioridad === 'baja')
    
    return { criticos, altos, medios, bajos }
  }, [municipiosPriorizados])

  // Top 10 municipios mas vulnerables
  const top10Vulnerables = municipiosPriorizados.slice(0, 10)

  // Departamentos con mas municipios criticos
  const departamentosCriticos = useMemo(() => {
    const counts: Record<string, number> = {}
    prioridadStats.criticos.forEach(m => {
      counts[m.departamento] = (counts[m.departamento] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [prioridadStats.criticos])

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-700 border-red-200'
      case 'alta': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'baja': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return <AlertTriangle className="h-4 w-4" />
      case 'alta': return <AlertCircle className="h-4 w-4" />
      case 'media': return <TrendingUp className="h-4 w-4" />
      case 'baja': return <CheckCircle2 className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Prioridades */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Critica</span>
            </div>
            <p className="text-3xl font-bold text-red-700">{prioridadStats.criticos.length}</p>
            <p className="text-xs text-red-600">Municipios requieren intervencion urgente</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Alta</span>
            </div>
            <p className="text-3xl font-bold text-amber-700">{prioridadStats.altos.length}</p>
            <p className="text-xs text-amber-600">Municipios con brecha significativa</p>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Media</span>
            </div>
            <p className="text-3xl font-bold text-yellow-700">{prioridadStats.medios.length}</p>
            <p className="text-xs text-yellow-600">Municipios en desarrollo</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Baja</span>
            </div>
            <p className="text-3xl font-bold text-emerald-700">{prioridadStats.bajos.length}</p>
            <p className="text-xs text-emerald-600">Municipios con buen desarrollo digital</p>
          </CardContent>
        </Card>
      </div>

      {/* Modelo de Priorizacion */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            Modelo de Priorizacion para Inversion MinTIC
          </CardTitle>
          <CardDescription>
            Indice de Brecha Digital = (Pobreza x 0.4) + (Falta de Internet x 0.4) + (Falta de Empleos Tech x 0.2)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 mb-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Criterios de Clasificacion:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><span className="text-red-600 font-medium">Critica (70-100):</span> Intervencion inmediata requerida</li>
                  <li><span className="text-amber-600 font-medium">Alta (50-69):</span> Prioridad en proximos programas</li>
                  <li><span className="text-yellow-600 font-medium">Media (30-49):</span> Monitoreo y apoyo gradual</li>
                  <li><span className="text-emerald-600 font-medium">Baja (0-29):</span> Mantenimiento de conectividad</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Municipios Vulnerables */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-red-500" />
              Top 10 Municipios Mas Vulnerables
            </CardTitle>
            <CardDescription>
              Municipios con mayor indice de brecha digital que requieren intervencion prioritaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top10Vulnerables.map((m, index) => (
                <div 
                  key={`${m.municipio}-${m.departamento}`}
                  className="p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{m.municipio}</p>
                        <p className="text-xs text-muted-foreground">{m.departamento}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getPrioridadColor(m.prioridad)} gap-1`}>
                      {getPrioridadIcon(m.prioridad)}
                      {m.prioridad.charAt(0).toUpperCase() + m.prioridad.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Indice de Brecha Digital</span>
                        <span className="font-medium">{m.indiceBrechaDigital}%</span>
                      </div>
                      <Progress 
                        value={m.indiceBrechaDigital} 
                        className="h-2"
                        style={{ 
                          // @ts-ignore
                          '--progress-background': m.prioridad === 'critica' ? '#dc2626' : 
                            m.prioridad === 'alta' ? '#d97706' : '#eab308'
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-1.5 rounded bg-red-50">
                        <p className="text-red-600 font-medium">{m.pobreza.toFixed(2)}%</p>
                        <p className="text-red-500">Pobreza</p>
                      </div>
                      <div className="text-center p-1.5 rounded bg-cyan-50">
                        <p className="text-cyan-600 font-medium">{m.acceso_internet.toFixed(2)}%</p>
                        <p className="text-cyan-500">Internet</p>
                      </div>
                      <div className="text-center p-1.5 rounded bg-emerald-50">
                        <p className="text-emerald-600 font-medium">{m.empleo_tech}</p>
                        <p className="text-emerald-500">Tech</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Departamentos con mas municipios criticos */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Departamentos con Mayor Urgencia
            </CardTitle>
            <CardDescription>
              Departamentos con mas municipios en estado critico o alto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departamentosCriticos.length > 0 ? (
              <div className="space-y-4">
                {departamentosCriticos.map(([dept, count], index) => {
                  const deptStats = departamentoStats.find(d => d.departamento === dept)
                  const deptColor = getDepartamentoColor(dept)
                  
                  return (
                    <div 
                      key={dept}
                      className="p-4 rounded-lg border border-border/50"
                      style={{ borderLeftColor: deptColor, borderLeftWidth: '4px' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold" style={{ color: deptColor }}>
                            #{index + 1}
                          </span>
                          <span className="font-semibold">{dept}</span>
                        </div>
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {count} criticos
                        </Badge>
                      </div>
                      
                      {deptStats && (
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center p-2 rounded bg-secondary/50">
                            <p className="font-bold text-foreground">{deptStats.municipios_count}</p>
                            <p className="text-xs text-muted-foreground">Municipios</p>
                          </div>
                          <div className="text-center p-2 rounded bg-red-50">
                            <p className="font-bold text-red-600">{deptStats.promedio_pobreza.toFixed(2)}%</p>
                            <p className="text-xs text-red-500">Prom. Pobreza</p>
                          </div>
                          <div className="text-center p-2 rounded bg-cyan-50">
                            <p className="font-bold text-cyan-600">{deptStats.promedio_internet.toFixed(2)}%</p>
                            <p className="text-xs text-cyan-500">Prom. Internet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                <p>No hay municipios en estado critico</p>
              </div>
            )}

            {/* Recomendaciones */}
            <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recomendaciones para Politica Publica
              </h4>
              <ul className="text-sm text-emerald-700 space-y-1 list-disc list-inside">
                <li>Priorizar inversiones en conectividad en municipios con indice mayor a 70</li>
                <li>Implementar programas de capacitacion digital en zonas de alta pobreza</li>
                <li>Fomentar teletrabajo y empleos tech en regiones con baja oportunidad laboral</li>
                <li>Establecer alianzas publico-privadas para expandir infraestructura de internet</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
