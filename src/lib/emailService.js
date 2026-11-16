/**
 * Email Service for Thrift Aura Atelier
 * Dispatches transactional notifications via Netlify Functions & Gmail SMTP
 * Admin / Owner recipient: u06626982@gmail.com
 */

/**
 * Dispatch an order confirmation email to the client + instant alert to the store owner
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

/**
 * Dispatch 6-digit verification code to the client's Gmail address
 */
export async function sendVerificationCodeEmail(email, code, fullName = '') {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verification_code',
        email,
        code,
        fullName,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.warn('Verification code email error:', res.status, errData)
      return { success: false, error: errData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    console.log('Verification code email dispatched successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.warn('Network or server error dispatching verification code:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Dispatch welcome email once Gmail verification is complete
 */
export async function sendWelcomeVerifiedEmail(email, fullName = '') {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'welcome_verified',
        email,
        fullName,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      return { success: false, error: errData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Dispatch a promotional campaign to all/selected client emails
 */
export async function sendPromotionalBroadcast({
  recipients,
  subject,
  headline,
  message,
  couponCode,
  buttonText,
  buttonLink,
}) {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'promotional_broadcast',
        recipients,
        subject,
        headline,
        message,
        couponCode,
        buttonText,
        buttonLink,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.warn('Broadcast email error:', res.status, errData)
      return { success: false, error: errData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    console.log('Promotional broadcast sent successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.warn('Network error during promotional broadcast:', err)
    return { success: false, error: err.message }
  }
}
