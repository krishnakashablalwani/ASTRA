import api from './services/api'

async function urlBase64ToUint8Array(base64String) {
  if (!base64String || typeof base64String !== 'string') {
    throw new Error('Invalid VAPID public key')
  }
  // sanitize: trim, remove quotes/whitespace
  const sanitized = base64String.trim().replace(/^"|"$/g, '').replace(/\s+/g, '')
  const padding = '='.repeat((4 - (sanitized.length % 4)) % 4)
  const base64 = (sanitized + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function initPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported in this browser')
    return
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('Notifications permission not granted')
      return
    }

    const reg = await navigator.serviceWorker.ready

    // Fetch VAPID public key from backend
    const { data } = await api.get('/push/public-key')
    const pub = (data && data.publicKey) ? String(data.publicKey) : ''
    if (!pub) {
      throw new Error('Missing VAPID public key from server')
    }
    const applicationServerKey = await urlBase64ToUint8Array(pub)

    // Check for existing subscription
    const existingSubscription = await reg.pushManager.getSubscription()
    
    if (existingSubscription) {
      // Unsubscribe from old subscription (in case VAPID keys changed)
      try {
        await existingSubscription.unsubscribe()
        console.log('Unsubscribed from old push subscription')
      } catch (err) {
        console.warn('Failed to unsubscribe from old subscription:', err)
      }
    }

    // Create new subscription with current VAPID key
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    })

    // Send subscription to backend
    await api.post('/push/subscribe', subscription)
    console.log('✅ Push notifications subscribed successfully')
  } catch (err) {
    console.error('Push subscription error:', err)
  }
}
