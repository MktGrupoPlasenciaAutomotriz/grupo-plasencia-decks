import { Link, useLocation } from 'react-router-dom'
import { Logo } from './ui/kit'
import { useStore } from '../store/store'

const NAV = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/catalogo?cond=nuevo', label: 'Nuevos' },
  { to: '/catalogo?cond=seminuevo', label: 'Seminuevos' },
  { to: '/catalogo?mod=arrendamiento', label: 'Autolease' },
]

export default function Header() {
  const { state } = useStore()
  const loc = useLocation()
  const dealsCount = state.deals.length

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-n200">
      <div className="max-w-[1240px] mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link
              key={n.label}
              to={n.to}
              className={`gp-display text-[13px] font-semibold px-3 py-2 rounded-lg transition-colors ${
                loc.pathname + loc.search === n.to ? 'text-red' : 'text-n700 hover:text-navy hover:bg-n100'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cuenta"
            className="gp-display text-[13px] font-bold flex items-center gap-2 px-3.5 py-2 rounded-[10px] border border-n200 text-navy hover:border-navy hover:bg-n50 transition-colors"
          >
            <span className="text-[15px]">◆</span>
            <span className="hidden sm:inline">Mi Plasencia</span>
            {dealsCount > 0 && (
              <span className="bg-red text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{dealsCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
