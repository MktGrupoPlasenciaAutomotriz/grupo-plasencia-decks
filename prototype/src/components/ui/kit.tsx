import type { ReactNode, ButtonHTMLAttributes } from 'react'
import logoBlanco from '../../assets/logo-gp-blanco.png'
import logoNegro from '../../assets/logo-gp-negro.png'

// ============================================================
// UI Kit · Plasencia Marketplace (corporate + fintech)
// ============================================================

type BtnVariant = 'primary' | 'conversion' | 'outline' | 'ghost' | 'whatsapp'
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', full, children, className = '', ...rest }: BtnProps) {
  const base = 'gp-display inline-flex items-center justify-center gap-2 font-bold rounded-[10px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98] tracking-tight'
  const sizes = { sm: 'text-[13px] px-3.5 py-2', md: 'text-[14px] px-5 py-2.5', lg: 'text-[15px] px-6 py-3.5' }
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-navy text-white hover:bg-slate shadow-[0_4px_12px_rgba(15,26,46,.08)]',
    conversion: 'bg-red text-white hover:bg-red-deep shadow-[0_6px_16px_rgba(200,16,46,.25)]',
    outline: 'border border-n300 text-navy bg-white hover:border-navy hover:bg-n50',
    ghost: 'text-navy hover:bg-n100',
    whatsapp: 'bg-[#25D366] text-white hover:brightness-95',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'navy', className = '' }: { children: ReactNode; tone?: 'navy' | 'red' | 'green' | 'gold' | 'gray'; className?: string }) {
  const tones = {
    navy: 'bg-navy/8 text-navy',
    red: 'bg-red/10 text-red',
    green: 'bg-success/12 text-success-deep',
    gold: 'bg-gold/20 text-gold-deep',
    gray: 'bg-n100 text-n600',
  }
  return <span className={`gp-display inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}>{children}</span>
}

export function Card({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`bg-white border border-n200 rounded-[16px] ${hover ? 'transition-all duration-200 hover:shadow-[0_12px_32px_rgba(15,26,46,.12)] hover:-translate-y-0.5 hover:border-n300' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Trust({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-n600">
      <span className="text-success-deep text-[15px] leading-none">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="gp-display text-[11px] font-extrabold tracking-[2.5px] uppercase text-red mb-3">{children}</div>
}

export function Stat({ value, label, tone = 'navy' }: { value: string; label: string; tone?: 'navy' | 'green' | 'gold' }) {
  const c = tone === 'green' ? 'text-success-deep' : tone === 'gold' ? 'text-gold-deep' : 'text-navy'
  return (
    <div>
      <div className={`gp-display font-extrabold text-2xl tracking-tight gp-tnum ${c}`}>{value}</div>
      <div className="text-[12px] text-n500 mt-0.5">{label}</div>
    </div>
  )
}

// Logo Plasencia (texto, para no depender de assets externos en el proto)
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <img
        src={dark ? logoBlanco : logoNegro}
        alt="Grupo Plasencia"
        className="h-7 w-auto"
        style={dark ? { mixBlendMode: 'screen' } : undefined}
      />
      <span className="gp-display text-[9px] font-extrabold tracking-[2px] uppercase px-1.5 py-0.5 rounded bg-red text-white">Marketplace</span>
    </div>
  )
}
