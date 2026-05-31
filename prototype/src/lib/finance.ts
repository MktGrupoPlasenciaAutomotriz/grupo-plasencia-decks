// Motor financiero del Marketplace: crédito, arrendamiento, contado.
// Cifras ilustrativas de prototipo (tasas representativas del mercado MX 2026).

export const TASA_CREDITO_ANUAL = 0.135 // 13.5% anual
export const ENGANCHE_MIN_PCT = 0.20

// Pago mensual de crédito (amortización francesa)
export function mensualidadCredito(
  precio: number,
  engancheMonto: number,
  plazoMeses: number,
  tasaAnual = TASA_CREDITO_ANUAL,
): number {
  const capital = Math.max(precio - engancheMonto, 0)
  const i = tasaAnual / 12
  if (i === 0) return capital / plazoMeses
  return (capital * i) / (1 - Math.pow(1 + i, -plazoMeses))
}

// Arrendamiento puro (GP Autolease): renta mensual estimada.
// Modelo simplificado: % del valor + IVA, plazo típico 36-48 meses.
export function rentaArrendamiento(precio: number, plazoMeses: number): number {
  const factor = plazoMeses <= 24 ? 0.032 : plazoMeses <= 36 ? 0.026 : 0.022
  return precio * factor * 1.16
}

export const PLAZOS_CREDITO = [12, 24, 36, 48, 60]
export const PLAZOS_LEASE = [24, 36, 48]

// Valuación trade-in estimada (depreciación simple por antigüedad + km)
export function valuarTradeIn(precioRefNuevo: number, anio: number, kmAprox: number): number {
  const edad = Math.max(new Date().getFullYear() - anio, 0)
  const depAnio = Math.pow(0.86, edad)
  const depKm = Math.max(1 - (kmAprox / 200000) * 0.5, 0.4)
  return Math.round((precioRefNuevo * depAnio * depKm) / 1000) * 1000
}
