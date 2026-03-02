'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const MARKET_ICONS: Record<string, string> = {
  Forex: '💱', Gold: '🥇', Crypto: '₿', Stocks: '📈', Indices: '📊', 'Crude Oil': '🛢️'
}

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e', waiting: '#f59e0b', completed: '#ef4444'
}

type Post = {
  id: string
  title: string
  summary: string
  market: string
  status: string
  image_url: string
  created_at: string
  is_premium: boolean
}

type Profile = { plan: string }

const TICKER = [
  { symbol: 'EURUSD', price: '1.0842', change: '+0.12%', up: true },
  { symbol: 'GBPUSD', price: '1.3190', change: '+0.08%', up: true },
  { symbol: 'XAUUSD', price: '2,941.50', change: '-0.34%', up: false },
  { symbol: 'BTC/USD', price: '48,230', change: '+1.24%', up: true },
  { symbol: 'DXY', price: '103.42', change: '-0.21%', up: false },
  { symbol: 'NASDAQ', price: '17,842', change: '+0.55%', up: true },
  { symbol: 'S&P500', price: '5,012', change: '+0.33%', up: true },
  { symbol: 'CRUDE OIL', price: '74.18', change: '-0.67%', up: false },
]

export default function ResearchPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting' | 'completed'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
        setProfile(prof)
      }
      let query = supabase.from('research_posts').select('*').order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('status', filter)
      const { data } = await query
      setPosts(data || [])
    }
    load()
  }, [filter])

  const tickerDouble = [...TICKER, ...TICKER]

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
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowFilter(!showFilter)}
            style={{ backgroundColor: '#161e45', border: '1px solid #1e2a5a', borderRadius: '8px', padding: '6px 14px', color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {filter.toUpperCase()} ▾
          </button>
          {showFilter && (
            <div style={{ position: 'absolute', right: 0, top: '40px', backgroundColor: '#161e45', borderRadius: '10px', border: '1px solid #1e2a5a', overflow: 'hidden', zIndex: 10, minWidth: '140px' }}>
              {['all', 'active', 'waiting', 'completed'].map(f => (
                <button key={f} onClick={() => { setFilter(f as typeof filter); setShowFilter(false) }}
                  style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: filter === f ? '#c9a227' : 'transparent', color: filter === f ? '#080d2b' : 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: filter === f ? 'bold' : 'normal' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock Ticker */}
      <div style={{ overflow: 'hidden', backgroundColor: '#0e1535', borderBottom: '1px solid #1e2a5a', padding: '8px 0' }}>
        <div className="ticker-track">
          {tickerDouble.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 20px', whiteSpace: 'nowrap', fontSize: '13px' }}>
              <span style={{ color: '#9ca3af' }}>{item.symbol}</span>
              <span style={{ color: 'white', fontWeight: '600' }}>{item.price}</span>
              <span style={{ color: item.up ? '#22c55e' : '#ef4444' }}>{item.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>No research posts yet.</p>
        )}
        {posts.map(post => (
          <Link key={post.id} href={`/research/${post.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a', display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{MARKET_ICONS[post.market] || '📊'} {post.market}</span>
                  <span style={{ backgroundColor: STATUS_COLORS[post.status] + '22', color: STATUS_COLORS[post.status], border: `1px solid ${STATUS_COLORS[post.status]}`, borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    ● {post.status}
                  </span>
                </div>
                <h3 style={{ fontWeight: 'bold', fontSize: '15px', color: 'white', marginBottom: '8px', lineHeight: '1.4' }}>{post.title}</h3>
                {post.is_premium && profile?.plan !== 'premium' ? (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ height: '10px', width: '60%', backgroundColor: '#1e2a5a', borderRadius: '4px' }} />
                    <div style={{ height: '10px', width: '30%', backgroundColor: '#1e2a5a', borderRadius: '4px' }} />
                  </div>
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.5' }}>{post.summary}</p>
                )}
                <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '8px' }}>
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                {post.image_url ? <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : MARKET_ICONS[post.market] || '📊'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
