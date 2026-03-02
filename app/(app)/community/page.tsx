'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }
const CATEGORIES = ['Crude Oil Trading', 'Gold/Silver Trading', 'Crypto Trading', 'CFD Trading', 'Forex Trading', 'Stocks Trading', 'Indices Trading']

type Post = { id: string; user_id: string; category: string; content: string; image_url: string; likes: number; dislikes: number; created_at: string; profiles: { full_name: string; role: string; avatar_url: string } }

export default function CommunityPage() {
  const [category, setCategory] = useState('Crude Oil Trading')
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    loadUser()
  }, [])

  useEffect(() => { loadPosts() }, [category])

  async function loadPosts() {
    const { data } = await supabase.from('community_posts').select('*, profiles(full_name, role, avatar_url)').eq('category', category).order('created_at', { ascending: false })
    setPosts((data as Post[]) || [])
  }

  async function handlePost() {
    if (!newPost.trim() || !userId) return
    setPosting(true)
    let imageUrl = ''
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `community/${userId}/${Date.now()}.${ext}`
      const { data: uploaded } = await supabase.storage.from('images').upload(path, imageFile)
      if (uploaded) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
        imageUrl = urlData.publicUrl
      }
    }
    await supabase.from('community_posts').insert({ user_id: userId, category, content: newPost, image_url: imageUrl })
    setNewPost(''); setImageFile(null); setPosting(false); loadPosts()
  }

  async function handleReact(postId: string, reaction: 'like' | 'dislike') {
    if (!userId) return
    const { data: existing } = await supabase.from('post_reactions').select('*').eq('post_id', postId).eq('user_id', userId).single()
    if (existing) {
      if (existing.reaction === reaction) {
        await supabase.from('post_reactions').delete().eq('id', existing.id)
        const field = reaction === 'like' ? 'likes' : 'dislikes'
        const post = posts.find(p => p.id === postId)
        if (post) await supabase.from('community_posts').update({ [field]: Math.max(0, post[field] - 1) }).eq('id', postId)
      }
    } else {
      await supabase.from('post_reactions').insert({ post_id: postId, user_id: userId, reaction })
      const field = reaction === 'like' ? 'likes' : 'dislikes'
      const post = posts.find(p => p.id === postId)
      if (post) await supabase.from('community_posts').update({ [field]: post[field] + 1 }).eq('id', postId)
    }
    loadPosts()
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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

      <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: `1px solid ${C.border}` }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ flexShrink: 0, padding: '7px 16px', borderRadius: '20px', border: category === cat ? `1px solid ${C.cyan}` : `1px solid ${C.border}`, backgroundColor: category === cat ? 'rgba(0,212,255,0.1)' : 'transparent', color: category === cat ? C.cyan : C.muted, cursor: 'pointer', fontSize: '12px', fontWeight: category === cat ? '700' : 'normal', whiteSpace: 'nowrap' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '16px', marginBottom: '14px', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }} />
          <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '13px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Create New Post</h3>
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share your analysis or insight..."
            style={{ width: '100%', backgroundColor: C.light, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px', color: 'white', fontSize: '14px', resize: 'none', height: '96px', outline: 'none', lineHeight: '1.6' }}
            onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button onClick={() => fileRef.current?.click()} style={{ background: `rgba(0,212,255,0.08)`, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '16px' }}>🖼️</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
            {imageFile && <span style={{ color: C.cyan, fontSize: '11px' }}>{imageFile.name}</span>}
            <button onClick={handlePost} disabled={posting || !newPost.trim()}
              style={{ background: posting || !newPost.trim() ? C.border : 'linear-gradient(135deg, #00d4ff, #00a8cc)', color: posting || !newPost.trim() ? C.muted : '#050d1a', fontWeight: '700', padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: posting || !newPost.trim() ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {posts.length === 0 && <p style={{ color: C.muted, textAlign: 'center', padding: '32px 0', fontSize: '14px' }}>No posts yet. Be the first!</p>}
        {posts.map(post => (
          <div key={post.id} style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '14px', padding: '16px', marginBottom: '10px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: C.light, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '13px' }}>{post.profiles?.full_name || 'User'}</span>
                  {post.profiles?.role === 'admin' && (
                    <span style={{ background: 'rgba(0,212,255,0.12)', color: C.cyan, border: `1px solid rgba(0,212,255,0.25)`, fontSize: '9px', fontWeight: '800', padding: '1px 7px', borderRadius: '4px', letterSpacing: '0.5px' }}>ADMIN</span>
                  )}
                </div>
                <p style={{ color: C.dim, fontSize: '11px' }}>{timeAgo(post.created_at)}</p>
              </div>
            </div>
            <p style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.7', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{post.content}</p>
            {post.image_url && <img src={post.image_url} alt="" style={{ width: '100%', borderRadius: '10px', marginBottom: '12px' }} />}
            <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => handleReact(post.id, 'like')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '13px' }}>👍 {post.likes}</button>
              <button onClick={() => handleReact(post.id, 'dislike')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '13px' }}>👎 {post.dislikes}</button>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '13px' }}>💬 0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
