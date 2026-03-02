'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Profile = {
  id: string
  full_name: string
  student_id: string
  phone: string
  plan: string
  payment_status: string
  is_active: boolean
}

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: 'Rs 7,900', duration: 'Monthly', desc: 'Full access today—pay monthly, cancel anytime.', color: '#0ea5e9' },
  { id: '6month', label: '6 Months', price: 'Rs 39,900', duration: '6 Months', desc: 'Save 16% — Equivalent to Rs 6,650/mo', color: '#f59e0b' },
  { id: 'annual', label: 'Annual', price: 'Rs 59,900', duration: 'Annual', desc: 'Save 33% — Equivalent to Rs 4,992/mo', color: '#8b5cf6' },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [showPlans, setShowPlans] = useState(false)
  const [tab, setTab] = useState<'profile' | 'plans'>('profile')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!profile) return (
    <div style={{ backgroundColor: '#080d2b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading...</div>
  )

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
        <Link href="/notifications" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c9a227', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>🔔</Link>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Profile Card */}
        <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{profile.full_name || email.split('@')[0]}</span>
                <span style={{ backgroundColor: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '20px', padding: '1px 10px', fontSize: '11px', fontWeight: 'bold' }}>
                  {profile.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>Student ID: #{profile.student_id}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '14px', fontSize: '15px' }}>Contact Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
              <span style={{ fontSize: '14px', color: '#d1d5db' }}>{email}</span>
            </div>
            {profile.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#161e45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</div>
                <span style={{ fontSize: '14px', color: '#d1d5db' }}>{profile.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Status */}
        <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '14px', fontSize: '15px' }}>Payment Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>💳</span><span style={{ fontSize: '14px', color: '#9ca3af' }}>Current Plan</span>
              </div>
              <span style={{ backgroundColor: '#1e2a5a', color: 'white', padding: '4px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {profile.plan}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>💳</span><span style={{ fontSize: '14px', color: '#9ca3af' }}>Payment Status</span>
              </div>
              <span style={{ backgroundColor: profile.payment_status === 'success' ? '#22c55e22' : '#f59e0b22', color: profile.payment_status === 'success' ? '#22c55e' : '#f59e0b', border: `1px solid ${profile.payment_status === 'success' ? '#22c55e' : '#f59e0b'}`, padding: '4px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {profile.payment_status}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <button onClick={() => setShowPlans(!showPlans)}
          style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>Manage Your Plan</span>
          </div>
          <span style={{ color: '#9ca3af' }}>{showPlans ? '▲' : '▶'}</span>
        </button>

        {showPlans && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', color: '#9ca3af', fontSize: '13px', padding: '0 0 12px', fontWeight: 'normal' }}>Feature</th>
                    <th style={{ textAlign: 'center', color: 'white', fontSize: '13px', padding: '0 0 12px', fontWeight: 'bold' }}>BASIC</th>
                    <th style={{ textAlign: 'center', color: '#c9a227', fontSize: '13px', padding: '0 0 12px', fontWeight: 'bold' }}>MASTER</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Beginner Course', 'App Access + Notifications',
                    'Intermediate / Advance / Master Classes', 'Full Community (Chat & Networking)',
                    'Live Market Research Sessions', 'Daily Articles / Deep Research',
                    'Hedge Fund Reports', 'Live Support'
                  ].map((feat, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #1e2a5a' }}>
                      <td style={{ padding: '10px 0', fontSize: '13px', color: '#d1d5db' }}>{feat}</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: i < 2 ? '#22c55e' : '#ef4444' }}>{i < 2 ? '✓' : '✕'}</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: '#22c55e' }}>✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {PLANS.map(plan => (
              <div key={plan.id} style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '20px', border: `2px solid ${plan.color}`, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{plan.price}</p>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>{plan.duration}</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '16px' }}>{plan.desc}</p>
                {profile.plan === 'premium' ? (
                  <div style={{ backgroundColor: '#161e45', borderRadius: '8px', padding: '12px', color: '#9ca3af', fontSize: '14px' }}>Current Plan</div>
                ) : (
                  <button style={{ width: '100%', backgroundColor: plan.color, color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
                    Get {plan.label} Plan →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Change Password */}
        <Link href="/profile/change-password"
          style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔐</span>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>Change Password</span>
          </div>
          <span style={{ color: '#9ca3af' }}>▶</span>
        </Link>

        {/* Log Out */}
        <button onClick={handleLogout}
          style={{ backgroundColor: '#0e1535', borderRadius: '12px', padding: '16px', border: '1px solid #1e2a5a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🚪</span>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>Log Out</span>
          </div>
          <span style={{ color: '#9ca3af' }}>▶</span>
        </button>
      </div>
    </div>
  )
}
