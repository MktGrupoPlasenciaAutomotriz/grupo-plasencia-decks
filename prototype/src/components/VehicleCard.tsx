import { Link } from 'react-router-dom'
import type { Vehicle } from '../types'
import { mxn, km } from '../lib/format'
import { mensualidadCredito } from '../lib/finance'
import { Badge } from './ui/kit'
import { useStore } from '../store/store'

export default function VehicleCard({ v }: { v: Vehicle }) {
  const { state, dispatch } = useStore()
  const comparing = state.compareIds.includes(v.id)
  const mens = mensualidadCredito(v.precio, v.precio * 0.2, 60)

  return (
    <Link to={`/auto/${v.id}`} className="group block">
      <article className="bg-white border border-n200 rounded-[16px] overflow-hidden transition-all duration-200 hover:shadow-[0_12px_32px_rgba(15,26,46,.12)] hover:-translate-y-0.5 hover:border-n300 h-full flex flex-col">
        <div className="relative aspect-[16/10] bg-n100 overflow-hidden">
          <img src={v.fotos[0]} alt={`${v.marca} ${v.modelo}`} loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1100&q=80' }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {v.destacado && <Badge tone="gold">★ Destacado</Badge>}
            {v.condicion === 'seminuevo'
              ? <Badge tone="navy">Seminuevo · {v.inspeccionPuntos} pts</Badge>
              : <Badge tone="green">Nuevo</Badge>}
            {v.bono ? <Badge tone="red">Bono {mxn(v.bono)}</Badge> : null}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); dispatch({ type: 'TOGGLE_COMPARE', payload: v.id }) }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold transition-all backdrop-blur ${
              comparing ? 'bg-navy text-white' : 'bg-white/85 text-navy hover:bg-white'
            }`}
            title="Comparar"
          >⇄</button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[11px] text-n500 mb-0.5">
            <span className="gp-display font-extrabold uppercase tracking-wide text-n600">{v.marca}</span>
            <span>·</span><span>{v.anio}</span>
          </div>
          <h3 className="gp-display font-bold text-navy text-[16px] leading-tight">{v.modelo}</h3>
          <p className="text-[12px] text-n500 mt-0.5">{v.version}</p>

          <div className="flex items-center gap-3 mt-3 text-[11px] text-n500">
            <span>{km(v.kilometraje)}</span><span>·</span>
            <span>{v.transmision}</span><span>·</span>
            <span>{v.rendimiento} km/l</span>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="gp-display font-extrabold text-navy text-[20px] tracking-tight gp-tnum">{mxn(v.precio)}</div>
                <div className="text-[11px] text-n500">o <span className="text-success-deep font-semibold gp-tnum">{mxn(mens)}</span>/mes</div>
              </div>
              <span className="text-[11px] text-n400 text-right max-w-[90px] leading-tight">{v.sucursal.replace('Plasencia ', '')}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
