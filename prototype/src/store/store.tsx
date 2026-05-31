import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import type { AppState, Customer, Deal, TradeIn, ServiceEvent } from '../types'

// ============================================================
// Motor de estado del Marketplace.
// Persiste en localStorage → el prototipo "recuerda lo que haces"
// (apartados, enganche, crédito, citas, trade-in, postventa).
// ============================================================

const STORAGE_KEY = 'plasencia-marketplace-v1'

const initialState: AppState = {
  customer: null,
  deals: [],
  tradeIns: [],
  servicios: [],
  compareIds: [],
}

type Action =
  | { type: 'SET_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Partial<Customer> }
  | { type: 'ADD_DEAL'; payload: Deal }
  | { type: 'UPDATE_DEAL'; payload: { id: string; patch: Partial<Deal> } }
  | { type: 'ADD_TRADEIN'; payload: TradeIn }
  | { type: 'ADD_SERVICE'; payload: ServiceEvent }
  | { type: 'TOGGLE_COMPARE'; payload: string }
  | { type: 'RESET' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload }
    case 'UPDATE_CUSTOMER':
      return { ...state, customer: { ...(state.customer as Customer), ...action.payload } }
    case 'ADD_DEAL':
      return { ...state, deals: [action.payload, ...state.deals] }
    case 'UPDATE_DEAL':
      return {
        ...state,
        deals: state.deals.map(d => (d.id === action.payload.id ? { ...d, ...action.payload.patch } : d)),
      }
    case 'ADD_TRADEIN':
      return { ...state, tradeIns: [action.payload, ...state.tradeIns] }
    case 'ADD_SERVICE':
      return { ...state, servicios: [action.payload, ...state.servicios] }
    case 'TOGGLE_COMPARE': {
      const exists = state.compareIds.includes(action.payload)
      if (exists) return { ...state, compareIds: state.compareIds.filter(id => id !== action.payload) }
      if (state.compareIds.length >= 3) return state
      return { ...state, compareIds: [...state.compareIds, action.payload] }
    }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function init(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch { /* noop */ }
  return initialState
}

interface Ctx { state: AppState; dispatch: React.Dispatch<Action> }
const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* noop */ }
  }, [state])
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
