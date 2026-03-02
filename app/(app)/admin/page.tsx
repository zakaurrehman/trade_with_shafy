'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'research' | 'classroom' | 'live' | 'users'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('research')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Research form
  const [resTitle, setResTitle] = useState('')
  const [resSummary, setResSummary] = useState('')
  const [resContent, setResContent] = useState('')
  const [resMarket, setResMarket] = useState('Forex')
  const [resStatus, setResStatus] = useState('active')
  const [resPremium, setResPremium] = useState(true)
  const [resSaving, setResSaving] = useState(false)

  // Classroom form
  const [vidTitle, setVidTitle] = useState('')
  const [vidDesc, setVidDesc] = useState('')
  const [vidUrl, setVidUrl] = useState('')
  const [vidCat, setVidCat] = useState('Beginner')
  const [vidPremium, setVidPremium] = useState(false)
  const [vidSaving, setVidSaving] = useState(false)

  // Live form
  const [liveTitle, setLiveTitle] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [liveTime, setLiveTime] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [liveSaving, setLiveSaving] = useState(false)

  // Users
  const [users, setUsers] = useState<Array<{ id: string; full_name: string; student_id: string; plan: string; payment_status: string }>>([])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (data?.role !== 'admin') { router.push('/research'); return }
      setIsAdmin(true)
      setLoading(false)
    }
    checkAdmin()
  }, [])

  useEffect(() => {
    if (isAdmin && tab === 'users') loadUsers()
  }, [tab, isAdmin])

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('id, full_name, student_id, plan, payment_status').order('created_at', { ascending: false })
    setUsers(data || [])
  }

  async function saveResearch(e: React.FormEvent) {
    e.preventDefault()
    setResSaving(true)
    await supabase.from('research_posts').insert({ title: resTitle, summary: resSummary, content: resContent, market: resMarket, status: resStatus, is_premium: resPremium })
    setResTitle(''); setResSummary(''); setResContent('')
    setResSaving(false)
    alert('Research post published!')
  }

  async function saveVideo(e: React.FormEvent) {
    e.preventDefault()
    setVidSaving(true)
    await supabase.from('classroom_videos').insert({ title: vidTitle, description: vidDesc, youtube_url: vidUrl, category: vidCat, is_premium: vidPremium })
    setVidTitle(''); setVidDesc(''); setVidUrl('')
    setVidSaving(false)
    alert('Video added!')
  }

  async function saveLive(e: React.FormEvent) {
    e.preventDefault()
    setLiveSaving(true)
    // Delete old sessions and insert new one
    await supabase.from('live_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('live_sessions').insert({ title: liveTitle, stream_url: liveUrl, scheduled_at: liveTime || null, is_live: isLive })
    setLiveSaving(false)
    alert('Live session updated!')
  }

  async function upgradePremium(userId: string) {
    await supabase.from('profiles').update({ plan: 'premium', payment_status: 'success' }).eq('id', userId)
    loadUsers()
  }

  async function downgradeBasic(userId: string) {
    await supabase.from('profiles').update({ plan: 'basic', payment_status: 'pending' }).eq('id', userId)
    loadUsers()
  }

  if (loading) return <div style={{ backgroundColor: '#050d1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a7fa5' }}>Checking access...</div>
  if (!isAdmin) return null

    const inputStyle = { width: '100%', backgroundColor: '#071220', border: '1px solid #0d2137', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none' }
  const labelStyle = { fontSize: '12px', color: '#4a7fa5', marginBottom: '6px', display: 'block' as const, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
  const btnStyle = { background: 'linear-gradient(135deg, #00d4ff, #00a8cc)', color: '#050d1a', fontWeight: 'bold' as const, padding: '12px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px' }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'research', label: '📊 Research' },
    { id: 'classroom', label: '🎓 Classroom' },
    { id: 'live', label: '🔴 Live' },
    { id: 'users', label: '👥 Users' },
  ]

  return (
    <div style={{ backgroundColor: '#050d1a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: '1px solid #0d2137', background: 'linear-gradient(180deg, #0a1628, #050d1a)' }}>
        <button onClick={() => router.push('/research')} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid #0d2137', borderRadius: '10px', width: '34px', height: '34px', color: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>Admin Panel</span>
        <span style={{ background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>ADMIN</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #0d2137', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '12px 16px', background: 'none', border: 'none', color: tab === t.id ? '#00d4ff' : '#4a7fa5', cursor: 'pointer', fontSize: '13px', fontWeight: tab === t.id ? '700' : 'normal', borderBottom: tab === t.id ? '2px solid #00d4ff' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {/* Research Tab */}
        {tab === 'research' && (
          <form onSubmit={saveResearch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>Post Research Article</h2>
            <div><label style={labelStyle}>Title</label><input style={inputStyle} value={resTitle} onChange={e => setResTitle(e.target.value)} required placeholder="Article title" /></div>
            <div><label style={labelStyle}>Summary (short preview)</label><input style={inputStyle} value={resSummary} onChange={e => setResSummary(e.target.value)} required placeholder="Short summary" /></div>
            <div><label style={labelStyle}>Full Content</label><textarea style={{ ...inputStyle, height: '160px', resize: 'none' }} value={resContent} onChange={e => setResContent(e.target.value)} required placeholder="Full analysis content..." /></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Market</label>
                <select style={inputStyle} value={resMarket} onChange={e => setResMarket(e.target.value)}>
                  {['Forex', 'Gold', 'Crypto', 'Stocks', 'Indices', 'Crude Oil'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={resStatus} onChange={e => setResStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="waiting">Waiting</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#d1d5db' }}>
              <input type="checkbox" checked={resPremium} onChange={e => setResPremium(e.target.checked)} />
              Premium only (blurred for basic users)
            </label>
            <button type="submit" style={btnStyle} disabled={resSaving}>{resSaving ? 'Publishing...' : 'Publish Research'}</button>
          </form>
        )}

        {/* Classroom Tab */}
        {tab === 'classroom' && (
          <form onSubmit={saveVideo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>Add Classroom Video</h2>
            <div><label style={labelStyle}>Video Title</label><input style={inputStyle} value={vidTitle} onChange={e => setVidTitle(e.target.value)} required placeholder="Video title" /></div>
            <div><label style={labelStyle}>Description</label><input style={inputStyle} value={vidDesc} onChange={e => setVidDesc(e.target.value)} placeholder="Short description" /></div>
            <div><label style={labelStyle}>YouTube URL</label><input style={inputStyle} value={vidUrl} onChange={e => setVidUrl(e.target.value)} required placeholder="https://www.youtube.com/watch?v=..." /></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={vidCat} onChange={e => setVidCat(e.target.value)}>
                  {['Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#d1d5db' }}>
              <input type="checkbox" checked={vidPremium} onChange={e => setVidPremium(e.target.checked)} />
              Premium only
            </label>
            <button type="submit" style={btnStyle} disabled={vidSaving}>{vidSaving ? 'Adding...' : 'Add Video'}</button>
          </form>
        )}

        {/* Live Tab */}
        {tab === 'live' && (
          <form onSubmit={saveLive} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>Set Live Session</h2>
            <div><label style={labelStyle}>Session Title</label><input style={inputStyle} value={liveTitle} onChange={e => setLiveTitle(e.target.value)} required placeholder="e.g. Weekly Market Analysis" /></div>
            <div><label style={labelStyle}>YouTube Stream URL (when live)</label><input style={inputStyle} value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></div>
            <div><label style={labelStyle}>Scheduled Date & Time</label><input type="datetime-local" style={inputStyle} value={liveTime} onChange={e => setLiveTime(e.target.value)} /></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#d1d5db' }}>
              <input type="checkbox" checked={isLive} onChange={e => setIsLive(e.target.checked)} />
              🔴 Session is LIVE right now
            </label>
            <button type="submit" style={btnStyle} disabled={liveSaving}>{liveSaving ? 'Saving...' : 'Save Live Session'}</button>
          </form>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <h2 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Manage Users ({users.length})</h2>
            {users.map(u => (
              <div key={u.id} style={{ backgroundColor: '#0e1535', borderRadius: '10px', padding: '14px', marginBottom: '10px', border: '1px solid #1e2a5a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>{u.full_name || 'No name'}</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>#{u.student_id}</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span style={{ backgroundColor: u.plan === 'premium' ? '#c9a22722' : '#1e2a5a', color: u.plan === 'premium' ? '#c9a227' : '#9ca3af', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>{u.plan}</span>
                      <span style={{ backgroundColor: u.payment_status === 'success' ? '#22c55e22' : '#f59e0b22', color: u.payment_status === 'success' ? '#22c55e' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{u.payment_status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {u.plan !== 'premium' ? (
                      <button onClick={() => upgradePremium(u.id)} style={{ backgroundColor: '#c9a227', color: '#080d2b', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Upgrade</button>
                    ) : (
                      <button onClick={() => downgradeBasic(u.id)} style={{ backgroundColor: '#374151', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Downgrade</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
