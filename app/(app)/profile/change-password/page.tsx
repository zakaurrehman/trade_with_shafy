'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5' }

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirm) { setError('Passwords do not match'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (error) setError(error.message)
    else { setSuccess('Password changed successfully!'); setTimeout(() => router.push('/profile'), 1500) }
  }

  const inputStyle = { width: '100%', backgroundColor: C.light, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '13px 16px', color: 'white', fontSize: '14px', outline: 'none' } as const

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <button onClick={() => router.back()} style={{ background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, borderRadius: '10px', width: '34px', height: '34px', color: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>Change Password</span>
      </div>

      <div style={{ padding: '24px' }}>
        {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#86efac', fontSize: '13px' }}>{success}</div>}

        <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '24px', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />

          <form onSubmit={handleChange} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', display: 'block', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', display: 'block', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Confirm new password" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = C.cyan; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? C.border : 'linear-gradient(135deg, #00d4ff, #00a8cc)', color: loading ? C.muted : '#050d1a', fontWeight: '700', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', marginTop: '4px' }}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
