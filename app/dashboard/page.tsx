"use client"

import { useState } from "react"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RegionalStats } from "@/components/dashboard/regional-stats"
import { BarChartVendorRevenue, BarChartVendorTrips, PieChartPaymentTypes, PieChartPaymentRevenue, LineChartHourlyTrips, LineChartHourlyFare } from "@/components/dashboard/charts"
import { DataTable } from "@/components/dashboard/data-table"
import { FileUpload } from "@/components/dashboard/file-upload"
import { BrechasAnalysis } from "@/components/dashboard/brechas-analysis"
import { defaultTaxiData, getVendorStats, getPaymentTypeStats, getHourlyStats, getGeneralStats } from "@/lib/data"
import { TaxiTripData } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Car, BarChart3, PieChart, Table2, TrendingUp, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null)
  const [taxiData, setTaxiData] = useState<TaxiTripData[]>(defaultTaxiData)
  const [isCustomData, setIsCustomData] = useState(false)
  
  const generalStats = getGeneralStats(taxiData)
  const vendorStats = getVendorStats(taxiData)
  const paymentStats = getPaymentTypeStats(taxiData)
  const hourlyStats = getHourlyStats(taxiData)

  const handleDataLoaded = (data: TaxiTripData[]) => {
    setTaxiData(data)
    setIsCustomData(true)
    setSelectedVendor(null)
  }

  const handleClearData = () => {
    setTaxiData(defaultTaxiData)
    setIsCustomData(false)
    setSelectedVendor(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Inicio</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <Car className="h-4 w-4 text-white" />
                  </div>
                  NYC Taxi Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                  Analisis de Viajes y Transporte NYC
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isCustomData && (
                <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Dataset cargado y limpiado
                </span>
              )}
              <span className="px-2 py-1 rounded-md bg-secondary border border-border/50">
                {taxiData.length.toLocaleString()} viajes
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* File Upload Section */}
        <section>
          <FileUpload 
            onDataLoaded={handleDataLoaded}
            hasData={isCustomData}
            onClearData={handleClearData}
            currentData={taxiData}
          />
        </section>

        {/* KPI Cards */}
        {taxiData.length > 0 && (
          <section>
            <KPICards
              totalTrips={generalStats.totalTrips}
              totalPassengers={generalStats.totalPassengers}
              totalRevenue={generalStats.totalRevenue}
              avgFare={generalStats.avgFare}
              avgDistance={generalStats.avgDistance}
              totalDistance={generalStats.totalDistance}
            />
          </section>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1 border border-border/50 flex-wrap h-auto">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Vista General</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analisis de Viajes</span>
            </TabsTrigger>
            <TabsTrigger value="hourly" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Tendencias Horarias</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Tipos de Pago</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Tabla de Datos</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Vendor Stats + Revenue Charts */}
          <TabsContent value="overview" className="space-y-6">
            {taxiData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>Cargue un dataset para ver las estadisticas</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RegionalStats
                    vendorStats={vendorStats}
                    selectedVendor={selectedVendor}
                    onSelectVendor={setSelectedVendor}
                  />
                  <BarChartVendorRevenue vendorStats={vendorStats} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BarChartVendorTrips vendorStats={vendorStats} />
                  <LineChartHourlyTrips hourlyStats={hourlyStats} />
                </div>
              </>
            )}
          </TabsContent>

          {/* Analysis Tab - Trip Analysis */}
          <TabsContent value="analysis" className="space-y-6">
            <BrechasAnalysis 
              data={taxiData} 
              paymentStats={paymentStats}
              hourlyStats={hourlyStats}
            />
          </TabsContent>

          {/* Hourly Tab - Time-based Charts */}
          <TabsContent value="hourly" className="space-y-6">
            {taxiData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>Cargue un dataset para ver las tendencias horarias</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChartHourlyTrips hourlyStats={hourlyStats} />
                <LineChartHourlyFare hourlyStats={hourlyStats} />
              </div>
            )}
          </TabsContent>

          {/* Pie Charts Tab */}
          <TabsContent value="pie" className="space-y-6">
            {taxiData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>Cargue un dataset para ver los tipos de pago</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChartPaymentTypes paymentStats={paymentStats} />
                <PieChartPaymentRevenue paymentStats={paymentStats} />
              </div>
            )}
          </TabsContent>

          {/* Table Tab */}
          <TabsContent value="table">
            <DataTable
              data={taxiData}
              selectedVendor={selectedVendor}
              onSelectVendor={setSelectedVendor}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center">
                <Car className="h-3 w-3 text-white" />
              </div>
              NYC Taxi Analytics - Dashboard de Viajes y Transporte
            </p>
            <p>Suba archivos CSV o Excel para analizar datos de viajes de taxi NYC</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
