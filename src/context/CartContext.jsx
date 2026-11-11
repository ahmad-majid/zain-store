import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('thrift-aura-cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('thrift-aura-cart', JSON.stringify(items))
  }, [items])

  function addItem(product, size) {
    setItems(prev => {
      const key = `${product.id}-${size}`
      const existing = prev.find(i => `${i.id}-${i.selectedSize}` === key)
      if (existing) {
        return prev.map(i =>
          `${i.id}-${i.selectedSize}` === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }]
    })
  }

  function removeItem(id, size) {
    setItems(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)))
  }

  function updateQuantity(id, size, quantity) {
    if (quantity < 1) return removeItem(id, size)
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.selectedSize === size ? { ...i, quantity } : i
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
