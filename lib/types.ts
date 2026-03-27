export interface MunicipioData {
  municipio: string
  departamento: string
  pobreza: number
  acceso_internet: number
  empleo_tech: number
}

export interface DepartamentoStats {
  departamento: string
  promedio_pobreza: number
  promedio_internet: number
  total_empleo_tech: number
  municipios_count: number
}

export interface FilterState {
  departamento: string | null
  searchTerm: string
  sortBy: keyof MunicipioData
  sortOrder: 'asc' | 'desc'
}

// Paleta de colores para departamentos
const COLOR_PALETTE = [
  '#059669', // Verde esmeralda oscuro
  '#10b981', // Verde esmeralda medio
  '#14b8a6', // Teal
  '#0d9488', // Teal oscuro
  '#22c55e', // Verde
  '#16a34a', // Verde oscuro
  '#84cc16', // Lima
  '#65a30d', // Lima oscuro
  '#06b6d4', // Cyan
  '#0891b2', // Cyan oscuro
]

// Colores predefinidos para departamentos comunes (nombres estandarizados en MAYUSCULAS)
export const DEPARTAMENTO_COLORS: Record<string, string> = {
  'ATLANTICO': '#059669',
  'GUAJIRA': '#10b981',
  'MAGDALENA': '#14b8a6',
  'CESAR': '#0d9488',
  'BOLIVAR': '#22c55e',
  'CORDOBA': '#16a34a',
  'SUCRE': '#84cc16',
  'ANTIOQUIA': '#65a30d',
  'CUNDINAMARCA': '#06b6d4',
  'VALLE CAUCA': '#0891b2',
  'SANTANDER': '#059669',
  'BOYACA': '#10b981',
  'NARINO': '#14b8a6',
  'CAUCA': '#0d9488',
  'HUILA': '#22c55e',
  'TOLIMA': '#16a34a',
  'META': '#84cc16',
  'CALDAS': '#65a30d',
  'RISARALDA': '#06b6d4',
  'QUINDIO': '#0891b2',
}

// Funcion para obtener color de un departamento (genera uno si no existe)
export function getDepartamentoColor(departamento: string): string {
  if (DEPARTAMENTO_COLORS[departamento]) {
    return DEPARTAMENTO_COLORS[departamento]
  }
  
  // Generar color basado en hash del nombre
  let hash = 0
  for (let i = 0; i < departamento.length; i++) {
    hash = departamento.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % COLOR_PALETTE.length
  DEPARTAMENTO_COLORS[departamento] = COLOR_PALETTE[index]
  
  return COLOR_PALETTE[index]
}
