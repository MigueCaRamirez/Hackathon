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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import { VendorStats, PaymentTypeStats, HourlyStats, getVendorColor, getPaymentTypeColor, VENDOR_NAMES, PAYMENT_TYPE_NAMES } from "@/lib/types"

interface VendorChartsProps {
  vendorStats: VendorStats[]
}

interface PaymentChartsProps {
  paymentStats: PaymentTypeStats[]
}

interface HourlyChartsProps {
  hourlyStats: HourlyStats[]
}

// Colores fijos para metricas
const METRIC_COLORS = {
  revenue: '#059669',     // Verde - ingresos
  trips: '#0891b2',       // Cyan - viajes
  distance: '#84cc16',    // Lima - distancia
  tip: '#f59e0b'          // Amber - propinas
}

export function BarChartVendorRevenue({ vendorStats }: VendorChartsProps) {
  const data = vendorStats.map(v => ({
    name: v.vendorName,
    ingresos: v.total_revenue,
    viajes: v.total_trips,
    fill: getVendorColor(v.vendorID)
  }))

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ingresos por Proveedor</CardTitle>
        <CardDescription>Comparacion de ingresos totales ($)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingresos']}
              />
              <Bar dataKey="ingresos" radius={[4, 4, 0, 0]}>
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

export function BarChartVendorTrips({ vendorStats }: VendorChartsProps) {
  const data = vendorStats.map(v => ({
    name: v.vendorName,
    viajes: v.total_trips,
    pasajeros: v.total_passengers,
    fill: getVendorColor(v.vendorID)
  }))

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Viajes y Pasajeros por Proveedor</CardTitle>
        <CardDescription>Total de viajes y pasajeros transportados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
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
                  value.toLocaleString(), 
                  name === 'viajes' ? 'Viajes' : 'Pasajeros'
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: 'var(--foreground)' }}>
                    {value === 'viajes' ? 'Viajes' : 'Pasajeros'}
                  </span>
                )}
              />
              <Bar dataKey="viajes" fill={METRIC_COLORS.trips} radius={[4, 4, 0, 0]} name="viajes" />
              <Bar dataKey="pasajeros" fill={METRIC_COLORS.distance} radius={[4, 4, 0, 0]} name="pasajeros" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChartPaymentTypes({ paymentStats }: PaymentChartsProps) {
  const data = paymentStats.map(p => ({
    name: p.payment_name,
    value: p.total_trips,
    fill: getPaymentTypeColor(p.payment_type)
  }))

  const totalTrips = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribucion por Tipo de Pago</CardTitle>
        <CardDescription>Viajes por metodo de pago</CardDescription>
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
                formatter={(value: number) => [`${value.toLocaleString()} viajes (${((value/totalTrips)*100).toFixed(1)}%)`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChartPaymentRevenue({ paymentStats }: PaymentChartsProps) {
  const data = paymentStats.map(p => ({
    name: p.payment_name,
    value: p.total_revenue,
    fill: getPaymentTypeColor(p.payment_type)
  }))

  const totalRevenue = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ingresos por Tipo de Pago</CardTitle>
        <CardDescription>Distribucion de ingresos ($)</CardDescription>
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
                formatter={(value: number) => [`$${value.toLocaleString()} (${((value/totalRevenue)*100).toFixed(1)}%)`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function LineChartHourlyTrips({ hourlyStats }: HourlyChartsProps) {
  const data = hourlyStats.map(h => ({
    hora: `${h.hour.toString().padStart(2, '0')}:00`,
    viajes: h.trips,
    tarifa_promedio: h.avg_fare
  }))

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Viajes por Hora del Dia</CardTitle>
        <CardDescription>Distribucion horaria de viajes (formato 24h)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="hora" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
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
                  name === 'viajes' ? value.toLocaleString() : `$${value.toFixed(2)}`,
                  name === 'viajes' ? 'Viajes' : 'Tarifa Prom.'
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: 'var(--foreground)' }}>
                    {value === 'viajes' ? 'Viajes' : 'Tarifa Promedio'}
                  </span>
                )}
              />
              <Area 
                type="monotone" 
                dataKey="viajes" 
                stroke={METRIC_COLORS.trips} 
                fill={METRIC_COLORS.trips}
                fillOpacity={0.3}
                name="viajes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function LineChartHourlyFare({ hourlyStats }: HourlyChartsProps) {
  const data = hourlyStats.map(h => ({
    hora: `${h.hour.toString().padStart(2, '0')}:00`,
    tarifa: h.avg_fare,
    distancia: h.avg_distance
  }))

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tarifa y Distancia Promedio por Hora</CardTitle>
        <CardDescription>Variacion horaria de tarifas ($) y distancias (mi)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="hora" 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `${value}mi`}
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
                  name === 'tarifa' ? `$${value.toFixed(2)}` : `${value.toFixed(2)} mi`,
                  name === 'tarifa' ? 'Tarifa Prom.' : 'Distancia Prom.'
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: 'var(--foreground)' }}>
                    {value === 'tarifa' ? 'Tarifa ($)' : 'Distancia (mi)'}
                  </span>
                )}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="tarifa" 
                stroke={METRIC_COLORS.revenue} 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="tarifa"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="distancia" 
                stroke={METRIC_COLORS.distance} 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="distancia"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
