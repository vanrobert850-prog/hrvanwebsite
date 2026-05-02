import { requireAdmin } from '@/app/lib/admin-auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin() // Server-side check — redirects if not admin

    return (
        <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <style>{`
                * { box-sizing: border-box; }
                .adm-nav-link {
                    font-size: 12px; color: #444; text-decoration: none;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    padding: 6px 0; border-bottom: 1px solid transparent;
                    transition: color 0.2s, border-color 0.2s;
                }
                .adm-nav-link:hover  { color: #fff; border-bottom-color: #B85C38; }
                .adm-nav-link.active { color: #fff; border-bottom-color: #B85C38; }
                .adm-back {
                    font-size: 11px; color: #333; text-decoration: none;
                    letter-spacing: 1px; text-transform: uppercase;
                    padding: 7px 16px; border: 1px solid #222;
                    transition: color 0.2s, border-color 0.2s;
                }
                .adm-back:hover { color: #666; border-color: #444; }
            `}</style>

            {/* Top bar */}
            <div style={{
                background: '#0d0d0d',
                borderBottom: '1px solid #1a1a1a',
                padding: '0 40px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e55' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                            Van Robert Art Gallery
                        </span>
                        <span style={{ fontSize: 10, color: '#333', letterSpacing: '2px', textTransform: 'uppercase', marginLeft: 4 }}>
                            / Admin
                        </span>
                    </div>
                </div>

                {/* Nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <a href="/admin"           className="adm-nav-link">Dashboard</a>
                    <a href="/admin/artists"   className="adm-nav-link">Artists</a>
                    <a href="/admin/followers" className="adm-nav-link">Followers</a>
                </div>

                {/* Back to site */}
                <a href="/" className="adm-back">← Site</a>
            </div>

            {/* Page content */}
            <div style={{ padding: '48px 40px', maxWidth: 1100, margin: '0 auto' }}>
                {children}
            </div>
        </div>
    )
}