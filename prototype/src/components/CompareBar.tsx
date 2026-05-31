import { useStore } from '../store/store'
import { getVehicle } from '../data/vehicles'
import { Link } from 'react-router-dom'

export default function CompareBar() {
  const { state, dispatch } = useStore()
  if (state.compareIds.length === 0) return null
  const items = state.compareIds.map(getVehicle).filter(Boolean)

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="max-w-[1000px] mx-auto bg-navy text-white rounded-[16px] shadow-[0_24px_56px_rgba(15,26,46,.3)] p-3 pl-5 flex items-center gap-4 pointer-events-auto gp-fade-up">
        <span className="gp-display text-[11px] font-extrabold tracking-wider uppercase text-gold hidden sm:block">Comparar</span>
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {items.map(v => (
            <div key={v!.id} className="flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-2 py-1 shrink-0">
              <img src={v!.fotos[0]} alt="" className="w-7 h-7 rounded-full object-cover" />
              <span className="text-[12px] font-semibold whitespace-nowrap">{v!.marca} {v!.modelo}</span>
              <button onClick={() => dispatch({ type: 'TOGGLE_COMPARE', payload: v!.id })} className="text-n400 hover:text-white text-[14px] leading-none">×</button>
            </div>
          ))}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div key={i} className="shrink-0 text-[11px] text-n400 border border-dashed border-white/20 rounded-full px-3 py-2 whitespace-nowrap">+ agregar</div>
          ))}
        </div>
        <Link to="/catalogo?compare=1" className="gp-display bg-gold text-navy text-[13px] font-extrabold px-4 py-2.5 rounded-[10px] hover:brightness-105 transition shrink-0">
          Comparar {items.length}
        </Link>
      </div>
    </div>
  )
}
