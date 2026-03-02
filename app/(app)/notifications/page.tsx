'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

type Notification = { id: string; message: string; is_read: boolean; created_at: string }

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

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days > 0) return `${days}d ago`
    const hrs = Math.floor(diff / 3600000)
    if (hrs > 0) return `${hrs}h ago`
    return 'Just now'
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <button onClick={() => router.back()} style={{ background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, borderRadius: '10px', width: '34px', height: '34px', color: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>Notifications</span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔔</div>
            <p style={{ color: C.muted, fontSize: '14px' }}>No notifications yet.</p>
          </div>
        )}
        {notifications.map(n => (
          <div key={n.id} style={{ background: n.is_read ? `linear-gradient(160deg, ${C.card}, ${C.light})` : `linear-gradient(160deg, #0d1f35, #0a1628)`, borderRadius: '14px', padding: '14px 16px', border: `1px solid ${n.is_read ? C.border : 'rgba(0,212,255,0.2)'}`, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: `1px solid rgba(0,212,255,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>🔔</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: n.is_read ? '#9ca3af' : '#d1d5db', marginBottom: '4px', lineHeight: '1.6' }}>{n.message}</p>
              <p style={{ fontSize: '11px', color: C.dim }}>{timeAgo(n.created_at)}</p>
            </div>
            {!n.is_read && (
              <button onClick={() => markRead(n.id)} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', width: '30px', height: '30px', color: '#22c55e', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
