'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  message: string
  is_read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setNotifications(data || [])
    }
    load()
  }, [])

  async function markRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  async function dismiss(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days > 0) return `${days}d ago`
    const hrs = Math.floor(diff / 3600000)
    if (hrs > 0) return `${hrs}h ago`
    return 'Just now'
  }

  return (
    <div style={{ backgroundColor: '#080d2b', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid #1e2a5a' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Notifications</span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>No notifications yet.</p>
        )}
        {notifications.map(n => (
          <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', backgroundColor: n.is_read ? '#0e1535' : '#161e45', borderRadius: '12px', border: '1px solid #1e2a5a' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#080d2b', border: '2px solid #1e2a5a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🔔</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '4px' }}>{n.message}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{timeAgo(n.created_at)}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: '18px' }} title="Mark read">✓</button>
              )}
              <button onClick={() => dismiss(n.id)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px' }} title="Dismiss">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
