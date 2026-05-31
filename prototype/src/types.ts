// ============================================================
// Modelo de datos del Marketplace
// Vehicle sigue el shape real de D1 (inventario_seminuevos) + extensiones marketplace.
// Customer es la entidad NUEVA que conecta el CLTV (no existe en el backend hoy).
// ============================================================

export type Condicion = 'nuevo' | 'seminuevo' | 'demo'
export type Modalidad = 'contado' | 'credito' | 'arrendamiento'
export type Carroceria = 'SUV' | 'Sedán' | 'Hatchback' | 'Pickup' | 'Van'

export interface Vehicle {
  // Campos del schema real D1 (inventario_seminuevos)
  id: string
  marca: string
  modelo: string
  anio: number
  version: string
  precio: number
  kilometraje: number
  transmision: 'Automática' | 'Manual'
  combustible: 'Gasolina' | 'Híbrido' | 'Diésel' | 'Eléctrico'
  color: string
  sucursal: string
  // Extensiones marketplace
  condicion: Condicion
  carroceria: Carroceria
  fotos: string[]
  destacado?: boolean
  bono?: number
  garantiaMeses: number
  inspeccionPuntos: number
  historialDuenos: number
  uso: string[] // ['familia', 'ciudad', 'trabajo', 'primer auto', ...]
  rendimiento: string // km/l
  pasajeros: number
}

export interface Sucursal {
  id: string
  nombre: string
  zona: string
}

// ---- Entidades transaccionales (cuelgan del Customer) ----

export type DealEstado =
  | 'apartado'
  | 'enganche_pagado'
  | 'credito_solicitado'
  | 'cita_agendada'
  | 'cerrado'

export interface Deal {
  id: string
  folio: string // GP-{MARCA}-{YYMMDD}-{HHMMSS}
  vehicleId: string
  modalidad: Modalidad
  estado: DealEstado
  apartadoMonto: number
  engancheMonto?: number
  mensualidad?: number
  plazoMeses?: number
  tradeInId?: string
  citaFecha?: string
  contratoAceptado?: boolean
  segurosBundle?: boolean
  createdAt: number
}

export interface TradeIn {
  id: string
  marca: string
  modelo: string
  anio: number
  kmAprox: number
  ofertaEstimada: number
  createdAt: number
}

export interface ServiceEvent {
  id: string
  vehicleId: string
  tipo: string
  fecha: string
  estado: 'agendado' | 'completado'
}

export interface Customer {
  nombre: string
  email: string
  telefono: string
  creditoPreaprobado: boolean
  lineaCredito?: number
  kycCompleto: boolean
  rfc?: string
  ingresosMensuales?: number
}

export interface AppState {
  customer: Customer | null
  deals: Deal[]
  tradeIns: TradeIn[]
  servicios: ServiceEvent[]
  compareIds: string[]
}
