/**
 * Email Service for Thrift Aura Atelier
 * Dispatches transactional notifications via Netlify Functions & Gmail SMTP
 * Admin / Owner recipient: u06626982@gmail.com
 */

/**
 * Dispatch an order confirmation email to the client + instant alert to the store owner
 * @param {Object} order - Full order details including items, client info, and total
 */
export async function sendOrderConfirmationEmails(order) {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_order',
        order,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.warn('Email dispatch responded with non-200:', res.status, errData)
      return { success: false, error: errData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    console.log('Order confirmation emails dispatched successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.warn('Network or server error while dispatching order confirmation email:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Dispatch an order status update email to the client + confirmation copy to owner
 * @param {Object} order - The order object
 * @param {string} newStatus - The updated status (e.g. 'Dispatched via Courier', 'Delivered')
 * @param {Object} trackingInfo - { courier, trackingNumber, notes }
 */
export async function sendOrderStatusUpdateEmail(order, newStatus, trackingInfo = {}) {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'status_update',
        order,
        newStatus,
        trackingInfo,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.warn('Email dispatch responded with non-200:', res.status, errData)
      return { success: false, error: errData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    console.log('Status update email dispatched successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.warn('Network or server error while dispatching status update email:', err)
    return { success: false, error: err.message }
  }
}
