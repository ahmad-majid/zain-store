import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext({})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((item) => {
    const id = Date.now()
    setToasts(prev => [...prev.slice(-2), { id, ...item }]) // max 3 toasts
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
