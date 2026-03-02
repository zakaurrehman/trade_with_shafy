'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

const MARKET_ICONS: Record<string, string> = { Forex: '💱', Gold: '🥇', Crypto: '₿', Stocks: '📈', Indices: '📊', 'Crude Oil': '🛢️' }
const STATUS_COLORS: Record<string, string> = { active: '#00d4ff', waiting: '#f59e0b', completed: '#6b7280' }
const STATUS_BG: Record<string, string> = { active: 'rgba(0,212,255,0.08)', waiting: 'rgba(245,158,11,0.08)', completed: 'rgba(107,114,128,0.08)' }

type Post = { id: string; title: string; summary: string; market: string; status: string; image_url: string; created_at: string; is_premium: boolean }
type Profile = { plan: string }

const TICKER = [
  { symbol: 'EUR/USD', price: '1.0842', change: '+0.12%', up: true },
  { symbol: 'GBP/USD', price: '1.3190', change: '+0.08%', up: true },
  { symbol: 'XAU/USD', price: '2,941.50', change: '-0.34%', up: false },
  { symbol: 'BTC/USD', price: '48,230', change: '+1.24%', up: true },
  { symbol: 'DXY', price: '103.42', change: '-0.21%', up: false },
  { symbol: 'NASDAQ', price: '17,842', change: '+0.55%', up: true },
  { symbol: 'S&P 500', price: '5,012', change: '+0.33%', up: true },
  { symbol: 'CRUDE OIL', price: '74.18', change: '-0.67%', up: false },
  { symbol: 'ETH/USD', price: '2,631', change: '+0.91%', up: true },
  { symbol: 'USD/JPY', price: '149.82', change: '+0.15%', up: true },
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
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="20" width="6" height="12" rx="1" fill="#00d4ff" />
              <rect x="13" y="13" width="6" height="19" rx="1" fill="#00d4ff" />
              <rect x="22" y="6" width="6" height="26" rx="1" fill="#00d4ff" opacity="0.6" />
            </svg>
          </div>
          <span style={{ fontWeight: '700', fontSize: '17px', letterSpacing: '-0.3px' }}>Trade with Shafy</span>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowFilter(!showFilter)}
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '7px 14px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: C.cyan, fontSize: '11px' }}>●</span> {filter.toUpperCase()} ▾
          </button>
          {showFilter && (
            <div style={{ position: 'absolute', right: 0, top: '42px', background: C.card, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', zIndex: 10, minWidth: '150px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
              {['all', 'active', 'waiting', 'completed'].map(f => (
                <button key={f} onClick={() => { setFilter(f as typeof filter); setShowFilter(false) }}
                  style={{ display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left', background: filter === f ? 'rgba(0,212,255,0.1)' : 'transparent', color: filter === f ? C.cyan : '#9ca3af', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: filter === f ? '600' : 'normal', borderLeft: filter === f ? `2px solid ${C.cyan}` : '2px solid transparent' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock Ticker */}
      <div style={{ overflow: 'hidden', backgroundColor: C.card, borderBottom: `1px solid ${C.border}`, padding: '9px 0' }}>
        <div className="ticker-track">
          {tickerDouble.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 24px', whiteSpace: 'nowrap', fontSize: '12px' }}>
              <span style={{ color: C.muted, fontWeight: '600', letterSpacing: '0.5px' }}>{item.symbol}</span>
              <span style={{ color: 'white', fontWeight: '600' }}>{item.price}</span>
              <span style={{ color: item.up ? '#22c55e' : '#ef4444', fontSize: '11px' }}>{item.change}</span>
              <span style={{ color: C.border }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
            <p>No research posts yet.</p>
          </div>
        )}
        {posts.map(post => (
          <Link key={post.id} href={`/research/${post.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.card, borderRadius: '14px', padding: '16px', border: `1px solid ${C.border}`, display: 'flex', gap: '14px', alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', borderLeft: `3px solid ${STATUS_COLORS[post.status] || C.border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,212,255,0.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderLeftColor = STATUS_COLORS[post.status] || C.border }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {MARKET_ICONS[post.market] || '📊'} <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{post.market}</span>
                  </span>
                  <span style={{ backgroundColor: STATUS_BG[post.status], color: STATUS_COLORS[post.status], border: `1px solid ${STATUS_COLORS[post.status]}40`, borderRadius: '20px', padding: '3px 10px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ● {post.status}
                  </span>
                </div>
                <h3 style={{ fontWeight: '700', fontSize: '14px', color: 'white', marginBottom: '8px', lineHeight: '1.5' }}>{post.title}</h3>
                {post.is_premium && profile?.plan !== 'premium' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ height: '8px', width: '75%', backgroundColor: C.light, borderRadius: '4px' }} />
                    <div style={{ height: '8px', width: '55%', backgroundColor: C.light, borderRadius: '4px' }} />
                  </div>
                ) : (
                  <p style={{ color: C.muted, fontSize: '12px', lineHeight: '1.6' }}>{post.summary}</p>
                )}
                <p style={{ color: C.dim, fontSize: '11px', marginTop: '10px' }}>
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: C.light, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {post.image_url ? <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : MARKET_ICONS[post.market] || '📊'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
