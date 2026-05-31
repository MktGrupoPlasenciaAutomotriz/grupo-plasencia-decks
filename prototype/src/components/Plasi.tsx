import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ============================================================
// Plasi · Asistente IA institucional (widget conversacional)
// Demo: respuestas guionadas por intención. En producción se conecta
// al endpoint real de Plasi (Claude Sonnet 4.5 + inventario por turn).
// ============================================================

interface Msg { from: 'plasi' | 'user'; text: string }

const SUGERENCIAS = [
  '¿Cuál SUV me conviene para familia?',
  '¿Cómo funciona el apartado?',
  '¿Qué necesito para el crédito?',
  'Diferencia entre comprar y arrendar',
]

function responder(q: string): string {
  const t = q.toLowerCase()
  if (t.includes('familia') || t.includes('suv'))
    return 'Para familia te recomiendo el Hyundai Tucson o el Mazda CX-5: 5 pasajeros, cajuela amplia y excelente seguridad. El Tucson Limited está en $499,900 y el CX-5 i Grand Touring en $514,900. ¿Te muestro la comparativa?'
  if (t.includes('apart'))
    return 'Apartas cualquier auto con $5,000 reembolsables desde su página. Eso reserva la unidad a tu nombre, fija el precio y agenda tu cita. Si decides no continuar, te devolvemos el depósito completo. Sin compromiso.'
  if (t.includes('crédito') || t.includes('credito') || t.includes('financ'))
    return 'Para el crédito Plasencia necesitas: identificación, comprobante de domicilio e ingresos. Puedes pre-aprobarte en línea sin afectar tu buró — toma 2 minutos. El enganche típico es 20% y manejamos plazos de 12 a 60 meses a 13.5% anual.'
  if (t.includes('arrend') || t.includes('lease') || t.includes('autolease'))
    return 'GP Autolease es arrendamiento puro: pagas una renta mensual fija, sin enganche fuerte, y al final del plazo renuevas, devuelves o compras. Ideal para empresas (deducible) y para quien renueva su auto cada 2-3 años. ¿Quieres una cotización?'
  if (t.includes('seminuevo') || t.includes('usado'))
    return 'Nuestros seminuevos pasan 167 puntos de inspección, tienen garantía por escrito y devolución de 7 días. Cada uno muestra su historial y número de dueños. Son la mejor forma de entrar al ecosistema Plasencia con un presupuesto menor.'
  if (t.includes('hola') || t.includes('buenas'))
    return '¡Hola! Soy Plasi, tu asistente en Plasencia Marketplace. Te ayudo a elegir auto, cotizar crédito o arrendamiento, agendar tu cita o resolver dudas. ¿En qué te apoyo?'
  if (t.includes('cita') || t.includes('agend'))
    return 'Puedes agendar tu cita o test drive desde la página de cualquier auto, eligiendo el horario y la sucursal que te queden mejor. Llegas y tu asesor ya te espera con la unidad lista y tu expediente preparado. Cero filas.'
  return 'Buena pregunta. Te puedo ayudar con: elegir auto, cotizar crédito o arrendamiento, el apartado, seminuevos certificados, o agendar tu cita. ¿Sobre cuál te cuento más?'
}

export default function Plasi() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'plasi', text: '¡Hola! Soy Plasi 👋 tu asistente en Plasencia Marketplace. ¿Te ayudo a encontrar tu próximo auto?' },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const loc = useLocation()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, open])

  // No mostrar el widget dentro del checkout (flujo enfocado)
  if (loc.pathname.startsWith('/checkout')) return null

  function enviar(texto: string) {
    const q = texto.trim()
    if (!q) return
    setMsgs(m => [...m, { from: 'user', text: q }])
    setInput('')
    setTimeout(() => setMsgs(m => [...m, { from: 'plasi', text: responder(q) }]), 450)
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-navy text-white pl-3 pr-4 py-3 rounded-full shadow-[0_12px_32px_rgba(15,26,46,.35)] hover:bg-slate transition-all active:scale-95 gp-fade-up"
        >
          <span className="w-8 h-8 rounded-full bg-gold text-navy grid place-items-center gp-display font-black text-[15px]">P</span>
          <span className="gp-display font-bold text-[14px]">Pregúntale a Plasi</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(15,26,46,.3)] border border-n200 flex flex-col overflow-hidden gp-fade-up" style={{ height: 'min(560px, calc(100vh - 2.5rem))' }}>
          {/* Header */}
          <div className="bg-navy text-white px-4 py-3.5 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-gold text-navy grid place-items-center gp-display font-black">P</span>
            <div className="flex-1">
              <div className="gp-display font-bold text-[15px] leading-tight">Plasi</div>
              <div className="text-[11px] text-n300 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> Asistente Plasencia · en línea</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-n400 hover:text-white text-xl leading-none w-7 h-7 grid place-items-center">×</button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-n50">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] text-[13px] leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                  m.from === 'user' ? 'bg-navy text-white rounded-br-sm' : 'bg-white border border-n200 text-n700 rounded-bl-sm'
                }`}>{m.text}</div>
              </div>
            ))}
            {msgs.length <= 1 && (
              <div className="space-y-1.5 pt-1">
                {SUGERENCIAS.map(s => (
                  <button key={s} onClick={() => enviar(s)} className="block w-full text-left text-[12.5px] text-navy bg-white border border-n200 rounded-xl px-3 py-2 hover:border-navy hover:bg-white transition">{s}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-n200 bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') enviar(input) }}
              placeholder="Escribe tu pregunta…"
              className="flex-1 text-[13px] px-3.5 py-2.5 bg-n100 rounded-full outline-none focus:bg-white focus:ring-1 focus:ring-navy/20"
            />
            <button onClick={() => enviar(input)} className="w-10 h-10 rounded-full bg-red text-white grid place-items-center hover:bg-red-deep transition active:scale-95 shrink-0">→</button>
          </div>
        </div>
      )}
    </>
  )
}
