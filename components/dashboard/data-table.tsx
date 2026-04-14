"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react"
import { TaxiTripData, getVendorColor, getPaymentTypeColor, VENDOR_NAMES, PAYMENT_TYPE_NAMES } from "@/lib/types"
import { filterTrips, sortTrips, getVendors, getPaymentTypes } from "@/lib/data"

interface DataTableProps {
  data: TaxiTripData[]
  selectedVendor: number | null
  onSelectVendor: (vendor: number | null) => void
}

type SortField = keyof TaxiTripData

export function DataTable({ data, selectedVendor, onSelectVendor }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortField>("tpep_pickup_datetime")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50
  
  const vendors = useMemo(() => getVendors(data), [data])
  const paymentTypes = useMemo(() => getPaymentTypes(data), [data])
  
  const filteredData = useMemo(() => {
    const filtered = filterTrips(data, selectedVendor, selectedPayment, searchTerm)
    return sortTrips(filtered, sortBy, sortOrder)
  }, [data, selectedVendor, selectedPayment, searchTerm, sortBy, sortOrder])
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage])
  
  const totalPages = Math.ceil(filteredData.length / pageSize)
  
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }
  
  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sortOrder === 'asc' 
      ? <ArrowUp className="ml-1 h-3 w-3" /> 
      : <ArrowDown className="ml-1 h-3 w-3" />
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Registros de Viajes</CardTitle>
            <CardDescription>
              {filteredData.length.toLocaleString()} de {data.length.toLocaleString()} viajes
              {totalPages > 1 && ` (Pagina ${currentPage} de ${totalPages})`}
            </CardDescription>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por fecha..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="pl-8 w-full sm:w-[180px] bg-secondary border-border"
              />
            </div>
            
            <Select
              value={selectedVendor?.toString() || "all"}
              onValueChange={(value) => { onSelectVendor(value === "all" ? null : parseInt(value)); setCurrentPage(1) }}
            >
              <SelectTrigger className="w-full sm:w-[160px] bg-secondary border-border">
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                {vendors.map(v => (
                  <SelectItem key={v} value={v.toString()}>
                    {VENDOR_NAMES[v] || `Vendor ${v}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedPayment?.toString() || "all"}
              onValueChange={(value) => { setSelectedPayment(value === "all" ? null : parseInt(value)); setCurrentPage(1) }}
            >
              <SelectTrigger className="w-full sm:w-[160px] bg-secondary border-border">
                <SelectValue placeholder="Tipo de Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pagos</SelectItem>
                {paymentTypes.map(p => (
                  <SelectItem key={p} value={p.toString()}>
                    {PAYMENT_TYPE_NAMES[p] || `Tipo ${p}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchTerm || selectedVendor || selectedPayment) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchTerm("")
                  onSelectVendor(null)
                  setSelectedPayment(null)
                  setCurrentPage(1)
                }}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('tpep_pickup_datetime')}
                >
                  <span className="flex items-center">
                    Pickup {getSortIcon('tpep_pickup_datetime')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('VendorID')}
                >
                  <span className="flex items-center">
                    Proveedor {getSortIcon('VendorID')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('passenger_count')}
                >
                  <span className="flex items-center justify-end">
                    Pasajeros {getSortIcon('passenger_count')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('trip_distance')}
                >
                  <span className="flex items-center justify-end">
                    Distancia {getSortIcon('trip_distance')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('payment_type')}
                >
                  <span className="flex items-center">
                    Pago {getSortIcon('payment_type')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('total_amount')}
                >
                  <span className="flex items-center justify-end">
                    Total {getSortIcon('total_amount')}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {data.length === 0 ? 'Cargue un dataset para ver los datos' : 'No se encontraron resultados'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((trip, index) => (
                  <TableRow 
                    key={`${trip.tpep_pickup_datetime}-${index}`} 
                    className="border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs">
                      {trip.tpep_pickup_datetime}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${getVendorColor(trip.VendorID)}20`,
                          color: getVendorColor(trip.VendorID),
                          borderColor: getVendorColor(trip.VendorID)
                        }}
                        className="border text-xs"
                      >
                        {VENDOR_NAMES[trip.VendorID] || `V${trip.VendorID}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {trip.passenger_count}
                    </TableCell>
                    <TableCell className="text-right font-mono text-emerald-700">
                      {trip.trip_distance.toFixed(2)} mi
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${getPaymentTypeColor(trip.payment_type)}20`,
                          color: getPaymentTypeColor(trip.payment_type),
                          borderColor: getPaymentTypeColor(trip.payment_type)
                        }}
                        className="border text-xs"
                      >
                        {PAYMENT_TYPE_NAMES[trip.payment_type] || `T${trip.payment_type}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-teal-700">
                      ${trip.total_amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData.length)} de {filteredData.length.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
