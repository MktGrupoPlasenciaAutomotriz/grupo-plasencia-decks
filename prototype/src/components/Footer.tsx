import { Link } from 'react-router-dom'
import { Logo } from './ui/kit'

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-n300 mt-20">
      <div className="max-w-[1240px] mx-auto px-5 py-14">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
          <div>
            <Logo dark />
            <p className="text-[13px] leading-relaxed mt-4 max-w-xs text-n400">
              La experiencia automotriz completa de Grupo Plasencia en un solo lugar: comprar, financiar, arrendar, asegurar y vivir tu auto. Una relación, no una transacción.
            </p>
          </div>
          {[
            { h: 'Comprar', items: ['Autos nuevos', 'Seminuevos certificados', 'Comparar', 'Valuar mi auto'] },
            { h: 'Soluciones', items: ['Plasencia Crédito', 'GP Autolease', 'Plasencia Seguros', 'Postventa'] },
            { h: 'Grupo Plasencia', items: ['8 marcas · 42 agencias', '75 años', 'Sucursales', 'Contacto'] },
          ].map(col => (
            <div key={col.h}>
              <div className="gp-display text-[11px] font-extrabold tracking-wider uppercase text-gold mb-3">{col.h}</div>
              <ul className="space-y-2">
                {col.items.map(i => (
                  <li key={i}><span className="text-[13px] text-n400 hover:text-white transition-colors cursor-pointer">{i}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-[11px] text-n500">
          <span>Grupo Plasencia Automotriz · Prototipo de producto · Mayo 2026</span>
          <Link to="/" className="text-gold hover:underline">Marketplace · la experiencia ideal</Link>
        </div>
      </div>
    </footer>
  )
}
