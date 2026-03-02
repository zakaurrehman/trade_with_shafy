'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, phone } } })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/research'); router.refresh() }
  }

  const inputStyle = { width: '100%', backgroundColor: C.light, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '13px 16px', color: 'white', fontSize: '14px', outline: 'none' } as const
  const labelStyle = { fontSize: '12px', color: C.muted, marginBottom: '8px', display: 'block' as const, fontWeight: '600' as const, letterSpacing: '0.5px', textTransform: 'uppercase' as const }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ marginBottom: '32px', textAlign: 'center', zIndex: 1 }}>
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
        <p style={{ color: C.muted, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Create your free account</p>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '20px', padding: '36px', border: `1px solid ${C.border}`, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: '40px', right: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)' }} />

        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Create account</h1>
        <p style={{ color: C.muted, fontSize: '13px', marginBottom: '28px' }}>Join thousands of traders today</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Your full name" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={labelStyle}>Phone (optional)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1234567890" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? C.border : 'linear-gradient(135deg, #00d4ff, #00a8cc)', color: loading ? C.muted : '#050d1a', fontWeight: '700', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', marginTop: '4px' }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '22px', color: C.muted, fontSize: '14px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: C.cyan, textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
