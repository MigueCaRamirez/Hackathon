"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileSpreadsheet, Check, AlertCircle, Download, Trash2, Loader2 } from "lucide-react"
import { MunicipioData } from "@/lib/types"

interface FileUploadProps {
  onDataLoaded: (data: MunicipioData[]) => void
  hasData: boolean
  onClearData: () => void
  currentData: MunicipioData[]
}

interface CleaningReport {
  originalRows: number
  cleanedRows: number
  removedRows: number
  duplicatesRemoved: number
  nullsFixed: number
  errors: string[]
}

export function FileUpload({ onDataLoaded, hasData, onClearData, currentData }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [cleaningReport, setCleaningReport] = useState<CleaningReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ── Helpers de estandarizacion ──────────────────────────────────────────────

  /** Quita tildes y caracteres diacriticos */
  const removeTildes = (str: string): string =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  /**
   * Estandariza nombre de municipio:
   *   "Municipio_1"  →  "Municipio 1"
   * Reemplaza guiones bajos por espacio.
   */
  const standardizeMunicipio = (raw: string): string =>
    raw.trim().replace(/_/g, ' ')

  /**
   * Estandariza nombre de departamento:
   *   1. Quita tildes
   *   2. Elimina articulos iniciales (La, El, Los, Las, Del, De, San)
   *   3. Convierte a MAYUSCULAS SOSTENIDAS
   *   "La Guajira" → "GUAJIRA"
   */
  const ARTICLES = /^(LA|EL|LOS|LAS|DEL|DE LA|DE LOS|DE LAS|DE|SAN|SANTA)\s+/i
  const standardizeDepartamento = (raw: string): string => {
    const sinTildes = removeTildes(raw.trim())
    const sinArticulo = sinTildes.replace(ARTICLES, '')
    return sinArticulo.toUpperCase()
  }

  /**
   * Estandariza nombre de columna para el CSV de salida:
   *   1. Quita tildes
   *   2. Reemplaza "_" por espacio
   *   3. Convierte a MAYUSCULAS
   *   "acceso_internet" → "ACCESO INTERNET"
   */
  const standardizeColumnName = (col: string): string =>
    removeTildes(col.trim()).replace(/_/g, ' ').toUpperCase()

  /**
   * Mapea nombres de columna del archivo entrante al nombre interno.
   * Normaliza quitando tildes, espacios → "_" y pasando a minusculas.
   */
  const mapColumnName = (col: string): string => {
    const normalized = removeTildes(col.toLowerCase().trim()).replace(/\s+/g, '_')
    const mappings: Record<string, string> = {
      'municipio': 'municipio',
      'municipality': 'municipio',
      'nombre_municipio': 'municipio',
      'departamento': 'departamento',
      'department': 'departamento',
      'dept': 'departamento',
      'pobreza': 'pobreza',
      'poverty': 'pobreza',
      'indice_pobreza': 'pobreza',
      'poverty_rate': 'pobreza',
      'acceso_internet': 'acceso_internet',
      'internet': 'acceso_internet',
      'internet_access': 'acceso_internet',
      'cobertura_internet': 'acceso_internet',
      'empleo_tech': 'empleo_tech',
      'empleos_tech': 'empleo_tech',
      'tech_jobs': 'empleo_tech',
      'tech_employment': 'empleo_tech',
      'empleos_tecnologia': 'empleo_tech',
    }
    return mappings[normalized] || normalized
  }

  /**
   * Convierte un valor numerico a porcentaje con EXACTAMENTE 2 decimales.
   * Regla: el primer punto separa la parte entera del decimal.
   *   "20.360319878..."  →  20.36
   *   "20.3"            →  20.30  (siempre 2 decimales)
   *   "20,36"           →  20.36  (soporte coma como decimal)
   *   "20"              →  20.00
   */
  const parsePercentage = (raw: unknown): number => {
    const str = String(raw ?? '').trim().replace(',', '.')
    // Buscar patron de numero con decimales
    const match = str.match(/^(\d+)\.?(\d*)/)
    if (!match) return 0.00
    
    const integerPart = match[1]
    const decimalPart = (match[2] || '00').substring(0, 2).padEnd(2, '0')
    
    const result = parseFloat(`${integerPart}.${decimalPart}`)
    return isNaN(result) ? 0.00 : result
  }

  /**
   * Formatea un numero para que siempre tenga 2 decimales en el CSV de salida
   */
  const formatPercentageForExport = (num: number): string => {
    return num.toFixed(2)
  }

  // ── Limpieza y estandarizacion principal ────────────────────────────────────

  const cleanAndValidateData = (rawData: Record<string, unknown>[]): { data: MunicipioData[], report: CleaningReport } => {
    const report: CleaningReport = {
      originalRows: rawData.length,
      cleanedRows: 0,
      removedRows: 0,
      duplicatesRemoved: 0,
      nullsFixed: 0,
      errors: []
    }

    // Normalizar nombres de columna
    const normalizedData = rawData.map(row => {
      const out: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(row)) {
        out[mapColumnName(key)] = value
      }
      return out
    })

    const seenMunicipios = new Set<string>()
    const cleanedData: MunicipioData[] = []

    for (const row of normalizedData) {
      if (!row.municipio || !row.departamento) {
        report.removedRows++
        continue
      }

      // 1. Municipio: reemplaza "_" por espacio
      const municipio = standardizeMunicipio(String(row.municipio))

      // 2. Departamento: sin tildes, sin articulo, MAYUSCULAS
      const departamento = standardizeDepartamento(String(row.departamento))

      // Duplicados
      const key = `${municipio}||${departamento}`
      if (seenMunicipios.has(key)) {
        report.duplicatesRemoved++
        continue
      }
      seenMunicipios.add(key)

      // 3. Pobreza y Acceso_internet: primer punto = limite del porcentaje
      let pobreza = parsePercentage(row.pobreza)
      let acceso_internet = parsePercentage(row.acceso_internet)

      if (isNaN(pobreza) || pobreza < 0) { pobreza = 0; report.nullsFixed++ }
      if (pobreza > 100) pobreza = 100

      if (isNaN(acceso_internet) || acceso_internet < 0) { acceso_internet = 0; report.nullsFixed++ }
      if (acceso_internet > 100) acceso_internet = 100

      let empleo_tech = parseInt(String(row.empleo_tech ?? '0'), 10)
      if (isNaN(empleo_tech) || empleo_tech < 0) { empleo_tech = 0; report.nullsFixed++ }

      cleanedData.push({ municipio, departamento, pobreza, acceso_internet, empleo_tech })
    }

    report.cleanedRows = cleanedData.length
    report.removedRows = Math.max(0, report.originalRows - report.cleanedRows - report.duplicatesRemoved)

    return { data: cleanedData, report }
  }

  const parseCSV = (text: string): Record<string, unknown>[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('El archivo debe tener al menos una fila de encabezados y una de datos')

    const headers = lines[0].split(/[,;]/).map(h => h.trim().replace(/^["']|["']$/g, ''))
    const data: Record<string, unknown>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,;]/).map(v => v.trim().replace(/^["']|["']$/g, ''))
      if (values.length !== headers.length) continue

      const row: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })
      data.push(row)
    }

    return data
  }

  const parseExcel = async (buffer: ArrayBuffer): Promise<Record<string, unknown>[]> => {
    // Dynamic import for xlsx library
    const XLSX = await import('xlsx')
    const workbook = XLSX.read(buffer, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(firstSheet)
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setCleaningReport(null)

    try {
      let rawData: Record<string, unknown>[]

      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        rawData = parseCSV(text)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer()
        rawData = await parseExcel(buffer)
      } else {
        throw new Error('Formato no soportado. Use archivos .csv, .xlsx o .xls')
      }

      if (rawData.length === 0) {
        throw new Error('El archivo no contiene datos validos')
      }

      const { data, report } = cleanAndValidateData(rawData)

      if (data.length === 0) {
        throw new Error('No se pudieron procesar datos validos. Verifique que las columnas sean: municipio, departamento, pobreza, acceso_internet, empleo_tech')
      }

      setFileName(file.name)
      setCleaningReport(report)
      onDataLoaded(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const downloadCleanedCSV = () => {
    if (currentData.length === 0) return

    // Columnas internas y sus encabezados estandarizados para Power BI
    // 4. Nombres de columna: MAYUSCULAS, sin tildes, sin "_", palabras separadas por espacio
    const internalKeys: (keyof MunicipioData)[] = ['municipio', 'departamento', 'pobreza', 'acceso_internet', 'empleo_tech']
    const exportHeaders = internalKeys.map(k => standardizeColumnName(k))

    const csvContent = [
      exportHeaders.join(','),
      ...currentData.map(row =>
        internalKeys.map(k => {
          const value = row[k]
          // Formatear porcentajes con exactamente 2 decimales
          if (k === 'pobreza' || k === 'acceso_internet') {
            return formatPercentageForExport(value as number)
          }
          return typeof value === 'string' ? `"${value}"` : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'datos_limpios_powerbi.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setFileName(null)
    setCleaningReport(null)
    setError(null)
    onClearData()
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              Cargar Datos
            </CardTitle>
            <CardDescription>
              Suba un archivo CSV o Excel para analizar
            </CardDescription>
          </div>
          {hasData && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadCleanedCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar CSV para Power BI
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-all
            ${isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-border hover:border-emerald-400'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="text-sm text-muted-foreground">Procesando archivo...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Arrastre un archivo aqui o haga clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos soportados: CSV, XLSX, XLS
              </p>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Report */}
        {cleaningReport && !error && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <Check className="h-5 w-5" />
              <span className="font-medium">Archivo procesado exitosamente</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {fileName}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Filas originales</p>
                <p className="font-semibold text-emerald-700">{cleaningReport.originalRows}</p>
              </div>
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Filas limpias</p>
                <p className="font-semibold text-emerald-700">{cleaningReport.cleanedRows}</p>
              </div>
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Duplicados eliminados</p>
                <p className="font-semibold text-amber-600">{cleaningReport.duplicatesRemoved}</p>
              </div>
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Valores corregidos</p>
                <p className="font-semibold text-amber-600">{cleaningReport.nullsFixed}</p>
              </div>
            </div>

            <p className="text-xs text-emerald-600">
              Transformaciones aplicadas: municipios sin guion bajo, departamentos en MAYUSCULAS sin articulos ni tildes, pobreza e internet truncados a 2 decimales, columnas de salida estandarizadas.
            </p>
          </div>
        )}

        {/* Expected Format Info */}
        {!hasData && !error && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Columnas esperadas en el archivo:</p>
            <div className="flex flex-wrap gap-1.5">
              {['municipio', 'departamento', 'pobreza', 'acceso_internet', 'empleo_tech'].map(col => (
                <Badge key={col} variant="outline" className="text-xs font-mono">
                  {col}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              El CSV exportado tendra encabezados estandarizados: <span className="font-mono font-medium">MUNICIPIO, DEPARTAMENTO, POBREZA, ACCESO INTERNET, EMPLEO TECH</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
