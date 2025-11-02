/* eslint-disable no-undef */
import { precacheAndRoute } from 'workbox-precaching'

// self.__WB_MANIFEST will be injected by workbox at build time
precacheAndRoute(self.__WB_MANIFEST || [])

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    // fallback if not json
    data = { title: 'CampusHive', body: event.data ? event.data.text() : '' }
  }

  const title = data.title || 'CampusHive'
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/light.png',
    badge: data.badge || '/light.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    actions: data.actions || []
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification?.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus()
          client.postMessage({ type: 'navigate', url: targetUrl })
          return
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
