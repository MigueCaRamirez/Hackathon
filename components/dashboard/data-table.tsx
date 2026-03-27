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
import { MunicipioData, getDepartamentoColor } from "@/lib/types"
import { filterMunicipios, sortMunicipios } from "@/lib/data"

interface DataTableProps {
  data: MunicipioData[]
  selectedDepartamento: string | null
  onSelectDepartamento: (dept: string | null) => void
}

type SortField = keyof MunicipioData

export function DataTable({ data, selectedDepartamento, onSelectDepartamento }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortField>("municipio")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const departamentos = useMemo(() => {
    return [...new Set(data.map(m => m.departamento))].sort()
  }, [data])
  
  const filteredData = useMemo(() => {
    const filtered = filterMunicipios(data, selectedDepartamento, searchTerm)
    return sortMunicipios(filtered, sortBy, sortOrder)
  }, [data, selectedDepartamento, searchTerm, sortBy, sortOrder])
  
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  
  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sortOrder === 'asc' 
      ? <ArrowUp className="ml-1 h-3 w-3" /> 
      : <ArrowDown className="ml-1 h-3 w-3" />
  }
  
  const getPobrezaColor = (value: number) => {
    if (value < 30) return "text-green-700"
    if (value < 45) return "text-teal-600"
    return "text-emerald-600"
  }
  
  const getInternetColor = (value: number) => {
    if (value >= 70) return "text-green-700"
    if (value >= 50) return "text-teal-600"
    return "text-emerald-600"
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Datos por Municipio</CardTitle>
            <CardDescription>
              {filteredData.length} de {data.length} municipios
            </CardDescription>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar municipio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[200px] bg-secondary border-border"
              />
            </div>
            
            <Select
              value={selectedDepartamento || "all"}
              onValueChange={(value) => onSelectDepartamento(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-border">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departamentos.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchTerm || selectedDepartamento) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchTerm("")
                  onSelectDepartamento(null)
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
                  onClick={() => handleSort('municipio')}
                >
                  <span className="flex items-center">
                    Municipio {getSortIcon('municipio')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('departamento')}
                >
                  <span className="flex items-center">
                    Departamento {getSortIcon('departamento')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('pobreza')}
                >
                  <span className="flex items-center justify-end">
                    Pobreza (%) {getSortIcon('pobreza')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('acceso_internet')}
                >
                  <span className="flex items-center justify-end">
                    Internet (%) {getSortIcon('acceso_internet')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('empleo_tech')}
                >
                  <span className="flex items-center justify-end">
                    Empleos Tech {getSortIcon('empleo_tech')}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((municipio) => (
                  <TableRow 
                    key={municipio.municipio} 
                    className="border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell className="font-medium">{municipio.municipio}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${getDepartamentoColor(municipio.departamento)}20`,
                          color: getDepartamentoColor(municipio.departamento),
                          borderColor: getDepartamentoColor(municipio.departamento)
                        }}
                        className="border"
                      >
                        {municipio.departamento}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${getPobrezaColor(municipio.pobreza)}`}>
                      {municipio.pobreza.toFixed(1)}%
                    </TableCell>
                    <TableCell className={`text-right font-mono ${getInternetColor(municipio.acceso_internet)}`}>
                      {municipio.acceso_internet.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-lime-700">
                      {municipio.empleo_tech.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
