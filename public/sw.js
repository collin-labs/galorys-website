// Service Worker para notificações push

const CACHE_NAME = 'galorys-v1'
const OFFLINE_URL = '/offline.html'

// Instalar
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/icon-192.png',
        '/icon-512.png',
      ])
    })
  )
  self.skipWaiting()
})

// Ativar
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Receber push
self.addEventListener('push', (event) => {
  console.log('Push recebido:', event)
  
  let data = {
    title: 'Galorys',
    body: 'Nova notificação',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: { url: '/' },
  }
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch (e) {
      data.body = event.data.text()
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    image: data.image,
    tag: data.tag || 'galorys-notification',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions || [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' },
    ],
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event)
  
  event.notification.close()
  
  const action = event.action
  const url = event.notification.data?.url || '/'
  
  if (action === 'close') return
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se já tem uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Senão, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event)
})

// Fetch (para cache offline)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL)
        })
      })
    )
  }
})
