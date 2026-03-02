'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e', waiting: '#f59e0b', completed: '#ef4444'
}

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

  if (loading) return <div style={{ backgroundColor: '#080d2b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading...</div>
  if (!post) return <div style={{ backgroundColor: '#080d2b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Post not found</div>

  const isPremiumLocked = post.is_premium && profile?.plan !== 'premium'

  return (
    <div style={{ backgroundColor: '#080d2b', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid #1e2a5a' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Research</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>{post.market}</span>
          <span style={{ backgroundColor: STATUS_COLORS[post.status] + '22', color: STATUS_COLORS[post.status], border: `1px solid ${STATUS_COLORS[post.status]}`, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            ● {post.status}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: '1.4', marginBottom: '8px' }}>{post.title}</h1>
        <p style={{ color: '#4b5563', fontSize: '13px', marginBottom: '20px' }}>
          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        {/* Content */}
        {isPremiumLocked ? (
          <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #1e2a5a' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Premium Content</h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>Upgrade to Premium to read the full research analysis.</p>
            <button onClick={() => router.push('/profile')}
              style={{ backgroundColor: '#c9a227', color: '#080d2b', fontWeight: 'bold', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
              Upgrade to Premium
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '20px', border: '1px solid #1e2a5a' }}>
            <p style={{ color: '#d1d5db', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{post.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
