'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const C = { bg: '#0a1628', border: '#0d2137', cyan: '#00d4ff', muted: '#2a4a6a' }

export default function BottomNav() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, backgroundColor: C.bg, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 'env(safe-area-inset-bottom, 8px)', paddingTop: '8px', maxWidth: '480px', margin: '0 auto', boxShadow: '0 -8px 32px rgba(0,0,0,0.4)' }}>

      {/* Research */}
      <Link href="/research" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '4px 12px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="12" width="4" height="10" rx="1" fill={isActive('/research') ? '#00d4ff' : C.muted} />
          <rect x="8" y="7" width="4" height="15" rx="1" fill={isActive('/research') ? '#00d4ff' : C.muted} />
          <rect x="14" y="3" width="4" height="19" rx="1" fill={isActive('/research') ? '#00d4ff' : C.muted} />
          <path d="M20 2L22 4L20 6" stroke={isActive('/research') ? '#00d4ff' : C.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/research') ? '#00d4ff' : C.muted, fontWeight: isActive('/research') ? '600' : 'normal' }}>Research</span>
        {isActive('/research') && <div style={{ width: '16px', height: '2px', backgroundColor: '#00d4ff', borderRadius: '1px' }} />}
      </Link>

      {/* Community */}
      <Link href="/community" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '4px 12px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="7" r="3" fill={isActive('/community') ? '#00d4ff' : C.muted} />
          <circle cx="15" cy="7" r="3" fill={isActive('/community') ? '#00d4ff' : C.muted} opacity="0.5" />
          <path d="M3 19c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke={isActive('/community') ? '#00d4ff' : C.muted} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/community') ? '#00d4ff' : C.muted, fontWeight: isActive('/community') ? '600' : 'normal' }}>Community</span>
        {isActive('/community') && <div style={{ width: '16px', height: '2px', backgroundColor: '#00d4ff', borderRadius: '1px' }} />}
      </Link>

      {/* LIVE button */}
      <Link href="/live" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', position: 'relative', marginTop: '-22px' }}>
        <div style={{ position: 'relative', width: '56px', height: '56px' }}>
          <div className="live-ring" />
          <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '9999px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 4px 20px rgba(239,68,68,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="5" fill="white" />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
            </svg>
            <span style={{ fontSize: '8px', color: 'white', fontWeight: '800', letterSpacing: '0.5px' }}>LIVE</span>
          </div>
        </div>
        <style>{`@keyframes livePulse { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2);opacity:0} } .live-ring{position:absolute;inset:0;border-radius:9999px;background:#ef4444;animation:livePulse 1.5s ease-out infinite}`}</style>
      </Link>

      {/* Classroom */}
      <Link href="/classroom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '4px 12px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="14" rx="2" stroke={isActive('/classroom') ? '#00d4ff' : C.muted} strokeWidth="2" />
          <path d="M8 21h8M12 17v4" stroke={isActive('/classroom') ? '#00d4ff' : C.muted} strokeWidth="2" strokeLinecap="round" />
          <path d="M9 9l2 2 4-4" stroke={isActive('/classroom') ? '#00d4ff' : C.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/classroom') ? '#00d4ff' : C.muted, fontWeight: isActive('/classroom') ? '600' : 'normal' }}>Classroom</span>
        {isActive('/classroom') && <div style={{ width: '16px', height: '2px', backgroundColor: '#00d4ff', borderRadius: '1px' }} />}
      </Link>

      {/* Profile */}
      <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '4px 12px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill={isActive('/profile') ? '#00d4ff' : C.muted} />
          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={isActive('/profile') ? '#00d4ff' : C.muted} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/profile') ? '#00d4ff' : C.muted, fontWeight: isActive('/profile') ? '600' : 'normal' }}>Profile</span>
        {isActive('/profile') && <div style={{ width: '16px', height: '2px', backgroundColor: '#00d4ff', borderRadius: '1px' }} />}
      </Link>
    </nav>
  )
}
