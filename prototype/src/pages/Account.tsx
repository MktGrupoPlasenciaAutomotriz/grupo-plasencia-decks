import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/store'
import { getVehicle, VEHICLES } from '../data/vehicles'
import { mxn, uid } from '../lib/format'
import { estadoCuenta, valuarTradeIn } from '../lib/finance'
import { Button, Badge, SectionLabel } from '../components/ui/kit'
import VehicleCard from '../components/VehicleCard'
import type { Deal } from '../types'

type Tab = 'resumen' | 'compras' | 'financiamiento' | 'postventa' | 'renovacion' | 'perfil'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'resumen', label: 'Resumen', icon: '◆' },
  { id: 'compras', label: 'Compras', icon: '🚗' },
  { id: 'financiamiento', label: 'Crédito y Lease', icon: '💳' },
  { id: 'postventa', label: 'Postventa', icon: '🔧' },
  { id: 'renovacion', label: 'Renovación', icon: '♻️' },
  { id: 'perfil', label: 'Perfil', icon: '👤' },
]

const ESTADO: Record<string, { t: string; tone: 'gold' | 'green' | 'navy' | 'red' }> = {
  apartado: { t: 'Apartado', tone: 'gold' },
  enganche_pagado: { t: 'Enganche pagado', tone: 'navy' },
  credito_solicitado: { t: 'Crédito en revisión', tone: 'navy' },
  cita_agendada: { t: 'Entrega agendada', tone: 'green' },
  cerrado: { t: 'Comprado', tone: 'green' },
}

