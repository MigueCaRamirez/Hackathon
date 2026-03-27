import { MunicipioData, DepartamentoStats } from './types'

// Dataset de ejemplo - puede ser reemplazado al subir un archivo
export const defaultMunicipiosData: MunicipioData[] = [
  { municipio: "Municipio_1", departamento: "Atlántico", pobreza: 20.36, acceso_internet: 51.65, empleo_tech: 243 },
  { municipio: "Municipio_2", departamento: "La Guajira", pobreza: 48.36, acceso_internet: 46.48, empleo_tech: 509 },
  { municipio: "Municipio_3", departamento: "La Guajira", pobreza: 38.83, acceso_internet: 34.44, empleo_tech: 921 },
  { municipio: "Municipio_4", departamento: "Magdalena", pobreza: 50.58, acceso_internet: 39.13, empleo_tech: 824 },
  { municipio: "Municipio_5", departamento: "La Guajira", pobreza: 38.70, acceso_internet: 39.70, empleo_tech: 605 },
  { municipio: "Municipio_6", departamento: "Atlántico", pobreza: 30.76, acceso_internet: 86.32, empleo_tech: 726 },
  { municipio: "Municipio_7", departamento: "Magdalena", pobreza: 53.27, acceso_internet: 52.27, empleo_tech: 850 },
  { municipio: "Municipio_8", departamento: "Cesar", pobreza: 42.05, acceso_internet: 33.00, empleo_tech: 656 },
  { municipio: "Municipio_9", departamento: "La Guajira", pobreza: 22.80, acceso_internet: 74.46, empleo_tech: 137 },
  { municipio: "Municipio_10", departamento: "Atlántico", pobreza: 38.90, acceso_internet: 47.92, empleo_tech: 250 },
  { municipio: "Municipio_11", departamento: "Cesar", pobreza: 49.71, acceso_internet: 42.26, empleo_tech: 575 },
  { municipio: "Municipio_12", departamento: "Atlántico", pobreza: 27.68, acceso_internet: 88.91, empleo_tech: 538 },
  { municipio: "Municipio_13", departamento: "La Guajira", pobreza: 38.57, acceso_internet: 83.58, empleo_tech: 432 },
  { municipio: "Municipio_14", departamento: "Magdalena", pobreza: 29.21, acceso_internet: 75.56, empleo_tech: 624 },
  { municipio: "Municipio_15", departamento: "La Guajira", pobreza: 40.33, acceso_internet: 69.07, empleo_tech: 476 },
  { municipio: "Municipio_16", departamento: "La Guajira", pobreza: 28.34, acceso_internet: 32.38, empleo_tech: 415 },
  { municipio: "Municipio_17", departamento: "La Guajira", pobreza: 21.97, acceso_internet: 78.83, empleo_tech: 827 },
  { municipio: "Municipio_18", departamento: "La Guajira", pobreza: 40.75, acceso_internet: 75.75, empleo_tech: 523 },
  { municipio: "Municipio_19", departamento: "Atlántico", pobreza: 26.89, acceso_internet: 57.32, empleo_tech: 737 },
  { municipio: "Municipio_20", departamento: "Magdalena", pobreza: 35.85, acceso_internet: 61.91, empleo_tech: 143 },
  { municipio: "Municipio_21", departamento: "La Guajira", pobreza: 24.29, acceso_internet: 36.56, empleo_tech: 560 },
  { municipio: "Municipio_22", departamento: "Atlántico", pobreza: 40.39, acceso_internet: 38.76, empleo_tech: 982 },
  { municipio: "Municipio_23", departamento: "La Guajira", pobreza: 24.09, acceso_internet: 60.53, empleo_tech: 906 },
  { municipio: "Municipio_24", departamento: "Magdalena", pobreza: 31.55, acceso_internet: 42.94, empleo_tech: 703 },
  { municipio: "Municipio_25", departamento: "Cesar", pobreza: 29.27, acceso_internet: 84.99, empleo_tech: 724 },
  { municipio: "Municipio_26", departamento: "Atlántico", pobreza: 58.71, acceso_internet: 57.73, empleo_tech: 353 },
  { municipio: "Municipio_27", departamento: "Magdalena", pobreza: 31.13, acceso_internet: 37.94, empleo_tech: 937 },
  { municipio: "Municipio_28", departamento: "La Guajira", pobreza: 29.34, acceso_internet: 75.85, empleo_tech: 838 },
  { municipio: "Municipio_29", departamento: "La Guajira", pobreza: 23.66, acceso_internet: 42.76, empleo_tech: 517 },
  { municipio: "Municipio_30", departamento: "Cesar", pobreza: 42.80, acceso_internet: 34.46, empleo_tech: 271 },
  { municipio: "Municipio_31", departamento: "Magdalena", pobreza: 36.72, acceso_internet: 35.73, empleo_tech: 510 },
  { municipio: "Municipio_32", departamento: "Magdalena", pobreza: 34.71, acceso_internet: 39.73, empleo_tech: 796 },
  { municipio: "Municipio_33", departamento: "Magdalena", pobreza: 52.52, acceso_internet: 51.39, empleo_tech: 685 },
  { municipio: "Municipio_34", departamento: "La Guajira", pobreza: 31.59, acceso_internet: 35.72, empleo_tech: 408 },
  { municipio: "Municipio_35", departamento: "Atlántico", pobreza: 48.70, acceso_internet: 38.60, empleo_tech: 701 },
  { municipio: "Municipio_36", departamento: "Magdalena", pobreza: 44.52, acceso_internet: 85.86, empleo_tech: 639 },
  { municipio: "Municipio_37", departamento: "Magdalena", pobreza: 37.08, acceso_internet: 64.60, empleo_tech: 143 },
  { municipio: "Municipio_38", departamento: "Magdalena", pobreza: 50.07, acceso_internet: 80.38, empleo_tech: 101 },
  { municipio: "Municipio_39", departamento: "Magdalena", pobreza: 37.11, acceso_internet: 67.40, empleo_tech: 438 },
  { municipio: "Municipio_40", departamento: "Cesar", pobreza: 37.14, acceso_internet: 49.47, empleo_tech: 227 },
  { municipio: "Municipio_41", departamento: "Cesar", pobreza: 34.48, acceso_internet: 73.68, empleo_tech: 706 },
  { municipio: "Municipio_42", departamento: "La Guajira", pobreza: 26.13, acceso_internet: 61.36, empleo_tech: 510 },
  { municipio: "Municipio_43", departamento: "Magdalena", pobreza: 57.49, acceso_internet: 74.21, empleo_tech: 952 },
  { municipio: "Municipio_44", departamento: "Cesar", pobreza: 56.66, acceso_internet: 39.92, empleo_tech: 642 },
  { municipio: "Municipio_45", departamento: "Atlántico", pobreza: 51.28, acceso_internet: 71.22, empleo_tech: 971 },
  { municipio: "Municipio_46", departamento: "Atlántico", pobreza: 44.65, acceso_internet: 55.61, empleo_tech: 164 },
  { municipio: "Municipio_47", departamento: "Magdalena", pobreza: 21.44, acceso_internet: 73.71, empleo_tech: 250 },
  { municipio: "Municipio_48", departamento: "La Guajira", pobreza: 46.17, acceso_internet: 75.38, empleo_tech: 710 },
  { municipio: "Municipio_49", departamento: "Magdalena", pobreza: 25.19, acceso_internet: 53.86, empleo_tech: 920 },
  { municipio: "Municipio_50", departamento: "La Guajira", pobreza: 31.77, acceso_internet: 85.51, empleo_tech: 743 }
]

