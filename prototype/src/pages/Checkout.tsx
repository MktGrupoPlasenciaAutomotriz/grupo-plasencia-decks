import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/store'
import { getVehicle } from '../data/vehicles'
import { mxn } from '../lib/format'
import { mensualidadCredito, rentaArrendamiento } from '../lib/finance'
import { Button, Badge, Trust } from '../components/ui/kit'

const PASOS = ['Resumen', 'Tus datos', 'Enganche', 'Contrato', 'Listo']

export default function Checkout() {
  const { dealId } = useParams()
  const nav = useNavigate()
  const { state, dispatch } = useStore()
  const deal = state.deals.find(d => d.id === dealId)
  const v = deal ? getVehicle(deal.vehicleId) : null

  const [step, setStep] = useState(deal?.estado === 'apartado' ? 1 : deal?.estado === 'enganche_pagado' ? 3 : 1)
  const [kyc, setKyc] = useState({
    nombre: state.customer?.nombre && state.customer.nombre !== 'Cliente Demo' ? state.customer.nombre : '',
    email: state.customer?.email && state.customer.email !== 'demo@plasencia.mx' ? state.customer.email : '',
    telefono: '', rfc: '', ingresos: '',
  })
  const [acepta, setAcepta] = useState(false)
  const [seguros, setSeguros] = useState(true)

  if (!deal || !v) {
    return <div className="max-w-[700px] mx-auto px-5 py-24 text-center text-n500">Operación no encontrada. <Link to="/catalogo" className="text-red font-semibold">Ver catálogo</Link></div>
  }

  const esContado = deal.modalidad === 'contado'
  const enganche = deal.engancheMonto || Math.round(v.precio * 0.2)
  const mens = deal.mensualidad || (deal.modalidad === 'arrendamiento'
    ? Math.round(rentaArrendamiento(v.precio, deal.plazoMeses || 36))
    : Math.round(mensualidadCredito(v.precio, enganche, deal.plazoMeses || 60)))
  const seguroMensual = 1850
  const totalPagar = deal.modalidad === 'credito'
    ? enganche + mens * (deal.plazoMeses || 60)
    : deal.modalidad === 'arrendamiento'
    ? mens * (deal.plazoMeses || 36)
    : v.precio
  const pasos = esContado ? ['Resumen', 'Tus datos', 'Pago', 'Listo'] : PASOS

  function avanzar() {
    if (step === 2) {
      dispatch({ type: 'SET_CUSTOMER', payload: {
        nombre: kyc.nombre || 'Cliente Demo', email: kyc.email || 'demo@plasencia.mx',
        telefono: kyc.telefono || '33 0000 0000', rfc: kyc.rfc, ingresosMensuales: Number(kyc.ingresos) || undefined,
        creditoPreaprobado: true, lineaCredito: state.customer?.lineaCredito || Math.round(v!.precio * 0.85), kycCompleto: true,
      }})
    }
    if (step === 3) {
      dispatch({ type: 'UPDATE_DEAL', payload: { id: deal!.id, patch: { estado: 'enganche_pagado', engancheMonto: enganche, segurosBundle: seguros } } })
      if (esContado) { setStep(4); return }
    }
    if (step === 4 && !esContado) {
      dispatch({ type: 'UPDATE_DEAL', payload: { id: deal!.id, patch: { estado: 'cerrado', contratoAceptado: true } } })
    }
    setStep(s => s + 1)
  }

  return (
    <div className="max-w-[820px] mx-auto px-5 py-10">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {pasos.map((p, i) => (
          <div key={p} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full grid place-items-center gp-display font-bold text-[13px] transition ${
                i < step ? 'bg-success text-white' : i === step ? 'bg-navy text-white' : 'bg-n200 text-n500'
              }`}>{i < step ? '✓' : i + 1}</div>
              <span className={`text-[11px] gp-display font-semibold ${i === step ? 'text-navy' : 'text-n400'}`}>{p}</span>
            </div>
            {i < pasos.length - 1 && <div className={`h-0.5 flex-1 mx-2 ${i < step ? 'bg-success' : 'bg-n200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 items-start">
        {/* Panel principal */}
        <div className="bg-white border border-n200 rounded-[18px] p-6 min-h-[340px]">
          {step === 1 && (
            <div className="gp-fade-up">
              <h2 className="gp-display font-extrabold text-navy text-xl">Confirma tu operación</h2>
              <p className="text-[13px] text-n500 mb-4">Revisa el desglose antes de continuar.</p>
              <div className="flex gap-4 items-center bg-n50 rounded-[14px] p-4">
                <img src={v.fotos[0]} alt="" className="w-28 aspect-[16/10] object-cover rounded-[10px]" />
                <div>
                  <Badge tone={deal.modalidad === 'arrendamiento' ? 'navy' : 'green'}>{deal.modalidad}</Badge>
                  <h3 className="gp-display font-bold text-navy mt-1">{v.marca} {v.modelo}</h3>
                  <p className="text-[12px] text-n500">{v.version} · {v.anio}</p>
                </div>
              </div>
              <label className="flex items-center gap-3 mt-5 p-3 border border-n200 rounded-[12px] cursor-pointer hover:border-navy transition">
                <input type="checkbox" checked={seguros} onChange={e => setSeguros(e.target.checked)} className="w-4 h-4 accent-[#C8102E]" />
                <div className="flex-1">
                  <div className="gp-display font-semibold text-navy text-[14px]">Plasencia Seguros + Garantía extendida</div>
                  <div className="text-[12px] text-n500">Protección integral · {mxn(seguroMensual)}/mes</div>
                </div>
                <Badge tone="gold">Recomendado</Badge>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="gp-fade-up">
              <h2 className="gp-display font-extrabold text-navy text-xl">Tus datos</h2>
              <p className="text-[13px] text-n500 mb-4">Para tu expediente y pre-aprobación. <span className="text-success-deep">🔒 Datos protegidos · demo.</span></p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['nombre', 'Nombre completo', 'text'], ['email', 'Correo', 'email'],
                  ['telefono', 'Teléfono', 'tel'], ['rfc', 'RFC', 'text'],
                ].map(([k, ph, t]) => (
                  <input key={k} type={t} placeholder={ph}
                    value={(kyc as any)[k]} onChange={e => setKyc({ ...kyc, [k]: e.target.value })}
                    className="border border-n300 rounded-[10px] px-3.5 py-2.5 text-[14px] outline-none focus:border-navy" />
                ))}
                {!esContado && (
                  <input type="number" placeholder="Ingresos mensuales (MXN)"
                    value={kyc.ingresos} onChange={e => setKyc({ ...kyc, ingresos: e.target.value })}
                    className="border border-n300 rounded-[10px] px-3.5 py-2.5 text-[14px] outline-none focus:border-navy sm:col-span-2" />
                )}
              </div>
              {!esContado && (
                <div className="mt-4 bg-success/8 rounded-[12px] p-3 text-[13px] text-success-deep flex items-center gap-2">
                  ✓ Pre-aprobación sin afectar tu buró de crédito.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="gp-fade-up">
              <h2 className="gp-display font-extrabold text-navy text-xl">{esContado ? 'Pago' : 'Pago de enganche'}</h2>
              <p className="text-[13px] text-n500 mb-4">Monto: <strong className="text-navy">{mxn(esContado ? v.precio : enganche)}</strong></p>
              <div className="bg-amber/10 border border-amber/30 rounded-[10px] px-3 py-2 text-[12px] text-[#92660f] mb-4">
                ⚠ Demo · no se procesa ningún pago real ni se capturan datos bancarios.
              </div>
              <div className="space-y-3 opacity-90 pointer-events-none select-none">
                <div className="border border-n300 rounded-[10px] px-3.5 py-2.5 text-[14px] text-n500 flex justify-between"><span>Tarjeta terminación</span><span className="gp-tnum">•••• 4242</span></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-n300 rounded-[10px] px-3.5 py-2.5 text-[14px] text-n500">Vence 04/29</div>
                  <div className="border border-n300 rounded-[10px] px-3.5 py-2.5 text-[14px] text-n500">CVV •••</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[12px] text-n500"><span className="text-success-deep">🔒</span> Conexión segura simulada · 3 MSI disponibles</div>
            </div>
          )}

          {step === 4 && !esContado && (
            <div className="gp-fade-up">
              <h2 className="gp-display font-extrabold text-navy text-xl">{deal.modalidad === 'arrendamiento' ? 'Contrato de arrendamiento · GP Autolease' : 'Contrato de crédito · Plasencia Crédito'}</h2>
              <p className="text-[13px] text-n500 mb-4">Revisa y acepta los términos.</p>
              <div className="bg-n50 rounded-[12px] p-4 space-y-2 text-[13px]">
                {[
                  ['Vehículo', `${v.marca} ${v.modelo} ${v.anio}`],
                  [deal.modalidad === 'arrendamiento' ? 'Renta mensual' : 'Mensualidad', mxn(mens)],
                  ['Plazo', `${deal.plazoMeses} meses`],
                  ...(deal.modalidad === 'credito' ? [['Enganche', mxn(enganche)], ['Tasa', '13.5% anual fija']] as [string, string][] : []),
                  ['Total del plan', mxn(totalPagar)],
                ].map(([k, val]) => (
                  <div key={k} className="flex justify-between"><span className="text-n600">{k}</span><span className="gp-tnum font-semibold text-navy">{val}</span></div>
                ))}
              </div>
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#C8102E]" />
                <span className="text-[13px] text-n600">Acepto los términos del contrato, el aviso de privacidad y autorizo la consulta de crédito. <span className="text-n400">(demo)</span></span>
              </label>
            </div>
          )}

          {((step === 4 && esContado) || (step === 5 && !esContado)) && (
            <div className="gp-fade-up text-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/15 text-success-deep text-[32px] grid place-items-center mx-auto">✓</div>
              <h2 className="gp-display font-extrabold text-navy text-2xl mt-4">¡Listo, {state.customer?.nombre?.split(' ')[0] || 'cliente'}!</h2>
              <p className="text-[14px] text-n600 mt-2 max-w-sm mx-auto">Tu {v.marca} {v.modelo} es tuyo. Folio <span className="gp-tnum font-semibold">{deal.folio}</span>. Te esperamos en {v.sucursal.replace('Plasencia ', '')} para la entrega.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="conversion" onClick={() => { dispatch({ type: 'UPDATE_DEAL', payload: { id: deal.id, patch: { estado: 'cita_agendada', citaFecha: 'Sábado 11:00' } } }); nav('/cuenta') }}>Agendar entrega →</Button>
                <Button variant="outline" onClick={() => nav('/cuenta')}>Ir a Mi Plasencia</Button>
              </div>
            </div>
          )}

          {/* Nav */}
          {!((step === 4 && esContado) || (step === 5 && !esContado)) && (
            <div className="flex items-center justify-between mt-7 pt-5 border-t border-n100">
              <button onClick={() => step > 1 ? setStep(s => s - 1) : nav(-1)} className="gp-display text-[13px] font-bold text-n500 hover:text-navy">← Atrás</button>
              <Button variant="conversion"
                disabled={(step === 4 && !esContado && !acepta) || (step === 2 && !kyc.nombre)}
                onClick={avanzar}>
                {step === 3 ? `Pagar ${mxn(esContado ? v.precio : enganche)}` : step === 4 && !esContado ? 'Firmar contrato' : 'Continuar'}
              </Button>
            </div>
          )}
        </div>

        {/* Resumen lateral */}
        <aside className="bg-navy text-white rounded-[18px] p-5 md:sticky md:top-20">
          <div className="gp-display text-[11px] font-extrabold uppercase tracking-wider text-gold mb-3">Resumen</div>
          <div className="space-y-2.5 text-[13px]">
            <Row k="Precio" v={mxn(v.precio)} />
            {deal.tradeInId && <Row k="Trade-in" v={`-${mxn(state.tradeIns.find(t => t.id === deal.tradeInId)?.ofertaEstimada || 0)}`} green />}
            {!esContado && <Row k="Enganche" v={mxn(enganche)} />}
            {!esContado && <Row k={deal.modalidad === 'arrendamiento' ? 'Renta/mes' : 'Mensualidad'} v={mxn(mens)} gold />}
            {!esContado && <Row k="Plazo" v={`${deal.plazoMeses} meses`} />}
            {seguros && <Row k="Seguro/mes" v={mxn(seguroMensual)} />}
            <div className="border-t border-white/15 pt-2.5 mt-2.5">
              <Row k={esContado ? 'Total' : 'Total del plan'} v={mxn(totalPagar)} bold />
            </div>
          </div>
          <div className="mt-5 space-y-2 pt-4 border-t border-white/10">
            <Trust icon="✓"><span className="text-n300">Apartado reembolsable</span></Trust>
            <Trust icon="✓"><span className="text-n300">Devolución 7 días</span></Trust>
            <Trust icon="✓"><span className="text-n300">Garantía {v.garantiaMeses} meses</span></Trust>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ k, v, gold, green, bold }: { k: string; v: string; gold?: boolean; green?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-n400">{k}</span>
      <span className={`gp-tnum ${bold ? 'gp-display font-extrabold text-[18px]' : 'font-semibold'} ${gold ? 'text-gold' : green ? 'text-[#9AE6B4]' : 'text-white'}`}>{v}</span>
    </div>
  )
}
