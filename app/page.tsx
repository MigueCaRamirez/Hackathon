"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Wifi, 
  WifiOff, 
  TrendingDown, 
  Briefcase, 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  MapPin,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  Target,
  Lightbulb,
  AlertTriangle,
  Globe
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative border-b border-border/50 bg-gradient-to-br from-emerald-50 via-background to-teal-50/30">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">CenSys</span>
            </div>
            <Link href="/dashboard">
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                Ir al Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-emerald-100 text-emerald-700 border-emerald-200">
              Visualizacion de Indicadores Sociales y Tecnologicos
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              Analisis de Brechas Digitales en{" "}
              <span className="text-emerald-600">Colombia</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              CenSys es una herramienta de visualizacion y analisis que permite identificar correlaciones 
              entre pobreza, acceso a internet y empleos tecnologicos para orientar politicas publicas 
              de intervencion digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                  <BarChart3 className="h-5 w-5" />
                  Explorar Dashboard
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <FileSpreadsheet className="h-5 w-5" />
                Subir Datos CSV/Excel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Problematicas Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Contexto Nacional</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Las Problematicas que Enfrentamos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Colombia enfrenta desafios criticos en el desarrollo digital de sus municipios, 
              con brechas significativas que limitan el crecimiento economico y social.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Pobreza */}
            <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                  <TrendingDown className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl text-amber-800">Alta Tasa de Pobreza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Muchos municipios colombianos presentan indices de pobreza superiores al 40%, 
                  limitando el acceso a servicios basicos, educacion y oportunidades laborales. 
                  Esta situacion perpetua un ciclo de desigualdad que requiere intervencion urgente.
                </p>
                <div className="mt-4 flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">Afecta desarrollo humano integral</span>
                </div>
              </CardContent>
            </Card>

            {/* Falta de Internet */}
            <Card className="border-rose-200 bg-rose-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
                  <WifiOff className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-xl text-rose-800">Baja Conectividad Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rose-700 text-sm leading-relaxed">
                  El acceso a internet en zonas rurales y municipios alejados sigue siendo 
                  criticamente bajo. Sin conectividad, las comunidades quedan excluidas de 
                  la economia digital, educacion virtual y servicios gubernamentales en linea.
                </p>
                <div className="mt-4 flex items-center gap-2 text-rose-600">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">Exclusion de la economia digital</span>
                </div>
              </CardContent>
            </Card>

            {/* Pocos Empleos Tech */}
            <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-slate-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Escasez de Empleos Tech</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm leading-relaxed">
                  La concentracion de empleos tecnologicos en las grandes ciudades deja a los 
                  municipios menores sin oportunidades de desarrollo en el sector TIC, 
                  generando migracion de talento y fuga de capital humano.
                </p>
                <div className="mt-4 flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Fuga de talento local</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solucion CenSys */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-emerald-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">Nuestra Solucion</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Como CenSys Ayuda a Solventar estas Problematicas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CenSys proporciona herramientas de analisis y visualizacion que permiten a 
              tomadores de decisiones identificar y priorizar intervenciones digitales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Cruce de Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identifica correlaciones profundas entre niveles de pobreza, acceso a internet 
                  y empleos tech por municipio y departamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Deteccion de Brechas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clasifica municipios segun urgencia de intervencion digital, priorizando 
                  inversiones para el MinTIC y entidades gubernamentales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Analisis Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Graficos de barras, distribuciones y mapas de calor que revelan 
                  clusteres de exclusion digital de forma clara y accionable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                  <Download className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Exportacion Power BI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Estandariza y limpia datos para exportar CSV compatibles con Power BI, 
                  facilitando reportes institucionales y toma de decisiones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades del Dashboard */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge variant="outline">Funcionalidades</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Un Dashboard Completo para el Analisis de Indicadores
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Carga de Datos Flexible</p>
                    <p className="text-sm text-muted-foreground">
                      Suba archivos CSV o Excel con sus propios datos de municipios y vea el analisis en tiempo real.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Limpieza Automatica</p>
                    <p className="text-sm text-muted-foreground">
                      Estandarizacion de nombres, eliminacion de duplicados y formato de datos listo para Power BI.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Visualizaciones Interactivas</p>
                    <p className="text-sm text-muted-foreground">
                      Graficos de barras comparativos, graficos de pastel y estadisticas por departamento.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tabla de Datos Filtrable</p>
                    <p className="text-sm text-muted-foreground">
                      Explore, busque y ordene todos los municipios con indicadores detallados.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 mt-4">
                  Acceder al Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Preview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border/50 shadow-sm col-span-2">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Municipios</p>
                      <p className="text-2xl font-bold text-emerald-600">150+</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-amber-600" />
                    <p className="text-xs text-muted-foreground">Pobreza Prom.</p>
                  </div>
                  <p className="text-xl font-bold text-amber-600">32.5%</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-muted-foreground">Internet Prom.</p>
                  </div>
                  <p className="text-xl font-bold text-teal-600">45.8%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto Section */}
      <section className="py-16 md:py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Insights Estrategicos para Politicas Publicas
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
            CenSys proporciona recomendaciones basadas en datos para orientar inversiones 
            del MinTIC y programas de conectividad, ayudando a cerrar la brecha digital 
            en los municipios mas vulnerables de Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                <Lightbulb className="h-5 w-5" />
                Comenzar Analisis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">CenSys</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Visualizacion de Indicadores Sociales y Tecnologicos por Municipio - Colombia
            </p>
            <p className="text-xs text-muted-foreground">
              RETO 2 - Analisis de Brecha Digital
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
