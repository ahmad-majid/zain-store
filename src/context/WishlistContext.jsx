import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext({})

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('thrift-aura-wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('thrift-aura-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  function toggleWishlist(productId) {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  function isWishlisted(productId) {
    return wishlist.includes(productId)
  }

  function clearWishlist() {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, clearWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
