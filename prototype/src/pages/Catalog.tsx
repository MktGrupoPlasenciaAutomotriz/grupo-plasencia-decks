import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { VEHICLES, MARCAS } from '../data/vehicles'
import VehicleCard from '../components/VehicleCard'
import { Button, SectionLabel } from '../components/ui/kit'
import { mxn } from '../lib/format'
import { useStore } from '../store/store'
import { getVehicle } from '../data/vehicles'

type Cond = 'todos' | 'nuevo' | 'seminuevo'
const CARROCERIAS = ['SUV', 'Sedán', 'Hatchback', 'Pickup'] as const

export default function Catalog() {
  const [sp, setSp] = useSearchParams()
  const { state, dispatch } = useStore()
  const [cond, setCond] = useState<Cond>('todos')
  const [marca, setMarca] = useState('todas')
  const [carro, setCarro] = useState('todas')
  const [maxPrecio, setMaxPrecio] = useState(1300000)
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(12)
  const showCompare = sp.get('compare') === '1'

  useEffect(() => {
    const c = sp.get('cond'); if (c === 'nuevo' || c === 'seminuevo') setCond(c)
  }, [sp])

  const filtered = useMemo(() => {
    return VEHICLES.filter(v => {
      if (cond !== 'todos' && v.condicion !== cond) return false
      if (marca !== 'todas' && v.marca !== marca) return false
      if (carro !== 'todas' && v.carroceria !== carro) return false
      if (v.precio > maxPrecio) return false
      if (q) {
        const hay = `${v.marca} ${v.modelo} ${v.version} ${v.uso.join(' ')} ${v.carroceria}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return true
    })
  }, [cond, marca, carro, maxPrecio, q])

  const compareItems = state.compareIds.map(getVehicle).filter(Boolean)
  const reset = () => { setCond('todos'); setMarca('todas'); setCarro('todas'); setMaxPrecio(1300000); setQ(''); setSp({}) }
  const activeFilters = (cond !== 'todos' ? 1 : 0) + (marca !== 'todas' ? 1 : 0) + (carro !== 'todas' ? 1 : 0) + (maxPrecio < 1300000 ? 1 : 0) + (q ? 1 : 0)

  const sel = 'gp-display text-[13px] font-semibold rounded-full border border-n300 bg-white px-3.5 py-2 outline-none cursor-pointer text-navy appearance-none hover:border-navy transition-colors'

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-10">
      {showCompare && compareItems.length >= 2 && <CompareTable />}

      <SectionLabel>Catálogo cross-marca</SectionLabel>
      <h1 className="gp-display font-extrabold text-navy text-[clamp(24px,3.5vw,34px)] tracking-tight">Encuentra por uso, no por logo</h1>

      {/* Filtros */}
      <div className="sticky top-16 z-30 bg-n100/90 backdrop-blur-sm py-4 mt-6 -mx-5 px-5 border-b border-n200">
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…"
            className="gp-display text-[13px] font-medium rounded-full border border-n300 bg-white px-4 py-2 outline-none text-navy w-full sm:w-48 focus:border-navy" />
          <select className={sel} value={cond} onChange={e => setCond(e.target.value as Cond)}>
            <option value="todos">Condición</option><option value="nuevo">Nuevos</option><option value="seminuevo">Seminuevos</option>
          </select>
          <select className={sel} value={marca} onChange={e => setMarca(e.target.value)}>
            <option value="todas">Marca</option>{MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className={sel} value={carro} onChange={e => setCarro(e.target.value)}>
            <option value="todas">Tipo</option>{CARROCERIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={sel} value={maxPrecio} onChange={e => setMaxPrecio(Number(e.target.value))}>
            <option value={1300000}>Precio máx.</option>
            <option value={350000}>{'< '}{mxn(350000)}</option>
            <option value={550000}>{'< '}{mxn(550000)}</option>
            <option value={750000}>{'< '}{mxn(750000)}</option>
          </select>
          {activeFilters > 0 && <button onClick={reset} className="gp-display text-[12px] font-bold text-red px-3 py-2">✕ Limpiar ({activeFilters})</button>}
          <span className="ml-auto text-[13px] text-n500 gp-tnum">{filtered.length} resultados</span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-n500">
          <div className="text-[40px] mb-3">🔍</div>
          <p className="gp-display font-bold text-navy text-lg">Sin resultados con esos filtros</p>
          <button onClick={reset} className="text-red font-semibold mt-2">Limpiar filtros</button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            {filtered.slice(0, shown).map(v => <VehicleCard key={v.id} v={v} />)}
          </div>
          {shown < filtered.length && (
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" onClick={() => setShown(s => s + 8)}>
                Ver más vehículos ({filtered.length - shown} restantes)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )

  function CompareTable() {
    const rows: [string, (v: NonNullable<ReturnType<typeof getVehicle>>) => string][] = [
      ['Precio', v => mxn(v.precio)],
      ['Condición', v => v.condicion],
      ['Año', v => String(v.anio)],
      ['Kilometraje', v => v.kilometraje === 0 ? '0 km' : `${v.kilometraje.toLocaleString('es-MX')} km`],
      ['Transmisión', v => v.transmision],
      ['Combustible', v => v.combustible],
      ['Rendimiento', v => `${v.rendimiento} km/l`],
      ['Garantía', v => `${v.garantiaMeses} meses`],
      ['Sucursal', v => v.sucursal.replace('Plasencia ', '')],
    ]
    return (
      <div className="mb-10 bg-white border border-n200 rounded-[16px] overflow-hidden">
        <div className="px-5 py-4 border-b border-n200 flex items-center justify-between">
          <h2 className="gp-display font-bold text-navy">Comparador</h2>
          <button onClick={() => setSp({})} className="text-[13px] text-n500 hover:text-navy">Cerrar ✕</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr>
              <th className="text-left p-4 text-n500 font-semibold w-32"></th>
              {compareItems.map(v => (
                <th key={v!.id} className="text-left p-4 min-w-[160px]">
                  <img src={v!.fotos[0]} className="w-full aspect-[16/10] object-cover rounded-lg mb-2" alt="" />
                  <div className="gp-display font-bold text-navy">{v!.marca} {v!.modelo}</div>
                  <button onClick={() => dispatch({ type: 'TOGGLE_COMPARE', payload: v!.id })} className="text-red text-[11px] font-semibold">Quitar</button>
                </th>
              ))}
            </tr></thead>
            <tbody>
              {rows.map(([label, fn]) => (
                <tr key={label} className="border-t border-n100">
                  <td className="p-4 gp-display font-semibold text-n500 uppercase text-[10px] tracking-wide">{label}</td>
                  {compareItems.map(v => <td key={v!.id} className="p-4 text-navy gp-tnum">{fn(v!)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
