'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }
const STATUS_COLORS: Record<string, string> = { active: '#00d4ff', waiting: '#f59e0b', completed: '#6b7280' }

export default function ResearchDetailPage() {
  const [post, setPost] = useState<Record<string, string> | null>(null)
  const [profile, setProfile] = useState<{ plan: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
        setProfile(prof)
      }
      const { data } = await supabase.from('research_posts').select('*').eq('id', params.id).single()
      setPost(data)
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>Loading...</div>
  if (!post) return <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>Post not found</div>

  const isPremiumLocked = post.is_premium && profile?.plan !== 'premium'
  const statusColor = STATUS_COLORS[post.status] || C.muted

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <button onClick={() => router.back()} style={{ background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, borderRadius: '10px', width: '34px', height: '34px', color: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>Research</span>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{post.market}</span>
          <span style={{ backgroundColor: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}40`, borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ● {post.status}
          </span>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.4', marginBottom: '8px' }}>{post.title}</h1>
        <p style={{ color: C.dim, fontSize: '12px', marginBottom: '24px' }}>
          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        {isPremiumLocked ? (
          <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>🔒</div>
            <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '17px' }}>Premium Content</h3>
            <p style={{ color: C.muted, marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>Upgrade to Premium to unlock the full research analysis and all trade ideas.</p>
            <button onClick={() => router.push('/profile')}
              style={{ background: 'linear-gradient(135deg, #00d4ff, #00a8cc)', color: '#050d1a', fontWeight: '700', padding: '13px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              Upgrade to Premium →
            </button>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}`, borderLeft: `3px solid ${statusColor}` }}>
            <p style={{ color: '#d1d5db', lineHeight: '1.9', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{post.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
