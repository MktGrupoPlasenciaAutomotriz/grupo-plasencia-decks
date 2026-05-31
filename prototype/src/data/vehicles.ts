import type { Vehicle, Sucursal } from '../types'

// ════════════════════════════════════════════════════════════════════
// Inventario del prototipo.
// Base: lista provista por Dirección (10 unidades) + relleno de catálogo.
// Stellantis se modela por SUB-MARCA (Jeep/RAM/Dodge) como marca visible,
// consistente con el schema real D1 (inventario_stellantis.submarca).
// Imágenes: fotografías reales (Unsplash CDN) curadas por modelo/carrocería.
// En producción, el feed real (Maxipublica/DCA) sustituye estas URLs.
// ════════════════════════════════════════════════════════════════════

// Pools de fotos reales (Unsplash) — TODAS verificadas con HTTP 200.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1100&q=80&auto=format&fit=crop`
const P = {
  mazdaSuvRojo: [u('1617814076367-b759c7d7e738'), u('1503376780353-7e6692767b70'), u('1494976388531-d1058494cdd8')],
  mazdaSuvGris: [u('1606664515524-ed2f786a0bd6'), u('1568844293986-8d0400bd4745'), u('1533473359331-0135ef1b58bf')],
  mazdaSedan:   [u('1549924231-f129b911e442'), u('1552519507-da3b142c6e3d'), u('1583121274602-3e2820c69888')],
  hyundaiSuv:   [u('1568605117036-5fe5e7bab0b7'), u('1581540222194-0def2dda95b8'), u('1580273916550-e323be2ae537')],
  jeepSuv:      [u('1610768764270-790fbec18178'), u('1619767886558-efdc259cde1a'), u('1533473359331-0135ef1b58bf')],
  ramPickup:    [u('1605893477799-b99e3b8b93fe'), u('1558618047-3c8c76ca7d13'), u('1610768764270-790fbec18178')],
  dodgeSedan:   [u('1542362567-b07e54358753'), u('1600712242805-5f78671b24da'), u('1502877338535-766e1452684a')],
  gacSuv:       [u('1619767886558-efdc259cde1a'), u('1580273916550-e323be2ae537'), u('1568605117036-5fe5e7bab0b7')],
}

export const SUCURSALES: Sucursal[] = [
  { id: 'lopez-mateos', nombre: 'Plasencia López Mateos', zona: 'Zapopan' },
  { id: 'otero', nombre: 'Plasencia Lote Otero', zona: 'Zapopan' },
  { id: 'lazaro', nombre: 'Plasencia Lázaro Cárdenas', zona: 'Guadalajara' },
  { id: 'tepic', nombre: 'Plasencia Tepic', zona: 'Nayarit' },
]

