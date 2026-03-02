import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', position: 'relative', backgroundColor: '#080d2b' }}>
      <main style={{ paddingBottom: '80px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
