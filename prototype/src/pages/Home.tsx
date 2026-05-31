import { Link, useNavigate } from 'react-router-dom'
import { VEHICLES, MARCAS } from '../data/vehicles'
import VehicleCard from '../components/VehicleCard'
import { Button, SectionLabel } from '../components/ui/kit'

const SOLUCIONES = [
  { ic: '🚗', h: 'Comprar', d: 'Nuevos y seminuevos certificados de las 8 marcas del grupo, en un solo catálogo.' },
  { ic: '💳', h: 'Financiar', d: 'Plasencia Crédito: pre-aprobación en línea sin afectar tu buró.' },
  { ic: '🔑', h: 'Arrendar', d: 'GP Autolease: arrendamiento puro para personas y empresas.' },
  { ic: '🛡️', h: 'Asegurar', d: 'Seguros y garantía extendida, integrados a tu compra.' },
  { ic: '🔧', h: 'Mantener', d: 'Postventa, servicio y refacciones agendados desde tu cuenta.' },
  { ic: '♻️', h: 'Renovar', d: 'Tu auto actual se valúa en línea y aplica como enganche del siguiente.' },
]

const CICLO = [
  { n: '01', h: 'Descubre', d: 'Compara entre marcas por uso, no por logo.' },
  { n: '02', h: 'Decide', d: 'Calcula, valúa tu auto, pre-aprueba crédito.' },
  { n: '03', h: 'Aparta', d: 'Reserva con depósito reembolsable y paga el enganche en línea.' },
  { n: '04', h: 'Vive', d: 'Servicios, refacciones y postventa desde tu cuenta.' },
  { n: '05', h: 'Renueva', d: 'A los 5 años, recompra con tu historial. El ciclo se cierra.' },
]

export default function Home() {
  const nav = useNavigate()
  const destacados = VEHICLES.filter(v => v.destacado).slice(0, 4)

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="absolute inset-0 opacity-90"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 85% 0%, rgba(236,201,75,.14), transparent 60%), radial-gradient(ellipse 60% 55% at 0% 100%, rgba(200,16,46,.16), transparent 55%), #0F1A2E' }} />
        <div className="relative max-w-[1240px] mx-auto px-5 pt-20 pb-24">
          <div className="gp-display text-[11px] font-extrabold tracking-[3px] uppercase text-gold mb-5">Grupo Plasencia · 75 años · 8 marcas</div>
          <h1 className="gp-display font-black text-[clamp(34px,6vw,68px)] leading-[1.02] tracking-tight max-w-4xl">
            Toda tu vida automotriz,<br /><span className="text-gold">en un solo lugar.</span>
          </h1>
          <p className="text-[17px] text-n300 mt-6 max-w-2xl leading-relaxed">
            Compra, financia, arrienda, asegura y mantén tu auto con el respaldo de un grupo de 75 años. No eres un prospecto de una marca: eres cliente del grupo.
          </p>

          {/* Search box */}
          <div className="mt-9 bg-white rounded-[16px] p-2 flex flex-col sm:flex-row gap-2 max-w-2xl shadow-2xl">
            <input
              placeholder="Busca por marca, modelo o uso (ej. SUV familiar)…"
              className="flex-1 px-4 py-3.5 text-[15px] text-navy outline-none rounded-[10px]"
              onKeyDown={(e) => { if (e.key === 'Enter') nav('/catalogo') }}
            />
            <Button variant="conversion" size="lg" onClick={() => nav('/catalogo')}>Ver catálogo</Button>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-9">
            {[['✓', 'Precio justo, sin sorpresas'], ['✓', 'Seminuevos con 167 pts de inspección'], ['✓', 'Apartado reembolsable'], ['✓', 'Crédito sin afectar buró']].map(([i, t]) => (
              <div key={t} className="flex items-center gap-2 text-[13px] text-n300"><span className="text-gold font-bold">{i}</span>{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas strip */}
      <section className="border-b border-n200 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 py-6 flex items-center gap-x-8 gap-y-3 flex-wrap justify-center">
          <span className="gp-display text-[11px] font-bold uppercase tracking-wider text-n400">Las marcas del grupo</span>
          {MARCAS.map(m => <span key={m} className="gp-display font-extrabold text-n600 text-[15px]">{m}</span>)}
        </div>
      </section>

      {/* Soluciones */}
      <section className="max-w-[1240px] mx-auto px-5 py-20">
        <SectionLabel>La enchilada completa</SectionLabel>
        <h2 className="gp-display font-extrabold text-navy text-[clamp(26px,4vw,40px)] tracking-tight max-w-2xl">Seis soluciones. Una sola cuenta. Una relación de cinco años.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {SOLUCIONES.map(s => (
            <div key={s.h} className="bg-white border border-n200 rounded-[16px] p-6 hover:shadow-[0_12px_32px_rgba(15,26,46,.10)] hover:border-n300 transition-all">
              <div className="text-[28px]">{s.ic}</div>
              <h3 className="gp-display font-bold text-navy text-[18px] mt-3">{s.h}</h3>
              <p className="text-[13px] text-n600 leading-relaxed mt-1.5">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-white border-y border-n200">
        <div className="max-w-[1240px] mx-auto px-5 py-20">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <SectionLabel>Destacados de la semana</SectionLabel>
              <h2 className="gp-display font-extrabold text-navy text-[clamp(24px,3.5vw,34px)] tracking-tight">Cross-marca, en un solo lugar</h2>
            </div>
            <Link to="/catalogo" className="hidden sm:block"><Button variant="outline">Ver todo el catálogo →</Button></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destacados.map(v => <VehicleCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* Ciclo del auto */}
      <section className="max-w-[1240px] mx-auto px-5 py-20">
        <SectionLabel>El ciclo del auto, capturado</SectionLabel>
        <h2 className="gp-display font-extrabold text-navy text-[clamp(24px,3.5vw,36px)] tracking-tight max-w-3xl">Comprar un auto no es un evento. Es una relación que el grupo acompaña completa.</h2>
        <div className="grid md:grid-cols-5 gap-4 mt-10">
          {CICLO.map((c, i) => (
            <div key={c.n} className="relative">
              <div className="gp-display font-black text-[40px] text-n200 leading-none">{c.n}</div>
              <h3 className="gp-display font-bold text-navy text-[17px] mt-1">{c.h}</h3>
              <p className="text-[13px] text-n600 leading-relaxed mt-1">{c.d}</p>
              {i < CICLO.length - 1 && <div className="hidden md:block absolute top-5 -right-2 text-n300">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1240px] mx-auto px-5 pb-8">
        <div className="rounded-[22px] bg-navy text-white p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(236,201,75,.14), transparent 60%)' }} />
          <div className="relative">
            <h2 className="gp-display font-extrabold text-[clamp(24px,4vw,38px)] tracking-tight">Empieza por el auto. Quédate por el grupo.</h2>
            <p className="text-n300 mt-3 max-w-xl mx-auto">Explora el catálogo cross-marca y vive la experiencia automotriz como debe ser en la era digital.</p>
            <div className="mt-7"><Button variant="conversion" size="lg" onClick={() => nav('/catalogo')}>Explorar catálogo</Button></div>
          </div>
        </div>
      </section>
    </div>
  )
}
