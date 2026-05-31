// Formato de moneda MXN y utilidades

export const mxn = (n: number, decimals = 0) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN',
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n)

export const km = (n: number) =>
  n === 0 ? 'Nuevo · 0 km' : `${new Intl.NumberFormat('es-MX').format(n)} km`

// Folio universal GP-{MARCA}-{YYMMDD}-{HHMMSS} (mismo formato que el backend real)
export function generarFolio(marca: string, date = new Date()): string {
  const m = marca.slice(0, 3).toUpperCase()
  const p = (x: number, l = 2) => String(x).padStart(l, '0')
  const yy = p(date.getFullYear() % 100)
  const stamp = `${yy}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
  return `GP-${m}-${stamp}`
}

export const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