export const VEHICLES: Vehicle[] = [
  // ── 10 unidades de la lista de Dirección ──
  {
    id: 'v-001', marca: 'Mazda', modelo: 'CX-5', anio: 2024, version: 'i Grand Touring',
    precio: 514900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Rojo Cristal', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.mazdaSuvRojo, destacado: true, bono: 15000, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'carretera', 'premium'], rendimiento: '13.5', pasajeros: 5,
  },
  {
    id: 'v-002', marca: 'Hyundai', modelo: 'Tucson', anio: 2024, version: 'Limited',
    precio: 499900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Blanco Perla', sucursal: 'Plasencia Tepic', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.hyundaiSuv, destacado: true, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'ciudad', 'carretera'], rendimiento: '15.0', pasajeros: 5,
  },
  {
    id: 'v-003', marca: 'Jeep', modelo: 'Compass', anio: 2024, version: 'Limited',
    precio: 615000, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Negro Diamante', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.jeepSuv, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'aventura', 'carretera'], rendimiento: '12.8', pasajeros: 5,
  },
  {
    id: 'v-004', marca: 'RAM', modelo: '1500', anio: 2024, version: 'Laramie',
    precio: 1150000, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Acero', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'nuevo', carroceria: 'Pickup',
    fotos: P.ramPickup, destacado: true, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['trabajo', 'carretera', 'flotilla', 'premium'], rendimiento: '9.5', pasajeros: 5,
  },
  {
    id: 'v-005', marca: 'GAC', modelo: 'GS3', anio: 2024, version: 'GB',
    precio: 389900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Rojo Pasión', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.gacSuv, bono: 12000, garantiaMeses: 84, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['ciudad', 'primer auto', 'joven', 'economía'], rendimiento: '16.0', pasajeros: 5,
  },
  {
    id: 'v-006', marca: 'Mazda', modelo: 'Mazda3', anio: 2023, version: 'Sedán i Grand Touring',
    precio: 389000, kilometraje: 21500, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Azul Profundo', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'Sedán',
    fotos: P.mazdaSedan, destacado: true, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['ciudad', 'primer auto', 'premium'], rendimiento: '17.0', pasajeros: 5,
  },
  {
    id: 'v-007', marca: 'Hyundai', modelo: 'Tucson', anio: 2024, version: 'Limited Tech',
    precio: 520000, kilometraje: 0, transmision: 'Automática', combustible: 'Híbrido',
    color: 'Gris Titanio', sucursal: 'Plasencia Tepic', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.hyundaiSuv, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'carretera', 'premium'], rendimiento: '18.5', pasajeros: 5,
  },
  {
    id: 'v-008', marca: 'Dodge', modelo: 'Attitude', anio: 2024, version: 'SXT',
    precio: 319000, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Blanco', sucursal: 'Plasencia Lote Otero', condicion: 'nuevo', carroceria: 'Sedán',
    fotos: P.dodgeSedan, bono: 8000, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['ciudad', 'primer auto', 'economía'], rendimiento: '19.0', pasajeros: 5,
  },
  {
    id: 'v-009', marca: 'GAC', modelo: 'Emkoo', anio: 2024, version: 'GS',
    precio: 459900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Perla', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.gacSuv, bono: 15000, garantiaMeses: 84, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'ciudad'], rendimiento: '14.5', pasajeros: 5,
  },
  {
    id: 'v-010', marca: 'Mazda', modelo: 'CX-30', anio: 2024, version: 'i Sport',
    precio: 420000, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Meteoro', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: P.mazdaSuvGris, bono: 10000, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['ciudad', 'primer auto', 'familia'], rendimiento: '15.2', pasajeros: 5,
  },

  // ── Relleno de catálogo (densidad + variedad de seminuevos) ──
  {
    id: 'v-011', marca: 'Hyundai', modelo: 'Kona', anio: 2023, version: 'Limited',
    precio: 359900, kilometraje: 32000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Titanio', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'SUV',
    fotos: P.hyundaiSuv, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['ciudad', 'familia', 'primer auto'], rendimiento: '15.8', pasajeros: 5,
  },
  {
    id: 'v-012', marca: 'Jeep', modelo: 'Wrangler', anio: 2023, version: 'Sahara 4x4',
    precio: 949900, kilometraje: 28000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Verde Militar', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'seminuevo', carroceria: 'SUV',
    fotos: P.jeepSuv, garantiaMeses: 12, inspeccionPuntos: 200,
    historialDuenos: 1, uso: ['aventura', 'carretera', 'premium'], rendimiento: '8.9', pasajeros: 5,
  },
  {
    id: 'v-013', marca: 'Mazda', modelo: 'CX-5', anio: 2023, version: 'i Sport',
    precio: 449900, kilometraje: 24000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Polimetal', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'SUV',
    fotos: P.mazdaSuvGris, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['familia', 'carretera'], rendimiento: '13.0', pasajeros: 5,
  },
  {
    id: 'v-014', marca: 'RAM', modelo: '700', anio: 2024, version: 'Big Horn',
    precio: 389900, kilometraje: 0, transmision: 'Manual', combustible: 'Gasolina',
    color: 'Blanco', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'nuevo', carroceria: 'Pickup',
    fotos: P.ramPickup, bono: 12000, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['trabajo', 'flotilla', 'economía'], rendimiento: '14.0', pasajeros: 5,
  },
]

export const MARCAS = [...new Set(VEHICLES.map(v => v.marca))].sort()
export const getVehicle = (id: string) => VEHICLES.find(v => v.id === id)
