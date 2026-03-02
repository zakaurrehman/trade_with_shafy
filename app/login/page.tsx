'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/research')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080d2b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Logo */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="20" width="6" height="12" rx="1" fill="#c9a227" />
            <rect x="13" y="13" width="6" height="19" rx="1" fill="#c9a227" />
            <rect x="22" y="6" width="6" height="26" rx="1" fill="#c9a227" />
            <circle cx="30" cy="4" r="3" fill="#c9a227" opacity="0.7" />
          </svg>
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>Trade with Shafy</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Financial Trading Education & Research</p>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0e1535', borderRadius: '16px', padding: '32px', border: '1px solid #1e2a5a' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Sign In</h1>

        {error && (
          <div style={{ backgroundColor: '#2d1515', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#fca5a5', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{ width: '100%', backgroundColor: '#161e45', border: '1px solid #1e2a5a', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{ width: '100%', backgroundColor: '#161e45', border: '1px solid #1e2a5a', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#c9a227', color: '#080d2b', fontWeight: 'bold', padding: '14px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '14px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#c9a227', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
        </p>
      </div>

      <p style={{ marginTop: '24px', color: '#374151', fontSize: '12px', textAlign: 'center' }}>
        Knowledge Wins, Confusion Loses. Choose Wisely.
      </p>
    </div>
  )
}
