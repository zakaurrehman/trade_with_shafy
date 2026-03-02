'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const KEYS_TO_REMEMBER = [
  'Traders fail from ignorance, not markets.',
  'Discipline beats luck.',
  'Trade the plan, not emotions.',
  "Losing isn't failure—refusing to learn is.",
  'Knowledge grows faster than capital.',
  'Consistency is the real edge.',
  'Markets reward preparation.',
]

const CATEGORIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research']

type Video = {
  id: string
  title: string
  description: string
  youtube_url: string
  category: string
  is_premium: boolean
}

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
    <div style={{ backgroundColor: '#080d2b', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e2a5a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="20" width="6" height="12" rx="1" fill="#c9a227" />
            <rect x="13" y="13" width="6" height="19" rx="1" fill="#c9a227" />
            <rect x="22" y="6" width="6" height="26" rx="1" fill="#c9a227" />
          </svg>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Trade with Shafy</span>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c9a227', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Active Video Player */}
        {activeVideo && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '16px' }}>{activeVideo.title}</h2>
              <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtube_url)}?autoplay=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media" allowFullScreen />
            </div>
            {activeVideo.description && (
              <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>{activeVideo.description}</p>
            )}
          </div>
        )}

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '16px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ flexShrink: 0, padding: '6px 14px', borderRadius: '20px', border: category === cat ? '2px solid #c9a227' : '1px solid #1e2a5a', backgroundColor: category === cat ? '#c9a227' : 'transparent', color: category === cat ? '#080d2b' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: category === cat ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Videos list */}
        {videos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {videos.map(video => {
              const locked = video.is_premium && profile?.plan !== 'premium'
              return (
                <div key={video.id} onClick={() => !locked && setActiveVideo(video)}
                  style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a', cursor: locked ? 'default' : 'pointer', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {locked ? '🔒' : '▶️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{video.title}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#c9a227', backgroundColor: '#c9a22722', padding: '2px 8px', borderRadius: '10px' }}>{video.category}</span>
                      {video.is_premium && <span style={{ fontSize: '11px', color: '#f59e0b', backgroundColor: '#f59e0b22', padding: '2px 8px', borderRadius: '10px' }}>Premium</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Keys to Remember */}
        <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '20px', border: '1px solid #1e2a5a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>Keys to Remember</h3>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: '#1e2a5a', marginBottom: '16px' }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {KEYS_TO_REMEMBER.map((key, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#d1d5db', fontSize: '14px' }}>
                <span style={{ color: '#c9a227', marginTop: '2px' }}>•</span>
                {key}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
