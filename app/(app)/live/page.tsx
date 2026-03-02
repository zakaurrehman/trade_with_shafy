'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

type Session = { id: string; title: string; stream_url: string; scheduled_at: string; is_live: boolean }

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
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [session])

  function getYouTubeId(url: string) {
    const match = url?.match(/(?:embed\/|v=|youtu\.be\/)([^?&]+)/)
    return match ? match[1] : ''
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <h1 style={{ fontWeight: '700', fontSize: '17px' }}>{session?.title || 'Live Session'}</h1>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔔</div>
      </div>

      <div style={{ padding: '20px' }}>
        {session?.is_live && session.stream_url ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px' }}>LIVE NOW</span>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              <iframe src={`https://www.youtube.com/embed/${getYouTubeId(session.stream_url)}?autoplay=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media" allowFullScreen />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ position: 'relative', height: '200px', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px', background: `linear-gradient(160deg, ${C.card}, ${C.light})`, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' }} />
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', position: 'relative', zIndex: 1 }}>▶</div>
            </div>

            <p style={{ fontWeight: '700', textAlign: 'center', fontSize: '18px', marginBottom: '8px' }}>Live Session Coming Soon</p>
            <p style={{ color: C.muted, textAlign: 'center', fontSize: '13px', marginBottom: '24px' }}>Join us for our next live market analysis session</p>

            <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '24px', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)' }} />
              <p style={{ color: C.muted, marginBottom: '20px', fontSize: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session starts in</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
                {[
                  { label: 'Days', val: pad(timeLeft.days) },
                  { label: null, val: ':' },
                  { label: 'Hours', val: pad(timeLeft.hours) },
                  { label: null, val: ':' },
                  { label: 'Min', val: pad(timeLeft.minutes) },
                  { label: null, val: ':' },
                  { label: 'Sec', val: pad(timeLeft.seconds) },
                ].map((item, i) => item.label === null ? (
                  <span key={i} style={{ color: '#ef4444', fontSize: '22px', fontWeight: '700', marginBottom: '18px' }}>:</span>
                ) : (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {item.val.split('').map((d, j) => (
                        <div key={j} style={{ width: '30px', height: '40px', background: C.light, border: `1px solid ${C.border}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px', color: 'white' }}>{d}</div>
                      ))}
                    </div>
                    <span style={{ fontSize: '10px', color: C.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
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
