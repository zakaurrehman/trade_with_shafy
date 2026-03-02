'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Session = {
  id: string
  title: string
  stream_url: string
  scheduled_at: string
  is_live: boolean
}

export default function LivePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('live_sessions').select('*').order('created_at', { ascending: false }).limit(1).single()
      setSession(data)
    }
    load()
  }, [])

  useEffect(() => {
    if (!session?.scheduled_at || session.is_live) return
    const interval = setInterval(() => {
      const diff = new Date(session.scheduled_at).getTime() - Date.now()
      if (diff <= 0) { clearInterval(interval); return }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [session])

  function getYouTubeId(url: string) {
    const match = url?.match(/(?:embed\/|v=|youtu\.be\/)([^?&]+)/)
    return match ? match[1] : ''
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ backgroundColor: '#080d2b', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e2a5a' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '18px' }}>{session?.title || 'Live Session'}</h1>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c9a227', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
      </div>

      <div style={{ padding: '20px' }}>
        {session?.is_live && session.stream_url ? (
          // LIVE now — show stream
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1s infinite' }} />
              <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>LIVE NOW</span>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
              <iframe src={`https://www.youtube.com/embed/${getYouTubeId(session.stream_url)}?autoplay=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media" allowFullScreen />
            </div>
          </div>
        ) : (
          // Not live — show countdown
          <div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#0e1535', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>▶</div>
              </div>
            </div>

            <p style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>
              LIVE Session is starting soon!
            </p>

            <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '20px', border: '1px solid #1e2a5a', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>Time Left</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                {[
                  { label: 'Days', val: pad(timeLeft.days) },
                  { label: null, val: ':' },
                  { label: 'Hours', val: pad(timeLeft.hours) },
                  { label: null, val: ':' },
                  { label: 'Minutes', val: pad(timeLeft.minutes) },
                  { label: null, val: ':' },
                  { label: 'Seconds', val: pad(timeLeft.seconds) },
                ].map((item, i) => item.label === null ? (
                  <span key={i} style={{ color: '#c9a227', fontSize: '24px', fontWeight: 'bold' }}>:</span>
                ) : (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {item.val.split('').map((d, j) => (
                        <div key={j} style={{ width: '32px', height: '40px', backgroundColor: '#161e45', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>{d}</div>
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
