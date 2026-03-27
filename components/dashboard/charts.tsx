"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"
import { DepartamentoStats, getDepartamentoColor, MunicipioData } from "@/lib/types"

interface ChartsProps {
  departamentoStats: DepartamentoStats[]
}

interface ScatterChartProps {
  data: MunicipioData[]
}

// Colores fijos para las metricas - contrastantes para pobreza vs internet
const METRIC_COLORS = {
  pobreza: '#dc2626',     // Rojo - indicador negativo
  internet: '#0891b2',    // Cyan/Teal - indicador positivo
  tech: '#059669'         // Verde esmeralda - empleos tech
}

export function BarChartPobreza({ departamentoStats }: ChartsProps) {
  const data = departamentoStats.map(d => ({
    name: d.departamento,
    pobreza: d.promedio_pobreza,
    internet: d.promedio_internet
  }))

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Pobreza vs Acceso a Internet</CardTitle>
        <CardDescription>Comparacion por departamento (%) - Cruce de Variables</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)}%`, 
                  name === 'pobreza' ? 'Pobreza' : 'Acceso Internet'
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: 'var(--foreground)' }}>
                    {value === 'pobreza' ? 'Pobreza' : 'Acceso Internet'}
                  </span>
                )}
              />
              <Bar dataKey="pobreza" fill={METRIC_COLORS.pobreza} radius={[4, 4, 0, 0]} name="pobreza" />
              <Bar dataKey="internet" fill={METRIC_COLORS.internet} radius={[4, 4, 0, 0]} name="internet" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: METRIC_COLORS.pobreza }} />
            <span className="text-muted-foreground">Pobreza (menor es mejor)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: METRIC_COLORS.internet }} />
            <span className="text-muted-foreground">Internet (mayor es mejor)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BarChartEmpleoTech({ departamentoStats }: ChartsProps) {
  const data = departamentoStats.map(d => ({
    name: d.departamento,
    empleos: d.total_empleo_tech,
    fill: getDepartamentoColor(d.departamento)
  })).sort((a, b) => b.empleos - a.empleos)

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Empleos Tech por Departamento</CardTitle>
        <CardDescription>Total de empleos en el sector tecnologico</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [value.toLocaleString(), 'Empleos Tech']}
              />
              <Bar dataKey="empleos" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChartMunicipios({ departamentoStats }: ChartsProps) {
  const data = departamentoStats.map(d => ({
    name: d.departamento,
    value: d.municipios_count,
    fill: getDepartamentoColor(d.departamento)
  }))

  const totalMunicipios = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribucion de Municipios</CardTitle>
        <CardDescription>Por departamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'var(--muted-foreground)' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value} municipios (${((value/totalMunicipios)*100).toFixed(1)}%)`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChartEmpleoTech({ departamentoStats }: ChartsProps) {
  const data = departamentoStats.map(d => ({
    name: d.departamento,
    value: d.total_empleo_tech,
    fill: getDepartamentoColor(d.departamento)
  }))

  const totalEmpleos = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribucion Empleos Tech</CardTitle>
        <CardDescription>Participacion por departamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'var(--muted-foreground)' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} empleos (${((value/totalEmpleos)*100).toFixed(1)}%)`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Grafico de dispersion para correlacion Pobreza vs Internet vs Empleo Tech
export function ScatterChartCorrelation({ data }: ScatterChartProps) {
  const scatterData = data.map(d => ({
    name: d.municipio,
    departamento: d.departamento,
    pobreza: d.pobreza,
    internet: d.acceso_internet,
    empleoTech: d.empleo_tech,
    fill: getDepartamentoColor(d.departamento)
  }))

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Correlacion: Pobreza vs Acceso a Internet</CardTitle>
        <CardDescription>
          Cada punto representa un municipio. Tamano = Empleos Tech. 
          Identifica clusteres de exclusion digital.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                type="number" 
                dataKey="pobreza" 
                name="Pobreza"
                unit="%"
                domain={[0, 100]}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                label={{ value: 'Indice de Pobreza (%)', position: 'bottom', offset: 0, fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                type="number" 
                dataKey="internet" 
                name="Internet"
                unit="%"
                domain={[0, 100]}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                label={{ value: 'Acceso Internet (%)', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <ZAxis 
                type="number" 
                dataKey="empleoTech" 
                range={[50, 400]} 
                name="Empleos Tech"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'Pobreza' || name === 'Internet') return [`${value.toFixed(2)}%`, name]
                  return [value.toLocaleString(), name]
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Scatter 
                name="Municipios" 
                data={scatterData}
              >
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>Interpretacion:</strong> Municipios en la esquina superior izquierda (baja pobreza, alto internet) 
            tienen mejor desarrollo digital. Los de la esquina inferior derecha (alta pobreza, bajo internet) 
            requieren intervencion prioritaria del MinTIC.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
