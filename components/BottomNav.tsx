'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: '#0e1535', borderTop: '1px solid #1e2a5a',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      paddingBottom: '8px', paddingTop: '8px', maxWidth: '480px', margin: '0 auto'
    }}>
      {/* Research */}
      <Link href="/research" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="12" width="4" height="10" rx="1" fill={isActive('/research') ? '#c9a227' : '#6b7280'} />
          <rect x="8" y="7" width="4" height="15" rx="1" fill={isActive('/research') ? '#c9a227' : '#6b7280'} />
          <rect x="14" y="3" width="4" height="19" rx="1" fill={isActive('/research') ? '#c9a227' : '#6b7280'} />
          <path d="M20 2L22 4L20 6" stroke={isActive('/research') ? '#c9a227' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/research') ? '#c9a227' : '#6b7280' }}>Research</span>
      </Link>

      {/* Community */}
      <Link href="/community" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="7" r="3" fill={isActive('/community') ? '#c9a227' : '#6b7280'} />
          <circle cx="15" cy="7" r="3" fill={isActive('/community') ? '#c9a227' : '#6b7280'} opacity="0.6" />
          <path d="M3 19c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke={isActive('/community') ? '#c9a227' : '#6b7280'} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/community') ? '#c9a227' : '#6b7280' }}>Community</span>
      </Link>

      {/* LIVE button (center) */}
      <Link href="/live" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', position: 'relative', marginTop: '-20px' }}>
        <div style={{ position: 'relative', width: '56px', height: '56px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '9999px',
            backgroundColor: '#ef4444', opacity: 0.3,
            animation: 'pulse 1.5s ease-out infinite',
          }} />
          <div style={{
            position: 'relative', width: '56px', height: '56px', borderRadius: '9999px',
            backgroundColor: '#ef4444', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 1
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="4" fill="white" />
              <path d="M2 12a10 10 0 0 0 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
            <span style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>LIVE</span>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%{transform:scale(1);opacity:0.3} 100%{transform:scale(1.8);opacity:0} }`}</style>
      </Link>

      {/* Classroom */}
      <Link href="/classroom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="14" rx="2" stroke={isActive('/classroom') ? '#c9a227' : '#6b7280'} strokeWidth="2" />
          <path d="M8 21h8M12 17v4" stroke={isActive('/classroom') ? '#c9a227' : '#6b7280'} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/classroom') ? '#c9a227' : '#6b7280' }}>Classroom</span>
      </Link>

      {/* Profile */}
      <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill={isActive('/profile') ? '#c9a227' : '#6b7280'} />
          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={isActive('/profile') ? '#c9a227' : '#6b7280'} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: '10px', color: isActive('/profile') ? '#c9a227' : '#6b7280' }}>Profile</span>
      </Link>
    </nav>
  )
}
