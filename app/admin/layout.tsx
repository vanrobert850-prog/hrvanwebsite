import { requireAdmin } from '@/app/lib/admin-auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin()

    return (
        <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .adm-nav-link {
                    font-size: 11px; color: #555; text-decoration: none;
                    letter-spacing: 2px; text-transform: uppercase;
                    padding: 8px 16px; border-radius: 2px;
                    transition: color 0.2s, background 0.2s;
                    white-space: nowrap;
                }
                .adm-nav-link:hover { color: #fff; background: #111; }
            `}</style>

            {/* Top bar */}
            <div style={{
                background: '#0a0a0a',
                borderBottom: '1px solid #1c1c1c',
                padding: '0 32px', height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e66', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                        Van Robert
                    </span>
                    <span style={{ width: 1, height: 14, background: '#222', display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: '#444', letterSpacing: '3px', textTransform: 'uppercase' }}>Admin</span>
                </div>

                {/* Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <a href="/admin"              className="adm-nav-link">Dashboard</a>
                    <a href="/admin/artists"      className="adm-nav-link">Artists</a>
                    <a href="/admin/followers"    className="adm-nav-link">Followers</a>
                    <a href="/admin/applications" className="adm-nav-link">Applications</a>
                </nav>

                {/* Actions */}
                <a href="/" style={{
                    fontSize: 10, color: '#444', textDecoration: 'none',
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    padding: '6px 14px', border: '1px solid #222', borderRadius: 2,
                    transition: 'all 0.2s',
                }}>
                    ← Back to site
                </a>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
                {children}
            </div>
        </div>
    )
}
