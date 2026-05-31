import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import { getVehicle } from '../data/vehicles'
import { mxn } from '../lib/format'
import { Button, Badge, SectionLabel } from '../components/ui/kit'

const ESTADO_LABEL: Record<string, { t: string; tone: 'gold' | 'green' | 'navy' | 'red' }> = {
  apartado: { t: 'Apartado', tone: 'gold' },
  enganche_pagado: { t: 'Enganche pagado', tone: 'green' },
  credito_solicitado: { t: 'Crédito en revisión', tone: 'navy' },
  cita_agendada: { t: 'Cita agendada', tone: 'navy' },
  cerrado: { t: 'Cerrado', tone: 'green' },
}

export default function Account() {
  const { state, dispatch } = useStore()
  const nav = useNavigate()
  const { customer, deals, tradeIns } = state

  if (deals.length === 0 && !customer) {
    return (
      <div className="max-w-[700px] mx-auto px-5 py-24 text-center">
        <div className="text-[44px]">◆</div>
        <h1 className="gp-display font-extrabold text-navy text-2xl mt-3">Mi Plasencia</h1>
        <p className="text-n600 mt-2">Aquí vivirá tu relación con el grupo: tus apartados, compras, crédito, arrendamiento y postventa. Empieza apartando un auto.</p>
        <Link to="/catalogo" className="inline-block mt-6"><Button variant="conversion" size="lg">Explorar catálogo</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto px-5 py-10">
      <SectionLabel>Mi Plasencia</SectionLabel>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="gp-display font-extrabold text-navy text-[clamp(24px,3.5vw,32px)] tracking-tight">Hola, {customer?.nombre || 'Cliente'}</h1>
        {customer?.creditoPreaprobado && <Badge tone="green">✓ Crédito pre-aprobado · línea {mxn(customer.lineaCredito || 0)}</Badge>}
      </div>

      {/* Resumen */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          ['Vehículos en proceso', deals.length],
          ['Trade-ins valuados', tradeIns.length],
          ['KYC', customer?.kycCompleto ? 'Completo' : 'Pendiente'],
        ].map(([l, v]) => (
          <div key={l as string} className="bg-white border border-n200 rounded-[16px] p-5">
            <div className="text-[12px] text-n500 gp-display font-semibold uppercase tracking-wide">{l}</div>
            <div className="gp-display font-extrabold text-navy text-2xl mt-1 gp-tnum">{v}</div>
          </div>
        ))}
      </div>

      {/* Mis vehículos / deals */}
      <h2 className="gp-display font-bold text-navy text-xl mt-10 mb-4">Mis apartados y compras</h2>
      <div className="space-y-3">
        {deals.map(d => {
          const v = getVehicle(d.vehicleId)
          if (!v) return null
          const est = ESTADO_LABEL[d.estado]
          return (
            <div key={d.id} className="bg-white border border-n200 rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img src={v.fotos[0]} alt="" className="w-full sm:w-32 aspect-[16/10] sm:aspect-square object-cover rounded-[12px]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="gp-display font-bold text-navy">{v.marca} {v.modelo}</h3>
                  <Badge tone={est.tone}>{est.t}</Badge>
                </div>
                <p className="text-[12px] text-n500">{v.version} · Folio <span className="gp-tnum font-medium text-n700">{d.folio}</span></p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[13px]">
                  <span className="text-n600">Modalidad: <span className="text-navy font-semibold capitalize">{d.modalidad}</span></span>
                  {d.mensualidad ? <span className="text-n600">Mensualidad: <span className="text-success-deep font-semibold gp-tnum">{mxn(d.mensualidad)}</span></span> : null}
                  <span className="text-n600">Depósito: <span className="text-navy font-semibold gp-tnum">{mxn(d.apartadoMonto)}</span></span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {(d.estado === 'apartado' || d.estado === 'enganche_pagado') && (
                  <Button variant="conversion" size="sm" onClick={() => nav(`/checkout/${d.id}`)}>
                    {d.estado === 'apartado' ? 'Completar compra' : 'Continuar'}
                  </Button>
                )}
                {(d.estado === 'cerrado') && (
                  <Button variant="primary" size="sm" onClick={() => dispatch({ type: 'UPDATE_DEAL', payload: { id: d.id, patch: { estado: 'cita_agendada', citaFecha: 'Sábado 11:00' } } })}>
                    Agendar entrega
                  </Button>
                )}
                {d.estado === 'cita_agendada' && (
                  <div className="text-[12px] text-success-deep font-semibold text-center">✓ Entrega: {d.citaFecha}</div>
                )}
                <Link to={`/auto/${v.id}`}><Button variant="ghost" size="sm" full>Ver auto</Button></Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Otras secciones (placeholders del ciclo) */}
      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          ['💳', 'Mi crédito', 'Estado de cuenta y pagos'],
          ['🔧', 'Mi postventa', 'Servicios y refacciones'],
          ['♻️', 'Mi renovación', 'Recompra con tu historial'],
        ].map(([ic, h, d]) => (
          <div key={h} className="bg-white border border-dashed border-n300 rounded-[16px] p-5 opacity-80">
            <div className="text-[24px]">{ic}</div>
            <h3 className="gp-display font-bold text-navy mt-2">{h}</h3>
            <p className="text-[12px] text-n500">{d}</p>
            <span className="text-[11px] text-n400 gp-display font-bold uppercase tracking-wide mt-2 inline-block">Próximamente</span>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button onClick={() => { if (confirm('¿Reiniciar el prototipo? Borra tu sesión de demo.')) dispatch({ type: 'RESET' }) }} className="text-[12px] text-n400 hover:text-red">Reiniciar demo</button>
      </div>
    </div>
  )
}