export default function Account() {
  const { state, dispatch } = useStore()
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const tab = (sp.get('t') as Tab) || 'resumen'
  const setTab = (t: Tab) => setSp({ t })

  const { customer, deals } = state
  const comprados = deals.filter(d => d.estado === 'cerrado' || d.estado === 'cita_agendada')
  const conFinanciamiento = comprados.filter(d => d.modalidad !== 'contado' && d.mensualidad)

  // Estado vacío total
  if (deals.length === 0 && !customer) {
    return (
      <div className="max-w-[700px] mx-auto px-5 py-24 text-center">
        <div className="text-[44px]">◆</div>
        <h1 className="gp-display font-extrabold text-navy text-2xl mt-3">Mi Plasencia</h1>
        <p className="text-n600 mt-2 max-w-md mx-auto">Aquí vivirá tu relación con el grupo: tus compras, crédito, arrendamiento, postventa y renovación. Una cuenta para todo tu ciclo automotriz.</p>
        <Link to="/catalogo" className="inline-block mt-6"><Button variant="conversion" size="lg">Explorar catálogo</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1080px] mx-auto px-5 py-10">
      <SectionLabel>Mi Plasencia</SectionLabel>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="gp-display font-extrabold text-navy text-[clamp(24px,3.5vw,32px)] tracking-tight">Hola, {customer?.nombre?.split(' ')[0] || 'Cliente'}</h1>
        {customer?.creditoPreaprobado && <Badge tone="green">✓ Crédito pre-aprobado · línea {mxn(customer.lineaCredito || 0)}</Badge>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mt-6 border-b border-n200 overflow-x-auto -mx-5 px-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`gp-display text-[13px] font-bold whitespace-nowrap px-4 py-3 border-b-2 transition-colors ${
              tab === t.id ? 'border-red text-navy' : 'border-transparent text-n500 hover:text-navy'
            }`}>
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === 'resumen' && <Resumen onTab={setTab} />}
        {tab === 'compras' && <Compras />}
        {tab === 'financiamiento' && <Financiamiento deals={conFinanciamiento} />}
        {tab === 'postventa' && <Postventa comprados={comprados} />}
        {tab === 'renovacion' && <Renovacion comprados={comprados} />}
        {tab === 'perfil' && <Perfil />}
      </div>

      <div className="mt-14 text-center">
        <button onClick={() => { if (confirm('¿Reiniciar el prototipo? Borra tu sesión de demo.')) { dispatch({ type: 'RESET' }); nav('/') } }} className="text-[12px] text-n400 hover:text-red">Reiniciar demo</button>
      </div>
    </div>
  )

  // ─────────── RESUMEN ───────────
  function Resumen({ onTab }: { onTab: (t: Tab) => void }) {
    const proxServicio = state.servicios.find(s => s.estado === 'agendado')
    const stats = [
      ['Vehículos en proceso', deals.filter(d => d.estado === 'apartado' || d.estado === 'enganche_pagado').length, 'compras'],
      ['Autos comprados', comprados.length, 'compras'],
      ['Planes activos', conFinanciamiento.length, 'financiamiento'],
      ['Pagos realizados', state.pagos.length, 'financiamiento'],
    ] as const
    return (
      <div className="gp-fade-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(([l, v, to]) => (
            <button key={l} onClick={() => onTab(to as Tab)} className="text-left bg-white border border-n200 rounded-[16px] p-5 hover:border-navy transition">
              <div className="text-[12px] text-n500 gp-display font-semibold uppercase tracking-wide">{l}</div>
              <div className="gp-display font-extrabold text-navy text-2xl mt-1 gp-tnum">{v}</div>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-5">
          {/* Próxima acción */}
          <div className="bg-navy text-white rounded-[16px] p-5">
            <div className="gp-display text-[11px] font-extrabold uppercase tracking-wider text-gold mb-2">Tu próxima acción</div>
            {deals.find(d => d.estado === 'apartado' || d.estado === 'enganche_pagado') ? (
              <>
                <p className="text-[14px] text-n200">Tienes una compra sin terminar. Complétala para asegurar tu unidad.</p>
                <Button variant="conversion" size="sm" className="mt-3" onClick={() => onTab('compras')}>Continuar compra →</Button>
              </>
            ) : proxServicio ? (
              <>
                <p className="text-[14px] text-n200">Servicio agendado: {proxServicio.tipo} el {proxServicio.fecha}.</p>
                <Button variant="outline" size="sm" className="mt-3 !text-white !border-white/30" onClick={() => onTab('postventa')}>Ver postventa →</Button>
              </>
            ) : (
              <>
                <p className="text-[14px] text-n200">Todo en orden. Explora el catálogo o agenda un servicio.</p>
                <Button variant="outline" size="sm" className="mt-3 !text-white !border-white/30" onClick={() => nav('/catalogo')}>Ver catálogo →</Button>
              </>
            )}
          </div>
          {/* El ciclo */}
          <div className="bg-white border border-n200 rounded-[16px] p-5">
            <div className="gp-display text-[11px] font-extrabold uppercase tracking-wider text-red mb-3">Tu ciclo con Plasencia</div>
            <div className="space-y-2.5">
              {[
                ['Comprar', comprados.length > 0],
                ['Financiar', conFinanciamiento.length > 0],
                ['Mantener', state.servicios.length > 0],
                ['Renovar', false],
              ].map(([l, done]) => (
                <div key={l as string} className="flex items-center gap-2.5 text-[13px]">
                  <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${done ? 'bg-success text-white' : 'bg-n200 text-n500'}`}>{done ? '✓' : '·'}</span>
                  <span className={done ? 'text-navy font-semibold' : 'text-n500'}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────── COMPRAS ───────────
  function Compras() {
    if (deals.length === 0) return <Empty icon="🚗" t="Aún no tienes compras" d="Aparta un auto desde el catálogo para empezar." />
    return (
      <div className="space-y-3 gp-fade-up">
        {deals.map(d => {
          const v = getVehicle(d.vehicleId); if (!v) return null
          const est = ESTADO[d.estado]
          return (
            <div key={d.id} className="bg-white border border-n200 rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img src={v.fotos[0]} alt="" className="w-full sm:w-32 aspect-[16/10] sm:aspect-square object-cover rounded-[12px]" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="gp-display font-bold text-navy">{v.marca} {v.modelo}</h3>
                  <Badge tone={est.tone}>{est.t}</Badge>
                </div>
                <p className="text-[12px] text-n500">{v.version} · Folio <span className="gp-tnum font-medium text-n700">{d.folio}</span></p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[13px]">
                  <span className="text-n600">Modalidad: <span className="text-navy font-semibold capitalize">{d.modalidad}</span></span>
                  {d.mensualidad ? <span className="text-n600">Mensualidad: <span className="text-success-deep font-semibold gp-tnum">{mxn(d.mensualidad)}</span></span> : null}
                  {d.citaFecha ? <span className="text-n600">Entrega: <span className="text-navy font-semibold">{d.citaFecha}</span></span> : null}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {(d.estado === 'apartado' || d.estado === 'enganche_pagado') && <Button variant="conversion" size="sm" onClick={() => nav(`/checkout/${d.id}`)}>{d.estado === 'apartado' ? 'Completar compra' : 'Continuar'}</Button>}
                {d.estado === 'cerrado' && <Button variant="primary" size="sm" onClick={() => dispatch({ type: 'UPDATE_DEAL', payload: { id: d.id, patch: { estado: 'cita_agendada', citaFecha: 'Sábado 11:00' } } })}>Agendar entrega</Button>}
                <Link to={`/auto/${v.id}`}><Button variant="ghost" size="sm" full>Ver auto</Button></Link>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ─────────── FINANCIAMIENTO ───────────
  function Financiamiento({ deals }: { deals: Deal[] }) {
    if (deals.length === 0) return <Empty icon="💳" t="Sin planes de financiamiento" d="Cuando compres a crédito o arrendamiento, aquí verás tu estado de cuenta y podrás pagar." />
    return (
      <div className="space-y-4 gp-fade-up">
        {deals.map(d => {
          const v = getVehicle(d.vehicleId); if (!v || !d.mensualidad || !d.plazoMeses) return null
          const pagosHechos = state.pagos.filter(p => p.dealId === d.id).length
          const ec = estadoCuenta(d.mensualidad, d.plazoMeses, pagosHechos)
          const pct = Math.round((ec.pagosHechos / ec.pagosTotales) * 100)
          const esLease = d.modalidad === 'arrendamiento'
          return (
            <div key={d.id} className="bg-white border border-n200 rounded-[16px] p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <img src={v.fotos[0]} alt="" className="w-14 h-14 rounded-[10px] object-cover" />
                  <div>
                    <h3 className="gp-display font-bold text-navy">{v.marca} {v.modelo}</h3>
                    <p className="text-[12px] text-n500">{esLease ? 'GP Autolease · Arrendamiento' : 'Plasencia Crédito'} · {d.plazoMeses} meses</p>
                  </div>
                </div>
                <Badge tone={esLease ? 'navy' : 'green'}>{esLease ? 'Arrendamiento' : 'Crédito'}</Badge>
              </div>

              {/* Progreso */}
              <div className="mt-4">
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="text-n600">{ec.pagosHechos} de {ec.pagosTotales} pagos</span>
                  <span className="gp-tnum font-semibold text-navy">{pct}%</span>
                </div>
                <div className="h-2 bg-n200 rounded-full overflow-hidden">
                  <div className="h-full bg-success transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[['Pagado', mxn(ec.pagado)], ['Saldo restante', mxn(ec.saldoRestante)], [esLease ? 'Renta mensual' : 'Mensualidad', mxn(d.mensualidad)]].map(([l, val]) => (
                  <div key={l} className="bg-n50 rounded-[10px] p-3">
                    <div className="text-[10px] text-n500 gp-display font-bold uppercase tracking-wide">{l}</div>
                    <div className="gp-display font-extrabold text-navy text-[15px] mt-0.5 gp-tnum">{val}</div>
                  </div>
                ))}
              </div>

              {ec.proximoPago > 0 ? (
                <div className="mt-4 flex items-center justify-between bg-navy text-white rounded-[12px] px-4 py-3">
                  <div>
                    <div className="text-[11px] text-gold gp-display font-bold uppercase tracking-wide">Próximo pago</div>
                    <div className="gp-display font-extrabold text-lg gp-tnum">{mxn(ec.proximoPago)}</div>
                  </div>
                  <Button variant="conversion" size="sm" onClick={() => {
                    dispatch({ type: 'ADD_PAYMENT', payload: { id: uid('pay'), dealId: d.id, concepto: esLease ? 'Renta mensual' : 'Mensualidad', monto: ec.proximoPago, fecha: 'Hoy', createdAt: Date.now() } })
                  }}>Pagar ahora</Button>
                </div>
              ) : (
                <div className="mt-4 bg-success/10 text-success-deep rounded-[12px] px-4 py-3 text-[13px] font-semibold text-center">✓ Plan liquidado. ¡Felicidades!</div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ─────────── POSTVENTA ───────────
  function Postventa({ comprados }: { comprados: Deal[] }) {
    const SERVICIOS = [
      { tipo: 'Servicio 10,000 km', costo: 3200 },
      { tipo: 'Servicio mayor', costo: 6800 },
      { tipo: 'Alineación y balanceo', costo: 1400 },
      { tipo: 'Cambio de llantas', costo: 9500 },
    ]
    const [sel, setSel] = useState<string>('')
    const misAutos = comprados.map(d => getVehicle(d.vehicleId)).filter(Boolean)

    return (
      <div className="gp-fade-up">
        {/* Agendar */}
        <div className="bg-white border border-n200 rounded-[16px] p-5">
          <h3 className="gp-display font-bold text-navy">Agendar servicio</h3>
          <p className="text-[13px] text-n500 mb-4">Tu auto, tu taller Plasencia, tu horario.</p>
          {misAutos.length === 0 ? (
            <p className="text-[13px] text-n500">Compra un auto para agendar servicios. <Link to="/catalogo" className="text-red font-semibold">Ver catálogo</Link></p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-2">
                {SERVICIOS.map(s => (
                  <button key={s.tipo} onClick={() => setSel(s.tipo)}
                    className={`text-left p-3 rounded-[12px] border transition ${sel === s.tipo ? 'border-navy bg-navy/5' : 'border-n200 hover:border-n400'}`}>
                    <div className="gp-display font-semibold text-navy text-[14px]">{s.tipo}</div>
                    <div className="text-[12px] text-n500 gp-tnum">desde {mxn(s.costo)}</div>
                  </button>
                ))}
              </div>
              <Button variant="conversion" className="mt-4" disabled={!sel} onClick={() => {
                const serv = SERVICIOS.find(s => s.tipo === sel)!
                const v = misAutos[0]!
                dispatch({ type: 'ADD_SERVICE', payload: { id: uid('srv'), vehicleId: v.id, tipo: sel, fecha: 'Próximo sábado 10:00', sucursal: v.sucursal, costo: serv.costo, estado: 'agendado', createdAt: Date.now() } })
                setSel('')
              }}>Agendar {sel || 'servicio'}</Button>
            </>
          )}
        </div>

        {/* Historial */}
        {state.servicios.length > 0 && (
          <div className="mt-5">
            <h3 className="gp-display font-bold text-navy mb-3">Historial de servicio</h3>
            <div className="space-y-2">
              {state.servicios.map(s => {
                const v = getVehicle(s.vehicleId)
                return (
                  <div key={s.id} className="bg-white border border-n200 rounded-[12px] p-4 flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-full grid place-items-center text-[15px] ${s.estado === 'completado' ? 'bg-success/15' : 'bg-gold/20'}`}>{s.estado === 'completado' ? '✓' : '🔧'}</span>
                    <div className="flex-1">
                      <div className="gp-display font-semibold text-navy text-[14px]">{s.tipo}</div>
                      <div className="text-[12px] text-n500">{v?.marca} {v?.modelo} · {s.fecha} · {s.sucursal.replace('Plasencia ', '')}</div>
                    </div>
                    <div className="text-right">
                      <div className="gp-tnum font-semibold text-navy text-[14px]">{mxn(s.costo)}</div>
                      <Badge tone={s.estado === 'completado' ? 'green' : 'gold'}>{s.estado === 'completado' ? 'Completado' : 'Agendado'}</Badge>
                    </div>
                    {s.estado === 'agendado' && (
                      <Button variant="ghost" size="sm" onClick={() => {
                        dispatch({ type: 'ADD_PAYMENT', payload: { id: uid('pay'), dealId: 'servicio', concepto: s.tipo, monto: s.costo, fecha: 'Hoy', createdAt: Date.now() } })
                        // marcar completado reusando ADD_SERVICE no aplica; usamos un truco: re-agendar como completado
                        dispatch({ type: 'ADD_SERVICE', payload: { ...s, id: uid('srv'), estado: 'completado' } })
                      }}>Marcar hecho</Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─────────── RENOVACIÓN ───────────
  function Renovacion({ comprados }: { comprados: Deal[] }) {
    if (comprados.length === 0) return <Empty icon="♻️" t="Renovación" d="Cuando tengas un auto con nosotros, aquí verás tu oferta de recompra con trade-in pre-calculado." />
    const v = getVehicle(comprados[0].vehicleId)!
    const oferta = valuarTradeIn(v.precio, v.anio, 60000)
    const sugeridos = VEHICLES.filter(x => x.condicion === 'nuevo' && x.id !== v.id && x.carroceria === v.carroceria).slice(0, 4)
    return (
      <div className="gp-fade-up">
        <div className="bg-navy text-white rounded-[18px] p-6 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 90% 0%, rgba(236,201,75,.14), transparent 60%)' }} />
          <div className="relative">
            <div className="gp-display text-[11px] font-extrabold uppercase tracking-wider text-gold mb-2">Tu oferta de renovación</div>
            <h3 className="gp-display font-extrabold text-2xl">Tu {v.marca} {v.modelo} vale hasta</h3>
            <div className="gp-display font-black text-[40px] text-gold tracking-tight gp-tnum mt-1">{mxn(oferta)}</div>
            <p className="text-[14px] text-n300 mt-2 max-w-md">Aplícalo como enganche de tu siguiente auto. El grupo conoce tu historial: renovar es más fácil que empezar de cero.</p>
          </div>
        </div>
        <h3 className="gp-display font-bold text-navy text-lg mt-8 mb-4">Tu siguiente Plasencia</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sugeridos.map(s => <VehicleCard key={s.id} v={s} />)}
        </div>
      </div>
    )
  }

  // ─────────── PERFIL ───────────
  function Perfil() {
    const [f, setF] = useState({
      nombre: customer?.nombre && customer.nombre !== 'Cliente Demo' ? customer.nombre : '',
      email: customer?.email && customer.email !== 'demo@plasencia.mx' ? customer.email : '',
      telefono: customer?.telefono && customer.telefono !== '33 0000 0000' ? customer.telefono : '',
      rfc: customer?.rfc || '',
      ingresos: customer?.ingresosMensuales ? String(customer.ingresosMensuales) : '',
    })
    const [saved, setSaved] = useState(false)
    return (
      <div className="gp-fade-up max-w-[640px]">
        <div className="bg-white border border-n200 rounded-[16px] p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-navy text-gold grid place-items-center gp-display font-black text-xl">{(f.nombre || 'C')[0].toUpperCase()}</div>
            <div>
              <h3 className="gp-display font-bold text-navy text-lg">{f.nombre || 'Tu perfil'}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {customer?.kycCompleto ? <Badge tone="green">✓ Identidad verificada</Badge> : <Badge tone="gold">KYC pendiente</Badge>}
                {customer?.creditoPreaprobado && <Badge tone="navy">Crédito pre-aprobado</Badge>}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {([['nombre', 'Nombre completo', 'text'], ['email', 'Correo', 'email'], ['telefono', 'Teléfono', 'tel'], ['rfc', 'RFC', 'text'], ['ingresos', 'Ingresos mensuales (MXN)', 'number']] as const).map(([k, ph, t]) => (
              <div key={k} className={k === 'ingresos' ? 'sm:col-span-2' : ''}>
                <label className="text-[11px] gp-display font-bold uppercase tracking-wide text-n500">{ph}</label>
                <input type={t} value={(f as any)[k]} onChange={e => { setF({ ...f, [k]: e.target.value }); setSaved(false) }}
                  className="w-full mt-1 border border-n300 rounded-[10px] px-3.5 py-2.5 text-[14px] outline-none focus:border-navy" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-5">
            <Button variant="conversion" onClick={() => {
              dispatch({ type: 'SET_CUSTOMER', payload: {
                nombre: f.nombre || 'Cliente Demo', email: f.email || 'demo@plasencia.mx', telefono: f.telefono || '33 0000 0000',
                rfc: f.rfc, ingresosMensuales: Number(f.ingresos) || undefined,
                creditoPreaprobado: customer?.creditoPreaprobado || false, lineaCredito: customer?.lineaCredito,
                kycCompleto: Boolean(f.nombre && f.rfc),
              }})
              setSaved(true)
            }}>Guardar cambios</Button>
            {saved && <span className="text-[13px] text-success-deep font-semibold gp-fade-up">✓ Guardado</span>}
          </div>
          <div className="mt-5 pt-4 border-t border-n100 flex items-center gap-2 text-[12px] text-n500">
            <span className="text-success-deep">🔒</span> Tus datos se gestionan bajo la política de privacidad de Grupo Plasencia. (Demo: se guardan localmente en tu navegador.)
          </div>
        </div>
      </div>
    )
  }

  function Empty({ icon, t, d }: { icon: string; t: string; d: string }) {
    return (
      <div className="text-center py-16 gp-fade-up">
        <div className="text-[40px]">{icon}</div>
        <h3 className="gp-display font-bold text-navy text-lg mt-2">{t}</h3>
        <p className="text-[13px] text-n500 max-w-sm mx-auto mt-1">{d}</p>
      </div>
    )
  }
}
