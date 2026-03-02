'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = { bg: '#050d1a', card: '#0a1628', border: '#0d2137', light: '#071220', cyan: '#00d4ff', muted: '#4a7fa5', dim: '#1a3a5a' }

type Profile = { id: string; full_name: string; student_id: string; phone: string; plan: string; payment_status: string; is_active: boolean }

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: 'Rs 7,900', duration: 'Monthly', desc: 'Full access — pay monthly, cancel anytime.', color: C.cyan, gradient: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))' },
  { id: '6month', label: '6 Months', price: 'Rs 39,900', duration: '6 Months', desc: 'Save 16% — Equivalent to Rs 6,650/mo', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' },
  { id: 'annual', label: 'Annual', price: 'Rs 59,900', duration: 'Annual', desc: 'Save 33% — Equivalent to Rs 4,992/mo', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))' },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [showPlans, setShowPlans] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoaded(true); return }
      setEmail(user.email || '')
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
      } else {
        // Profile row missing — create it with defaults so page still renders
        const fallback: Profile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          student_id: 'MFT' + Math.floor(Math.random() * 900000 + 100000),
          phone: user.user_metadata?.phone || '',
          plan: 'basic',
          payment_status: 'pending',
          is_active: true,
        }
        await supabase.from('profiles').upsert(fallback)
        setProfile(fallback)
      }
      setLoaded(true)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login'); router.refresh()
  }

  if (!loaded) return <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>Loading...</div>
  if (!profile) return <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>Could not load profile. Please log out and sign in again.</div>

  const rowItem = (icon: string, label: string, value: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{icon}</div>
        <span style={{ fontSize: '13px', color: C.muted }}>{label}</span>
      </div>
      {value}
    </div>
  )

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.card}, ${C.bg})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="20" width="6" height="12" rx="1" fill="#00d4ff" />
              <rect x="13" y="13" width="6" height="19" rx="1" fill="#00d4ff" />
              <rect x="22" y="6" width="6" height="26" rx="1" fill="#00d4ff" opacity="0.6" />
            </svg>
          </div>
          <span style={{ fontWeight: '700', fontSize: '17px' }}>Trade with Shafy</span>
        </div>
        <Link href="/notifications" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '16px' }}>🔔</Link>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Profile Hero */}
        <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: `2px solid rgba(0,212,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>{profile.full_name || email.split('@')[0]}</span>
                <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  {profile.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <p style={{ color: C.muted, fontSize: '12px' }}>Student ID: <span style={{ color: C.cyan }}>#{profile.student_id}</span></p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '16px 20px', border: `1px solid ${C.border}` }}>
          <h3 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '13px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Information</h3>
          {rowItem('✉️', 'Email', <span style={{ fontSize: '13px', color: '#d1d5db' }}>{email}</span>)}
          {profile.phone && rowItem('📞', 'Phone', <span style={{ fontSize: '13px', color: '#d1d5db' }}>{profile.phone}</span>)}
        </div>

        {/* Payment Status */}
        <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '16px 20px', border: `1px solid ${C.border}` }}>
          <h3 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '13px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Status</h3>
          {rowItem('💳', 'Current Plan',
            <span style={{ background: 'rgba(0,212,255,0.1)', color: C.cyan, border: '1px solid rgba(0,212,255,0.25)', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
              {profile.plan}
            </span>
          )}
          {rowItem('✅', 'Payment',
            <span style={{ background: profile.payment_status === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: profile.payment_status === 'success' ? '#22c55e' : '#f59e0b', border: `1px solid ${profile.payment_status === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`, padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
              {profile.payment_status}
            </span>
          )}
        </div>

        {/* Manage Plan */}
        <button onClick={() => setShowPlans(!showPlans)}
          style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '16px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👑</div>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Manage Your Plan</span>
          </div>
          <span style={{ color: C.muted, fontSize: '12px' }}>{showPlans ? '▲' : '▶'}</span>
        </button>

        {showPlans && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Feature table */}
            <div style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '16px', border: `1px solid ${C.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', color: C.muted, fontSize: '12px', paddingBottom: '12px', fontWeight: '600' }}>Feature</th>
                    <th style={{ textAlign: 'center', color: 'white', fontSize: '12px', paddingBottom: '12px', fontWeight: '700' }}>BASIC</th>
                    <th style={{ textAlign: 'center', color: C.cyan, fontSize: '12px', paddingBottom: '12px', fontWeight: '700' }}>MASTER</th>
                  </tr>
                </thead>
                <tbody>
                  {['Beginner Course', 'App Access + Notifications', 'Intermediate / Advanced Classes', 'Full Community Access', 'Live Market Research', 'Daily Articles', 'Hedge Fund Reports', 'Live Support'].map((feat, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: '10px 0', fontSize: '12px', color: '#d1d5db' }}>{feat}</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: i < 2 ? '#22c55e' : '#ef4444', fontSize: '14px' }}>{i < 2 ? '✓' : '✕'}</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: '#22c55e', fontSize: '14px' }}>✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {PLANS.map(plan => (
              <div key={plan.id} style={{ borderRadius: '16px', padding: '20px', border: `1px solid ${plan.color}40`, background: plan.gradient, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: '1px', background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />
                <p style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', color: 'white' }}>{plan.price}</p>
                <p style={{ color: C.muted, fontSize: '13px', marginBottom: '4px' }}>{plan.duration}</p>
                <p style={{ color: C.dim, fontSize: '11px', marginBottom: '18px' }}>{plan.desc}</p>
                {profile.plan === 'premium' ? (
                  <div style={{ background: C.border, borderRadius: '10px', padding: '11px', color: C.muted, fontSize: '13px', fontWeight: '600' }}>Current Plan</div>
                ) : (
                  <button style={{ width: '100%', background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, color: plan.id === 'monthly' ? '#050d1a' : 'white', fontWeight: '700', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', letterSpacing: '0.3px' }}>
                    Get {plan.label} Plan →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Change Password */}
        <Link href="/profile/change-password"
          style={{ background: `linear-gradient(160deg, ${C.card}, ${C.light})`, borderRadius: '16px', padding: '16px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.08)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🔐</div>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Change Password</span>
          </div>
          <span style={{ color: C.muted, fontSize: '12px' }}>▶</span>
        </Link>

        {/* Log Out */}
        <button onClick={handleLogout}
          style={{ background: 'rgba(239,68,68,0.05)', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🚪</div>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#fca5a5' }}>Log Out</span>
          </div>
          <span style={{ color: '#fca5a5', fontSize: '12px' }}>▶</span>
        </button>
      </div>
    </div>
  )
}
