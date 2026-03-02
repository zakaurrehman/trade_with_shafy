'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/research'); router.refresh() }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-120px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ marginBottom: '36px', textAlign: 'center', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="20" width="6" height="12" rx="1" fill="#00d4ff" />
              <rect x="13" y="13" width="6" height="19" rx="1" fill="#00d4ff" />
              <rect x="22" y="6" width="6" height="26" rx="1" fill="#00d4ff" opacity="0.6" />
            </svg>
          </div>
          <span style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.3px' }}>Trade with Shafy</span>
        </div>
        <p style={{ color: C.muted, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Financial Trading Education & Research</p>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px', background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '20px', padding: '36px', border: `1px solid ${C.border}`, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: '40px', right: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)' }} />

        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Welcome back</h1>
        <p style={{ color: C.muted, fontSize: '13px', marginBottom: '28px' }}>Sign in to your account to continue</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', display: 'block', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              style={{ width: '100%', backgroundColor: C.light, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '13px 16px', color: 'white', fontSize: '14px', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', display: 'block', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password"
              style={{ width: '100%', backgroundColor: C.light, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '13px 16px', color: 'white', fontSize: '14px', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? C.border : 'linear-gradient(135deg, #00d4ff, #00a8cc)', color: loading ? C.muted : '#050d1a', fontWeight: '700', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', letterSpacing: '0.3px', marginTop: '4px' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
          <div style={{ flex: 1, height: '1px', background: C.border }} />
          <span style={{ color: C.dim, fontSize: '11px' }}>NEW HERE?</span>
          <div style={{ flex: 1, height: '1px', background: C.border }} />
        </div>

        <p style={{ textAlign: 'center', color: C.muted, fontSize: '14px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: C.cyan, textDecoration: 'none', fontWeight: '600' }}>Create account</Link>
        </p>
      </div>

      <p style={{ marginTop: '28px', color: C.dim, fontSize: '12px', textAlign: 'center', zIndex: 1 }}>
        Knowledge Wins. Confusion Loses. Choose Wisely.
      </p>
    </div>
  )
}
