"use client"

import { useState } from "react"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RegionalStats } from "@/components/dashboard/regional-stats"
import { BarChartPobreza, BarChartEmpleoTech, PieChartMunicipios, PieChartEmpleoTech, ScatterChartCorrelation } from "@/components/dashboard/charts"
import { DataTable } from "@/components/dashboard/data-table"
import { FileUpload } from "@/components/dashboard/file-upload"
import { BrechasAnalysis } from "@/components/dashboard/brechas-analysis"
import { defaultMunicipiosData, getDepartamentoStats, getGeneralStats } from "@/lib/data"
import { MunicipioData } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Building2, BarChart3, PieChart, Table2, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [selectedDepartamento, setSelectedDepartamento] = useState<string | null>(null)
  const [municipiosData, setMunicipiosData] = useState<MunicipioData[]>(defaultMunicipiosData)
  const [isCustomData, setIsCustomData] = useState(false)
  
  const generalStats = getGeneralStats(municipiosData)
  const departamentoStats = getDepartamentoStats(municipiosData)

  const handleDataLoaded = (data: MunicipioData[]) => {
    setMunicipiosData(data)
    setIsCustomData(true)
    setSelectedDepartamento(null)
  }

  const handleClearData = () => {
    setMunicipiosData(defaultMunicipiosData)
    setIsCustomData(false)
    setSelectedDepartamento(null)
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
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  CenSys Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Analisis de Pobreza, Acceso a Internet y Empleos Tech
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isCustomData && (
                <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Datos personalizados cargados
                </span>
              )}
              <span className="px-2 py-1 rounded-md bg-secondary border border-border/50">
                {municipiosData.length} municipios
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
            currentData={municipiosData}
          />
        </section>

        {/* KPI Cards */}
        <section>
          <KPICards
            totalMunicipios={generalStats.totalMunicipios}
            totalDepartamentos={generalStats.totalDepartamentos}
            promedioPobreza={generalStats.promedioPobreza}
            promedioInternet={generalStats.promedioInternet}
            totalEmpleoTech={generalStats.totalEmpleoTech}
          />
        </section>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1 border border-border/50 flex-wrap h-auto">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Vista General</span>
            </TabsTrigger>
            <TabsTrigger value="brechas" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Deteccion de Brechas</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Graficas de Barras</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Graficos de Pastel</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Tabla de Datos</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Regional Stats + Summary Charts */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionalStats
                departamentoStats={departamentoStats}
                selectedDepartamento={selectedDepartamento}
                onSelectDepartamento={setSelectedDepartamento}
              />
              <BarChartEmpleoTech departamentoStats={departamentoStats} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartPobreza departamentoStats={departamentoStats} />
              <ScatterChartCorrelation data={municipiosData} />
            </div>
          </TabsContent>

          {/* Brechas Tab - Gap Detection and Prioritization */}
          <TabsContent value="brechas" className="space-y-6">
            <BrechasAnalysis data={municipiosData} departamentoStats={departamentoStats} />
          </TabsContent>

          {/* Bar Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartPobreza departamentoStats={departamentoStats} />
              <BarChartEmpleoTech departamentoStats={departamentoStats} />
            </div>
            <ScatterChartCorrelation data={municipiosData} />
          </TabsContent>

          {/* Pie Charts Tab */}
          <TabsContent value="pie" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChartMunicipios departamentoStats={departamentoStats} />
              <PieChartEmpleoTech departamentoStats={departamentoStats} />
            </div>
          </TabsContent>

          {/* Table Tab */}
          <TabsContent value="table">
            <DataTable
              data={municipiosData}
              selectedDepartamento={selectedDepartamento}
              onSelectDepartamento={setSelectedDepartamento}
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
                <BarChart3 className="h-3 w-3 text-white" />
              </div>
              CenSys - Dashboard de Indicadores Socioeconomicos
            </p>
            <p>Suba archivos CSV o Excel para analizar y exportar datos limpios a Power BI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
