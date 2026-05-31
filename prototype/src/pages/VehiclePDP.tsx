import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getVehicle, VEHICLES } from '../data/vehicles'
import type { Modalidad } from '../types'
import { mxn, km, generarFolio, uid } from '../lib/format'
import { mensualidadCredito, rentaArrendamiento, valuarTradeIn, PLAZOS_CREDITO, PLAZOS_LEASE, ENGANCHE_MIN_PCT } from '../lib/finance'
import { Badge, Button, Trust } from '../components/ui/kit'
import VehicleCard from '../components/VehicleCard'
import { useStore } from '../store/store'

export default function VehiclePDP() {
  const { id } = useParams()
  const nav = useNavigate()
  const { state, dispatch } = useStore()
  const v = getVehicle(id || '')

  const [foto, setFoto] = useState(0)
  const [modalidad, setModalidad] = useState<Modalidad>('credito')
  const [plazo, setPlazo] = useState(60)
  const [enganchePct, setEnganchePct] = useState(20)
  const [tradeOpen, setTradeOpen] = useState(false)
  const [confirmFolio, setConfirmFolio] = useState<string | null>(null)

  if (!v) return <div className="max-w-[1240px] mx-auto px-5 py-24 text-center text-n500">Vehículo no encontrado. <Link to="/catalogo" className="text-red font-semibold">Ver catálogo</Link></div>

  const tradeIn = state.tradeIns[0]
  const engancheBase = v.precio * (enganchePct / 100)
  const engancheTotal = engancheBase + (tradeIn?.ofertaEstimada || 0)
  const mens = modalidad === 'credito'
    ? mensualidadCredito(v.precio, Math.min(engancheTotal, v.precio), plazo)
    : rentaArrendamiento(v.precio, plazo)
  const similares = VEHICLES.filter(s => s.id !== v.id && s.carroceria === v.carroceria).slice(0, 4)

  function apartar() {
    const folio = generarFolio(v!.marca)
    dispatch({ type: 'ADD_DEAL', payload: {
      id: uid('deal'), folio, vehicleId: v!.id, modalidad,
      estado: 'apartado', apartadoMonto: 5000,
      mensualidad: modalidad !== 'contado' ? Math.round(mens) : undefined,
      plazoMeses: modalidad !== 'contado' ? plazo : undefined,
      tradeInId: tradeIn?.id, createdAt: Date.now(),
    }})
    if (!state.customer) dispatch({ type: 'SET_CUSTOMER', payload: { nombre: 'Cliente Demo', email: 'demo@plasencia.mx', telefono: '33 0000 0000', creditoPreaprobado: false, kycCompleto: false } })
    setConfirmFolio(folio)
  }

  function preaprobar() {
    dispatch({ type: 'SET_CUSTOMER', payload: { nombre: state.customer?.nombre || 'Cliente Demo', email: state.customer?.email || 'demo@plasencia.mx', telefono: state.customer?.telefono || '33 0000 0000', creditoPreaprobado: true, lineaCredito: Math.round(v!.precio * 0.85), kycCompleto: true } })
  }

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-8">
      {/* Breadcrumb */}
      <div className="text-[12px] text-n500 mb-5 flex gap-2">
        <Link to="/" className="hover:text-navy">Inicio</Link><span>/</span>
        <Link to="/catalogo" className="hover:text-navy">Catálogo</Link><span>/</span>
        <span className="text-navy font-medium">{v.marca} {v.modelo}</span>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
        {/* IZQUIERDA: galería + info */}
        <div>
          <div className="rounded-[16px] overflow-hidden bg-n100 aspect-[16/10] relative">
            <img src={v.fotos[foto]} alt={`${v.marca} ${v.modelo}`} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              {v.destacado && <Badge tone="gold">★ Destacado</Badge>}
              {v.condicion === 'seminuevo' ? <Badge tone="navy">Seminuevo certificado</Badge> : <Badge tone="green">0 km · Nuevo</Badge>}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {v.fotos.map((f, i) => (
              <button key={i} onClick={() => setFoto(i)} className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition ${foto === i ? 'border-navy' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={f} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 bg-white border border-n200 rounded-[16px] p-5">
            <Trust icon="✓">{v.condicion === 'seminuevo' ? `${v.inspeccionPuntos} puntos de inspección` : 'Unidad nueva de agencia'}</Trust>
            <Trust icon="✓">Garantía {v.garantiaMeses} meses</Trust>
            <Trust icon="✓">{v.condicion === 'seminuevo' ? `${v.historialDuenos} dueño · historial` : 'Factura de agencia'}</Trust>
            <Trust icon="✓">Devolución 7 días</Trust>
          </div>

          {/* Specs */}
          <h2 className="gp-display font-bold text-navy text-xl mt-8 mb-4">Especificaciones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-n200 rounded-[16px] overflow-hidden border border-n200">
            {[
              ['Año', v.anio], ['Kilometraje', km(v.kilometraje)], ['Transmisión', v.transmision],
              ['Combustible', v.combustible], ['Rendimiento', `${v.rendimiento} km/l`], ['Pasajeros', v.pasajeros],
              ['Color', v.color], ['Carrocería', v.carroceria], ['Sucursal', v.sucursal.replace('Plasencia ', '')],
            ].map(([k, val]) => (
              <div key={k as string} className="bg-white p-4">
                <div className="text-[11px] text-n500 uppercase tracking-wide gp-display font-semibold">{k}</div>
                <div className="text-[14px] text-navy font-semibold mt-0.5">{val}</div>
              </div>
            ))}
          </div>

          {/* Usos */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-[12px] text-n500 self-center">Ideal para:</span>
            {v.uso.map(u => <Badge key={u} tone="gray">{u}</Badge>)}
          </div>
        </div>

        {/* DERECHA: el COCKPIT (PDP-hub) */}
        <div className="lg:sticky lg:top-20">
          <div className="bg-white border border-n200 rounded-[18px] p-6 shadow-[0_8px_24px_rgba(15,26,46,.06)]">
            <div className="flex items-center gap-2 text-[12px] text-n500">
              <span className="gp-display font-extrabold uppercase tracking-wide text-n600">{v.marca}</span><span>·</span><span>{v.anio}</span>
            </div>
            <h1 className="gp-display font-extrabold text-navy text-[26px] leading-tight tracking-tight">{v.modelo}</h1>
            <p className="text-[13px] text-n500">{v.version}</p>

            <div className="mt-4 pb-4 border-b border-n200">
              <div className="gp-display font-black text-navy text-[32px] tracking-tight gp-tnum">{mxn(v.precio)}</div>
              {v.bono ? <div className="text-[12px] text-red font-semibold">Incluye bono de {mxn(v.bono)}</div> : null}
            </div>

            {/* Modalidad tabs */}
            <div className="mt-5">
              <div className="gp-display text-[11px] font-extrabold uppercase tracking-wider text-n500 mb-2">Cómo lo quieres</div>
              <div className="grid grid-cols-3 gap-1 bg-n100 p-1 rounded-[12px]">
                {(['contado', 'credito', 'arrendamiento'] as Modalidad[]).map(m => (
                  <button key={m} onClick={() => { setModalidad(m); setPlazo(m === 'arrendamiento' ? 36 : 60) }}
                    className={`gp-display text-[12px] font-bold py-2 rounded-[9px] capitalize transition ${modalidad === m ? 'bg-white text-navy shadow-sm' : 'text-n500 hover:text-navy'}`}>
                    {m === 'credito' ? 'Crédito' : m === 'arrendamiento' ? 'Arrendar' : 'Contado'}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculadora */}
            {modalidad !== 'contado' && (
              <div className="mt-5 space-y-4">
                {modalidad === 'credito' && (
                  <div>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-n600 font-medium">Enganche</span>
                      <span className="gp-tnum font-semibold text-navy">{mxn(engancheBase)} · {enganchePct}%</span>
                    </div>
                    <input type="range" min={ENGANCHE_MIN_PCT * 100} max={60} value={enganchePct}
                      onChange={e => setEnganchePct(Number(e.target.value))}
                      className="w-full accent-[#C8102E]" />
                  </div>
                )}
                <div>
                  <div className="text-[12px] text-n600 font-medium mb-1.5">Plazo</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(modalidad === 'credito' ? PLAZOS_CREDITO : PLAZOS_LEASE).map(p => (
                      <button key={p} onClick={() => setPlazo(p)}
                        className={`gp-display text-[12px] font-bold px-3 py-1.5 rounded-lg border transition ${plazo === p ? 'border-navy bg-navy text-white' : 'border-n300 text-n600 hover:border-navy'}`}>
                        {p}m
                      </button>
                    ))}
                  </div>
                </div>
                {tradeIn && (
                  <div className="flex items-center justify-between bg-success/8 rounded-lg px-3 py-2 text-[12px]">
                    <span className="text-success-deep font-semibold">♻ Tu {tradeIn.marca} {tradeIn.modelo} aplica</span>
                    <span className="gp-tnum font-bold text-success-deep">+{mxn(tradeIn.ofertaEstimada)}</span>
                  </div>
                )}
                <div className="bg-navy text-white rounded-[12px] p-4 text-center">
                  <div className="text-[11px] text-n300 uppercase tracking-wider gp-display font-bold">{modalidad === 'credito' ? 'Mensualidad estimada' : 'Renta mensual estimada'}</div>
                  <div className="gp-display font-black text-[28px] tracking-tight gp-tnum text-gold">{mxn(mens)}</div>
                  <div className="text-[11px] text-n400">{plazo} meses · {modalidad === 'credito' ? 'tasa 13.5% anual' : 'IVA incluido'}</div>
                </div>
              </div>
            )}

            {/* CTAs principales */}
            <div className="mt-5 space-y-2">
              <Button variant="conversion" size="lg" full onClick={apartar}>
                Apartar con {mxn(5000)} reembolsable
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => alert('Agenda de test drive (demo): elige fecha y sucursal.')}>Agendar cita</Button>
                <Button variant="outline" onClick={() => setTradeOpen(o => !o)}>Valuar mi auto</Button>
              </div>
              {!state.customer?.creditoPreaprobado ? (
                <Button variant="ghost" full onClick={preaprobar} className="text-accent-deep">Pre-aprobar crédito sin afectar buró →</Button>
              ) : (
                <div className="text-center text-[12px] text-success-deep font-semibold py-1">✓ Crédito pre-aprobado: línea {mxn(state.customer.lineaCredito || 0)}</div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-n100 flex items-center justify-between">
              <span className="text-[12px] text-n500">¿Dudas?</span>
              <button className="gp-display text-[13px] font-bold text-accent-deep flex items-center gap-1.5" onClick={() => alert('Plasi (IA institucional): ¡Hola! Soy Plasi. ¿Te ayudo con este ' + v.modelo + '? (demo)')}>
                💬 Preguntar a Plasi
              </button>
            </div>
          </div>

          {/* Trade-in inline */}
          {tradeOpen && <TradeInForm precioRef={v.precio} onDone={() => setTradeOpen(false)} />}
        </div>
      </div>

      {/* Similares */}
      <section className="mt-16">
        <h2 className="gp-display font-bold text-navy text-xl mb-5">Similares en el grupo</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {similares.map(s => <VehicleCard key={s.id} v={s} />)}
        </div>
      </section>

      {/* Confirmación de apartado */}
      {confirmFolio && (
        <div className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setConfirmFolio(null)}>
          <div className="bg-white rounded-[20px] p-8 max-w-md w-full text-center gp-fade-up" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-success/15 text-success-deep text-[28px] flex items-center justify-center mx-auto">✓</div>
            <h3 className="gp-display font-extrabold text-navy text-2xl mt-4">¡Apartado!</h3>
            <p className="text-[14px] text-n600 mt-2">Tu {v.marca} {v.modelo} está reservado. Depósito de {mxn(5000)} reembolsable.</p>
            <div className="bg-n100 rounded-[12px] p-3 mt-4">
              <div className="text-[11px] text-n500 uppercase tracking-wide gp-display font-bold">Folio</div>
              <div className="gp-display font-extrabold text-navy gp-tnum">{confirmFolio}</div>
            </div>
            <div className="mt-5 space-y-2">
              <Button variant="conversion" full onClick={() => nav('/cuenta')}>Ver en Mi Plasencia →</Button>
              <Button variant="ghost" full onClick={() => setConfirmFolio(null)}>Seguir explorando</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function TradeInForm({ precioRef, onDone }: { precioRef: number; onDone: () => void }) {
    const [m, setM] = useState(''); const [mo, setMo] = useState(''); const [a, setA] = useState(2020); const [k, setK] = useState(60000)
    return (
      <div className="bg-white border border-n200 rounded-[16px] p-5 mt-3 gp-fade-up">
        <h3 className="gp-display font-bold text-navy">Valúa tu auto actual</h3>
        <p className="text-[12px] text-n500 mb-3">La oferta aplica como enganche.</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={m} onChange={e => setM(e.target.value)} placeholder="Marca" className="border border-n300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy" />
          <input value={mo} onChange={e => setMo(e.target.value)} placeholder="Modelo" className="border border-n300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy" />
          <input type="number" value={a} onChange={e => setA(Number(e.target.value))} placeholder="Año" className="border border-n300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy" />
          <input type="number" value={k} onChange={e => setK(Number(e.target.value))} placeholder="Km" className="border border-n300 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy" />
        </div>
        <Button variant="primary" full className="mt-3" onClick={() => {
          const oferta = valuarTradeIn(precioRef * 0.8, a, k)
          dispatch({ type: 'ADD_TRADEIN', payload: { id: uid('ti'), marca: m || 'Mi auto', modelo: mo || '', anio: a, kmAprox: k, ofertaEstimada: oferta, createdAt: Date.now() } })
          onDone()
        }}>Obtener valuación</Button>
      </div>
    )
  }
}