export function getDepartamentos(data: MunicipioData[]): string[] {
  return [...new Set(data.map(m => m.departamento))].sort()
}

export function getDepartamentoStats(data: MunicipioData[]): DepartamentoStats[] {
  const departamentos = getDepartamentos(data)
  
  return departamentos.map(dept => {
    const municipios = data.filter(m => m.departamento === dept)
    return {
      departamento: dept,
      promedio_pobreza: Number((municipios.reduce((acc, m) => acc + m.pobreza, 0) / municipios.length).toFixed(2)),
      promedio_internet: Number((municipios.reduce((acc, m) => acc + m.acceso_internet, 0) / municipios.length).toFixed(2)),
      total_empleo_tech: municipios.reduce((acc, m) => acc + m.empleo_tech, 0),
      municipios_count: municipios.length
    }
  })
}

export function getGeneralStats(data: MunicipioData[]) {
  const totalMunicipios = data.length
  if (totalMunicipios === 0) {
    return {
      totalMunicipios: 0,
      totalDepartamentos: 0,
      promedioPobreza: 0,
      promedioInternet: 0,
      totalEmpleoTech: 0,
      promedioEmpleoTech: 0
    }
  }
  
  const promedioPobreza = Number((data.reduce((acc, m) => acc + m.pobreza, 0) / totalMunicipios).toFixed(2))
  const promedioInternet = Number((data.reduce((acc, m) => acc + m.acceso_internet, 0) / totalMunicipios).toFixed(2))
  const totalEmpleoTech = data.reduce((acc, m) => acc + m.empleo_tech, 0)
  
  return {
    totalMunicipios,
    totalDepartamentos: getDepartamentos(data).length,
    promedioPobreza,
    promedioInternet,
    totalEmpleoTech,
    promedioEmpleoTech: Math.round(totalEmpleoTech / totalMunicipios)
  }
}

export function filterMunicipios(
  data: MunicipioData[],
  departamento: string | null,
  searchTerm: string
): MunicipioData[] {
  return data.filter(m => {
    const matchDept = !departamento || m.departamento === departamento
    const matchSearch = !searchTerm || 
      m.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    return matchDept && matchSearch
  })
}

export function sortMunicipios(
  data: MunicipioData[],
  sortBy: keyof MunicipioData,
  sortOrder: 'asc' | 'desc'
): MunicipioData[] {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number)
  })
}
