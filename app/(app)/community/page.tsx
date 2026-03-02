'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['Crude Oil Trading', 'Gold/Silver Trading', 'Crypto Trading', 'CFD Trading', 'Forex Trading', 'Stocks Trading', 'Indices Trading']

type Post = {
  id: string
  user_id: string
  category: string
  content: string
  image_url: string
  likes: number
  dislikes: number
  created_at: string
  profiles: { full_name: string; role: string; avatar_url: string }
}

export default function CommunityPage() {
  const [category, setCategory] = useState('Crude Oil Trading')
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState('user')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data) setUserRole(data.role)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    loadPosts()
  }, [category])

  async function loadPosts() {
    const { data } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name, role, avatar_url)')
      .eq('category', category)
      .order('created_at', { ascending: false })
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
    setNewPost('')
    setImageFile(null)
    setPosting(false)
    loadPosts()
  }

  async function handleReact(postId: string, reaction: 'like' | 'dislike') {
    if (!userId) return
    const { data: existing } = await supabase.from('post_reactions').select('*').eq('post_id', postId).eq('user_id', userId).single()

    if (existing) {
      if (existing.reaction === reaction) {
        await supabase.from('post_reactions').delete().eq('id', existing.id)
        const delta = reaction === 'like' ? -1 : 0
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
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c9a227', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🔔
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: category === cat ? '2px solid #c9a227' : '1px solid #1e2a5a', backgroundColor: category === cat ? '#c9a227' : 'transparent', color: category === cat ? '#080d2b' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: category === cat ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {/* Create Post */}
        <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #1e2a5a' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '15px' }}>Create New Post</h3>
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Type here..."
            style={{ width: '100%', backgroundColor: '#161e45', border: '1px solid #1e2a5a', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', resize: 'none', height: '100px', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }} title="Add image">🖼️</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
            {imageFile && <span style={{ color: '#c9a227', fontSize: '12px' }}>{imageFile.name}</span>}
          </div>
          <button onClick={handlePost} disabled={posting || !newPost.trim()}
            style={{ width: '100%', marginTop: '12px', backgroundColor: posting || !newPost.trim() ? '#3d3000' : '#c9a227', color: '#080d2b', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: posting || !newPost.trim() ? 'not-allowed' : 'pointer', fontSize: '15px' }}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>

        {/* Posts Feed */}
        {posts.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>No posts yet. Be the first!</p>}
        {posts.map(post => (
          <div key={post.id} style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #1e2a5a' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.profiles?.full_name || 'User'}</span>
                    {post.profiles?.role === 'admin' && (
                      <span style={{ backgroundColor: '#c9a227', color: '#080d2b', fontSize: '10px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '4px' }}>ADMIN</span>
                    )}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '12px' }}>{timeAgo(post.created_at)}</p>
                </div>
              </div>
            </div>

            <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{post.content}</p>

            {post.image_url && (
              <img src={post.image_url} alt="" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
              <button onClick={() => handleReact(post.id, 'like')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' }}>
                👍 <span>{post.likes}</span>
              </button>
              <button onClick={() => handleReact(post.id, 'dislike')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' }}>
                👎 <span>{post.dislikes}</span>
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '14px' }}>
                💬 0
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
