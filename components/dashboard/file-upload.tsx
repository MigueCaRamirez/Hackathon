"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileSpreadsheet, Check, AlertCircle, Download, Trash2, Loader2 } from "lucide-react"
import { TaxiTripData } from "@/lib/types"

interface FileUploadProps {
  onDataLoaded: (data: TaxiTripData[]) => void
  hasData: boolean
  onClearData: () => void
  currentData: TaxiTripData[]
}

interface CleaningReport {
  originalRows: number
  cleanedRows: number
  removedRows: number
  nullsRemoved: number
  zeroDistanceRemoved: number
  invalidDataRemoved: number
  errors: string[]
}

// Columnas esperadas del dataset
const EXPECTED_COLUMNS = [
  'VendorID', 'tpep_pickup_datetime', 'tpep_dropoff_datetime', 'passenger_count',
  'trip_distance', 'pickup_longitude', 'pickup_latitude', 'RateCodeID',
  'store_and_fwd_flag', 'dropoff_longitude', 'dropoff_latitude', 'payment_type',
  'fare_amount', 'extra', 'mta_tax', 'tip_amount', 'tolls_amount',
  'improvement_surcharge', 'total_amount'
]

export function FileUpload({ onDataLoaded, hasData, onClearData, currentData }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [cleaningReport, setCleaningReport] = useState<CleaningReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ── Helpers de formato ──────────────────────────────────────────────

  /**
   * Convierte fecha de formato "yyyy-mm-dd HH:MM:SS" a "dd/mm/yyyy HH:MM:SS"
   */
  const formatDateTime = (raw: string): string | null => {
    if (!raw || typeof raw !== 'string') return null
    
    const trimmed = raw.trim()
    
    // Si ya esta en formato dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}/.test(trimmed)) {
      return trimmed
    }
    
    // Formato yyyy-mm-dd HH:MM:SS
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/)
    if (match) {
      const [, year, month, day, hour, minute, second] = match
      // Validar valores
      const y = parseInt(year, 10)
      const m = parseInt(month, 10)
      const d = parseInt(day, 10)
      const h = parseInt(hour, 10)
      const min = parseInt(minute, 10)
      const s = parseInt(second, 10)
      
      if (y < 1900 || y > 2100) return null
      if (m < 1 || m > 12) return null
      if (d < 1 || d > 31) return null
      if (h < 0 || h > 23) return null
      if (min < 0 || min > 59) return null
      if (s < 0 || s > 59) return null
      
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`
    }
    
    return null
  }

  /**
   * Parsea un numero, retorna null si no es valido o contiene letras
   */
  const parseNumber = (raw: unknown): number | null => {
    if (raw === null || raw === undefined || raw === '') return null
    
    const str = String(raw).trim()
    
    // Verificar que no contenga letras (excepto notacion cientifica)
    if (/[a-df-zA-DF-Z]/.test(str)) return null
    
    const num = parseFloat(str)
    if (isNaN(num)) return null
    
    return num
  }

  /**
   * Parsea un entero, retorna null si no es valido
   */
  const parseInteger = (raw: unknown): number | null => {
    if (raw === null || raw === undefined || raw === '') return null
    
    const str = String(raw).trim()
    
    // Verificar que solo contenga digitos (y posible signo)
    if (!/^-?\d+$/.test(str)) return null
    
    const num = parseInt(str, 10)
    if (isNaN(num)) return null
    
    return num
  }

  /**
   * Formatea coordenadas sin notacion cientifica (6 decimales)
   */
  const formatCoordinate = (num: number): number => {
    // Convertir a string sin notacion cientifica
    const str = num.toFixed(6)
    return parseFloat(str)
  }

  /**
   * Formatea numeros decimales asegurando que el 0 antes del punto este presente
   */
  const formatDecimal = (num: number, decimals: number = 2): number => {
    return parseFloat(num.toFixed(decimals))
  }

  // ── Limpieza y validacion principal ────────────────────────────────────

  const cleanAndValidateData = (rawData: Record<string, unknown>[]): { data: TaxiTripData[], report: CleaningReport } => {
    const report: CleaningReport = {
      originalRows: rawData.length,
      cleanedRows: 0,
      removedRows: 0,
      nullsRemoved: 0,
      zeroDistanceRemoved: 0,
      invalidDataRemoved: 0,
      errors: []
    }

    const cleanedData: TaxiTripData[] = []

    for (const row of rawData) {
      // 1. Verificar campos nulos - eliminar registro si hay alguno nulo
      let hasNull = false
      for (const col of EXPECTED_COLUMNS) {
        const value = row[col]
        if (value === null || value === undefined || value === '') {
          hasNull = true
          break
        }
      }
      
      if (hasNull) {
        report.nullsRemoved++
        continue
      }

      // 2. Parsear y validar VendorID (entero)
      const VendorID = parseInteger(row.VendorID)
      if (VendorID === null) {
        report.invalidDataRemoved++
        continue
      }

      // 3. Parsear y validar fechas
      const tpep_pickup_datetime = formatDateTime(String(row.tpep_pickup_datetime))
      const tpep_dropoff_datetime = formatDateTime(String(row.tpep_dropoff_datetime))
      
      if (!tpep_pickup_datetime || !tpep_dropoff_datetime) {
        report.invalidDataRemoved++
        continue
      }

      // 4. Parsear passenger_count (entero)
      const passenger_count = parseInteger(row.passenger_count)
      if (passenger_count === null || passenger_count < 0) {
        report.invalidDataRemoved++
        continue
      }

      // 5. Parsear trip_distance - eliminar si es 0
      const trip_distance_raw = parseNumber(row.trip_distance)
      if (trip_distance_raw === null) {
        report.invalidDataRemoved++
        continue
      }
      if (trip_distance_raw === 0) {
        report.zeroDistanceRemoved++
        continue
      }
      const trip_distance = formatDecimal(trip_distance_raw, 2)

      // 6. Parsear coordenadas (sin notacion cientifica)
      const pickup_longitude_raw = parseNumber(row.pickup_longitude)
      const pickup_latitude_raw = parseNumber(row.pickup_latitude)
      const dropoff_longitude_raw = parseNumber(row.dropoff_longitude)
      const dropoff_latitude_raw = parseNumber(row.dropoff_latitude)
      
      if (pickup_longitude_raw === null || pickup_latitude_raw === null ||
          dropoff_longitude_raw === null || dropoff_latitude_raw === null) {
        report.invalidDataRemoved++
        continue
      }
      
      const pickup_longitude = formatCoordinate(pickup_longitude_raw)
      const pickup_latitude = formatCoordinate(pickup_latitude_raw)
      const dropoff_longitude = formatCoordinate(dropoff_longitude_raw)
      const dropoff_latitude = formatCoordinate(dropoff_latitude_raw)

      // 7. Parsear RateCodeID (entero)
      const RateCodeID = parseInteger(row.RateCodeID)
      if (RateCodeID === null) {
        report.invalidDataRemoved++
        continue
      }

      // 8. Validar store_and_fwd_flag (debe ser Y o N)
      const store_and_fwd_flag = String(row.store_and_fwd_flag).trim().toUpperCase()
      if (store_and_fwd_flag !== 'Y' && store_and_fwd_flag !== 'N') {
        report.invalidDataRemoved++
        continue
      }

      // 9. Parsear payment_type (entero)
      const payment_type = parseInteger(row.payment_type)
      if (payment_type === null) {
        report.invalidDataRemoved++
        continue
      }

      // 10. Parsear campos monetarios (decimales)
      const fare_amount_raw = parseNumber(row.fare_amount)
      const extra_raw = parseNumber(row.extra)
      const mta_tax_raw = parseNumber(row.mta_tax)
      const tip_amount_raw = parseNumber(row.tip_amount)
      const tolls_amount_raw = parseNumber(row.tolls_amount)
      const improvement_surcharge_raw = parseNumber(row.improvement_surcharge)
      const total_amount_raw = parseNumber(row.total_amount)
      
      if (fare_amount_raw === null || extra_raw === null || mta_tax_raw === null ||
          tip_amount_raw === null || tolls_amount_raw === null || 
          improvement_surcharge_raw === null || total_amount_raw === null) {
        report.invalidDataRemoved++
        continue
      }
      
      const fare_amount = formatDecimal(fare_amount_raw, 2)
      const extra = formatDecimal(extra_raw, 2)
      const mta_tax = formatDecimal(mta_tax_raw, 2)
      const tip_amount = formatDecimal(tip_amount_raw, 2)
      const tolls_amount = formatDecimal(tolls_amount_raw, 2)
      const improvement_surcharge = formatDecimal(improvement_surcharge_raw, 2)
      const total_amount = formatDecimal(total_amount_raw, 2)

      // Registro valido
      cleanedData.push({
        VendorID,
        tpep_pickup_datetime,
        tpep_dropoff_datetime,
        passenger_count,
        trip_distance,
        pickup_longitude,
        pickup_latitude,
        RateCodeID,
        store_and_fwd_flag,
        dropoff_longitude,
        dropoff_latitude,
        payment_type,
        fare_amount,
        extra,
        mta_tax,
        tip_amount,
        tolls_amount,
        improvement_surcharge,
        total_amount
      })
    }

    report.cleanedRows = cleanedData.length
    report.removedRows = report.originalRows - report.cleanedRows

    return { data: cleanedData, report }
  }

  const parseCSV = (text: string): Record<string, unknown>[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('El archivo debe tener al menos una fila de encabezados y una de datos')

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
    const data: Record<string, unknown>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
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
        throw new Error('No se pudieron procesar datos validos. Verifique que las columnas coincidan con el formato esperado.')
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

    const headers = EXPECTED_COLUMNS.join(',')
    
    const csvContent = [
      headers,
      ...currentData.map(row => 
        EXPECTED_COLUMNS.map(col => {
          const value = row[col as keyof TaxiTripData]
          if (typeof value === 'string') {
            return `"${value}"`
          }
          // Asegurar que decimales menores a 1 tengan el 0 antes del punto
          if (typeof value === 'number') {
            if (col.includes('longitude') || col.includes('latitude')) {
              return value.toFixed(6)
            }
            if (['trip_distance', 'fare_amount', 'extra', 'mta_tax', 'tip_amount', 
                 'tolls_amount', 'improvement_surcharge', 'total_amount'].includes(col)) {
              return value.toFixed(2)
            }
          }
          return value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'taxi_trips_cleaned.csv'
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
              Cargar Dataset de Viajes
            </CardTitle>
            <CardDescription>
              Suba un archivo CSV o Excel con datos de viajes de taxi NYC
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
                Descargar CSV Limpio
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
              <p className="text-sm text-muted-foreground">Procesando y limpiando archivo...</p>
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
              <span className="font-medium">Archivo procesado y limpiado exitosamente</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {fileName}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Registros originales</p>
                <p className="font-semibold text-emerald-700">{cleaningReport.originalRows.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Registros limpios</p>
                <p className="font-semibold text-emerald-700">{cleaningReport.cleanedRows.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Nulos eliminados</p>
                <p className="font-semibold text-amber-600">{cleaningReport.nullsRemoved.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded bg-white/80">
                <p className="text-muted-foreground text-xs">Distancia 0 eliminados</p>
                <p className="font-semibold text-amber-600">{cleaningReport.zeroDistanceRemoved.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs text-emerald-600">
              Limpieza aplicada: fechas en formato dd/mm/yyyy HH:MM:SS, coordenadas sin notacion cientifica, 
              eliminacion de registros con valores nulos o trip_distance=0, validacion de tipos de datos.
            </p>
          </div>
        )}

        {/* Expected Format Info */}
        {!hasData && !error && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Columnas esperadas en el archivo:</p>
            <div className="flex flex-wrap gap-1.5">
              {EXPECTED_COLUMNS.slice(0, 8).map(col => (
                <Badge key={col} variant="outline" className="text-xs font-mono">
                  {col}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs font-mono">
                ... +{EXPECTED_COLUMNS.length - 8} mas
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              El sistema limpiara automaticamente: eliminara nulos, validara formatos de fecha, 
              eliminara viajes con distancia 0, y formateara coordenadas sin notacion cientifica.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
