import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

type Item = { id: number; name: string }
type CartState = { items: Item[]; user: { id: number; name: string } }

const CartCtx = createContext<{
  state: CartState
  addItem: (i: Item) => void
}>({} as any)

export function CartProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CartState>({
    items: [],
    user: { id: 1, name: 'Ada' }
  })

  const addItem = (i: Item) => setState((s) => ({ ...s, items: [...s.items, i] }))
  const value = useMemo(() => ({ state, addItem }), [state])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
