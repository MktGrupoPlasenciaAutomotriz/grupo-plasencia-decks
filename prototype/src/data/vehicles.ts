import type { Vehicle, Sucursal } from '../types'

// Fotos representativas (Unsplash CDN) por carrocería — prototipo.
const IMG = {
  suv: [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1000&q=80',
    'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1000&q=80',
  ],
  sedan: [
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=1000&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&q=80',
  ],
  hatch: [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1000&q=80',
  ],
  pickup: [
    'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=1000&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1000&q=80',
  ],
}

export const SUCURSALES: Sucursal[] = [
  { id: 'lopez-mateos', nombre: 'Plasencia López Mateos', zona: 'Zapopan' },
  { id: 'otero', nombre: 'Plasencia Lote Otero', zona: 'Zapopan' },
  { id: 'lazaro', nombre: 'Plasencia Lázaro Cárdenas', zona: 'Guadalajara' },
  { id: 'tepic', nombre: 'Plasencia Tepic', zona: 'Nayarit' },
]

export const VEHICLES: Vehicle[] = [
  {
    id: 'v-001', marca: 'Mazda', modelo: 'CX-30', anio: 2025, version: 'i Grand Touring',
    precio: 549900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Meteoro', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, destacado: true, bono: 20000, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'ciudad', 'primer auto'], rendimiento: '15.2', pasajeros: 5,
  },
  {
    id: 'v-002', marca: 'Hyundai', modelo: 'Tucson', anio: 2025, version: 'Limited Tech',
    precio: 629900, kilometraje: 0, transmision: 'Automática', combustible: 'Híbrido',
    color: 'Blanco Perla', sucursal: 'Plasencia Tepic', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, destacado: true, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'carretera'], rendimiento: '18.5', pasajeros: 5,
  },
  {
    id: 'v-003', marca: 'Jeep', modelo: 'Compass', anio: 2025, version: 'Limited 4x4',
    precio: 719900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Negro Diamante', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'aventura', 'carretera'], rendimiento: '12.8', pasajeros: 5,
  },
  {
    id: 'v-004', marca: 'GAC', modelo: 'GS3 Emzoom', anio: 2025, version: 'GB',
    precio: 419900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Rojo Pasión', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, bono: 15000, garantiaMeses: 84, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['ciudad', 'primer auto', 'joven'], rendimiento: '16.0', pasajeros: 5,
  },
  {
    id: 'v-005', marca: 'Mazda', modelo: 'Mazda3', anio: 2024, version: 's Sport Sedán',
    precio: 389900, kilometraje: 18500, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Azul Profundo', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'Sedán',
    fotos: IMG.sedan, destacado: true, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['ciudad', 'primer auto'], rendimiento: '17.0', pasajeros: 5,
  },
  {
    id: 'v-006', marca: 'Hyundai', modelo: 'Kona', anio: 2023, version: 'Limited',
    precio: 359900, kilometraje: 32000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Titanio', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'SUV',
    fotos: IMG.suv, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['ciudad', 'familia', 'primer auto'], rendimiento: '15.8', pasajeros: 5,
  },
  {
    id: 'v-007', marca: 'RAM', modelo: '1500', anio: 2024, version: 'Big Horn',
    precio: 899900, kilometraje: 12000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Plata', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'seminuevo', carroceria: 'Pickup',
    fotos: IMG.pickup, garantiaMeses: 12, inspeccionPuntos: 200,
    historialDuenos: 1, uso: ['trabajo', 'carretera', 'flotilla'], rendimiento: '9.5', pasajeros: 5,
  },
  {
    id: 'v-008', marca: 'Dodge', modelo: 'Attitude', anio: 2024, version: 'GT',
    precio: 289900, kilometraje: 9800, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Blanco', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'Sedán',
    fotos: IMG.sedan, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['ciudad', 'primer auto', 'economía'], rendimiento: '19.0', pasajeros: 5,
  },
  {
    id: 'v-009', marca: 'Mazda', modelo: 'CX-5', anio: 2025, version: 'i Grand Touring',
    precio: 689900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Rojo Cristal', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'carretera', 'premium'], rendimiento: '13.5', pasajeros: 5,
  },
  {
    id: 'v-010', marca: 'Hyundai', modelo: 'Grand i10', anio: 2025, version: 'GLS',
    precio: 269900, kilometraje: 0, transmision: 'Manual', combustible: 'Gasolina',
    color: 'Azul Cielo', sucursal: 'Plasencia Tepic', condicion: 'nuevo', carroceria: 'Hatchback',
    fotos: IMG.hatch, bono: 8000, garantiaMeses: 60, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['ciudad', 'primer auto', 'economía', 'joven'], rendimiento: '21.0', pasajeros: 5,
  },
  {
    id: 'v-011', marca: 'Jeep', modelo: 'Wrangler', anio: 2023, version: 'Sahara 4x4',
    precio: 949900, kilometraje: 28000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Verde Militar', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'seminuevo', carroceria: 'SUV',
    fotos: IMG.suv, garantiaMeses: 12, inspeccionPuntos: 200,
    historialDuenos: 1, uso: ['aventura', 'carretera', 'premium'], rendimiento: '8.9', pasajeros: 5,
  },
  {
    id: 'v-012', marca: 'GAC', modelo: 'Emkoo', anio: 2025, version: 'GS',
    precio: 489900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Perla', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, bono: 18000, garantiaMeses: 84, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'ciudad'], rendimiento: '14.5', pasajeros: 5,
  },
  {
    id: 'v-013', marca: 'Mazda', modelo: 'CX-50', anio: 2024, version: 'Signature',
    precio: 759900, kilometraje: 15000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Gris Polimetal', sucursal: 'Plasencia Lote Otero', condicion: 'seminuevo', carroceria: 'SUV',
    fotos: IMG.suv, destacado: true, garantiaMeses: 12, inspeccionPuntos: 200,
    historialDuenos: 1, uso: ['familia', 'aventura', 'premium'], rendimiento: '12.0', pasajeros: 5,
  },
  {
    id: 'v-014', marca: 'Hyundai', modelo: 'Elantra', anio: 2024, version: 'Limited',
    precio: 449900, kilometraje: 11000, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Negro', sucursal: 'Plasencia Tepic', condicion: 'seminuevo', carroceria: 'Sedán',
    fotos: IMG.sedan, garantiaMeses: 6, inspeccionPuntos: 167,
    historialDuenos: 1, uso: ['ciudad', 'carretera', 'trabajo'], rendimiento: '17.5', pasajeros: 5,
  },
  {
    id: 'v-015', marca: 'Fiat', modelo: 'Pulse', anio: 2025, version: 'Impetus',
    precio: 379900, kilometraje: 0, transmision: 'Automática', combustible: 'Gasolina',
    color: 'Rojo', sucursal: 'Plasencia Lázaro Cárdenas', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, bono: 10000, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['ciudad', 'joven', 'primer auto'], rendimiento: '16.5', pasajeros: 5,
  },
  {
    id: 'v-016', marca: 'Mazda', modelo: 'CX-90', anio: 2025, version: 'PHEV Signature',
    precio: 1289900, kilometraje: 0, transmision: 'Automática', combustible: 'Híbrido',
    color: 'Blanco Platino', sucursal: 'Plasencia López Mateos', condicion: 'nuevo', carroceria: 'SUV',
    fotos: IMG.suv, garantiaMeses: 36, inspeccionPuntos: 0,
    historialDuenos: 0, uso: ['familia', 'premium', 'carretera'], rendimiento: '22.0', pasajeros: 7,
  },
]

export const MARCAS = [...new Set(VEHICLES.map(v => v.marca))].sort()
export const getVehicle = (id: string) => VEHICLES.find(v => v.id === id)
