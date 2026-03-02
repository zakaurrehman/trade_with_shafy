'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (error) setError(error.message)
    else { setSuccess('Password changed successfully!'); setTimeout(() => router.push('/profile'), 1500) }
  }

  return (
    <div style={{ backgroundColor: '#080d2b', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid #1e2a5a' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Change Password</span>
      </div>
      <div style={{ padding: '24px' }}>
        {error && <div style={{ backgroundColor: '#2d1515', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#fca5a5', fontSize: '14px' }}>{error}</div>}
        {success && <div style={{ backgroundColor: '#152d15', border: '1px solid #22c55e', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#86efac', fontSize: '14px' }}>{success}</div>}
        <form onSubmit={handleChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter New Password"
              style={{ width: '100%', backgroundColor: '#161e45', border: '1px solid #1e2a5a', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Enter Confirm Password"
              style={{ width: '100%', backgroundColor: '#161e45', border: '1px solid #1e2a5a', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', backgroundColor: '#c9a227', color: '#080d2b', fontWeight: 'bold', padding: '14px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: loading ? 0.7 : 1, marginTop: '8px' }}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
