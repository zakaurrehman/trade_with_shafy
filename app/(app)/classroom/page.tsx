'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

const KEYS_TO_REMEMBER = [
  'Traders fail from ignorance, not markets.',
  'Discipline beats luck every single time.',
  'Trade the plan, not your emotions.',
  "Losing isn't failure — refusing to learn is.",
  'Knowledge grows faster than capital.',
  'Consistency is the real edge in trading.',
  'Markets reward patience and preparation.',
]

const CATEGORIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research']

type Video = { id: string; title: string; description: string; youtube_url: string; category: string; is_premium: boolean }

export default function ClassroomPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [category, setCategory] = useState('All')
  const [profile, setProfile] = useState<{ plan: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
        setProfile(data)
      }
      let query = supabase.from('classroom_videos').select('*').order('sort_order')
      if (category !== 'All') query = query.eq('category', category)
      const { data } = await query
      setVideos(data || [])
    }
    load()
  }, [category])

  function getYouTubeId(url: string) {
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^?&]+)/)
    return match ? match[1] : ''
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="20" width="6" height="12" rx="1" fill="#00d4ff" />
              <rect x="13" y="13" width="6" height="19" rx="1" fill="#00d4ff" />
              <rect x="22" y="6" width="6" height="26" rx="1" fill="#00d4ff" opacity="0.6" />
            </svg>
          </div>
          <span style={{ fontWeight: '700', fontSize: '17px' }}>Trade with Shafy</span>
        </div>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔔</div>
      </div>

      <div style={{ padding: '14px' }}>
        {activeVideo && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{ fontWeight: '700', fontSize: '15px' }}>{activeVideo.title}</h2>
              <button onClick={() => setActiveVideo(null)} style={{ background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, borderRadius: '8px', width: '30px', height: '30px', color: C.muted, cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <iframe src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtube_url)}?autoplay=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media" allowFullScreen />
            </div>
            {activeVideo.description && <p style={{ color: C.muted, fontSize: '13px', marginTop: '10px', lineHeight: '1.6' }}>{activeVideo.description}</p>}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '16px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ flexShrink: 0, padding: '7px 16px', borderRadius: '20px', border: category === cat ? `1px solid ${C.cyan}` : `1px solid ${C.border}`, backgroundColor: category === cat ? 'rgba(0,212,255,0.1)' : 'transparent', color: category === cat ? C.cyan : C.muted, cursor: 'pointer', fontSize: '12px', fontWeight: category === cat ? '700' : 'normal', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          ))}
        </div>

        {videos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {videos.map(video => {
              const locked = video.is_premium && profile?.plan !== 'premium'
              return (
                <div key={video.id} onClick={() => !locked && setActiveVideo(video)}
                  style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '14px', padding: '14px', border: `1px solid ${C.border}`, cursor: locked ? 'default' : 'pointer', display: 'flex', gap: '12px', alignItems: 'center', borderLeft: locked ? `1px solid ${C.border}` : `3px solid ${C.cyan}` }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: locked ? C.border : 'rgba(0,212,255,0.1)', border: `1px solid ${locked ? C.border : 'rgba(0,212,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {locked ? '🔒' : '▶'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>{video.title}</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: C.cyan, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '2px 8px', borderRadius: '10px' }}>{video.category}</span>
                      {video.is_premium && <span style={{ fontSize: '10px', color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: '2px 8px', borderRadius: '10px' }}>Premium</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Keys to Remember */}
        <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛡️</div>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '15px' }}>Keys to Remember</h3>
              <p style={{ color: C.muted, fontSize: '11px' }}>Trading mindset principles</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', background: C.border, marginBottom: '16px' }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {KEYS_TO_REMEMBER.map((key, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#d1d5db', fontSize: '13px', lineHeight: '1.6' }}>
                <span style={{ color: C.cyan, fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{String(i + 1).padStart(2, '0')}</span>
                {key}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
