import Link from 'next/link'
import { requireAdmin } from '@/app/lib/admin-auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export default async function AdminDashboard() {
    await requireAdmin()

    const [
        { count: totalFollows  },
        { count: totalArtists  },
        { data: recentFollows  },
        { data: recentArtists  },
        { data: recentSales    },
    ] = await Promise.all([
        supabaseAdmin.from('follows').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('artist_profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('follows').select('artist_slug, follower_id, created_at').order('created_at', { ascending: false }).limit(10),
        supabaseAdmin.from('artist_profiles').select('*').order('created_at', { ascending: false }).limit(6),
        supabaseAdmin.from('artist_sales').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    const totalRevenue = (recentSales ?? []).reduce((sum: number, s: any) => sum + Number(s.sale_price ?? 0), 0)

    const stats = [
        {
            label: 'Artists linked',
            value: totalArtists ?? 0,
            color: '#B85C38',
            sub: 'active profiles',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
            ),
        },
        {
            label: 'Total follows',
            value: totalFollows ?? 0,
            color: '#22c55e',
            sub: 'across all artists',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
            ),
        },
        {
            label: 'Recent revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            color: '#3b82f6',
            sub: 'last 5 sales recorded',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
            ),
        },
        {
            label: 'Sales recorded',
            value: recentSales?.length ?? 0,
            color: '#a855f7',
            sub: 'via Shopify webhook',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
            ),
        },
    ]

    const cell: React.CSSProperties = {
        background: '#0d0d0d', border: '1px solid #1c1c1c', padding: '24px 24px',
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid #161616' }}>
                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 10 }}>
                    Overview
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 6 }}>
                            Dashboard
                        </h1>
                        <p style={{ fontSize: 13, color: '#555' }}>
                            Welcome back. Here's what's happening on Van Robert Art Gallery.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link href="/admin/artists" style={{ fontSize: 11, color: '#888', textDecoration: 'none', border: '1px solid #222', padding: '8px 18px', letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                            Manage Artists
                        </Link>
                        <Link href="/admin/followers" style={{ fontSize: 11, color: '#fff', textDecoration: 'none', background: '#B85C38', padding: '8px 18px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            View Analytics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 1 }}>
                {stats.map(s => (
                    <div key={s.label} style={{ ...cell, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <p style={{ fontSize: 11, color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                {s.label}
                            </p>
                            <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 36, fontWeight: 600, color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>
                                {s.value}
                            </p>
                            <p style={{ fontSize: 11, color: '#333', marginTop: 6 }}>{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 1 }}>

                {/* Recent follows */}
                <div style={cell}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <p style={{ fontSize: 11, color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Recent Follows
                        </p>
                        <Link href="/admin/followers" style={{ fontSize: 10, color: '#B85C38', textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            View all →
                        </Link>
                    </div>
                    {!recentFollows?.length ? (
                        <div style={{ padding: '32px 0', textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: '#333', fontStyle: 'italic' }}>No follows yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {recentFollows.map((f, i) => (
                                <div key={i} style={{
                                    padding: '12px 0',
                                    borderBottom: '1px solid #141414',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                                        <div>
                                            <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>@{f.artist_slug}</span>
                                            <span style={{ fontSize: 11, color: '#444', marginLeft: 8 }}>new follower</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 11, color: '#555', flexShrink: 0 }}>
                                        {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Linked artists */}
                <div style={cell}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <p style={{ fontSize: 11, color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Linked Artists
                        </p>
                        <Link href="/admin/artists" style={{ fontSize: 10, color: '#B85C38', textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            Manage →
                        </Link>
                    </div>
                    {!recentArtists?.length ? (
                        <div style={{ padding: '32px 0', textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: '#333', fontStyle: 'italic' }}>No artists linked yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {recentArtists.map((a, i) => (
                                <div key={i} style={{
                                    padding: '12px 0',
                                    borderBottom: '1px solid #141414',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: '#1a1a1a', border: '1px solid #222',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, color: '#B85C38', fontWeight: 600, flexShrink: 0,
                                        }}>
                                            {(a.display_name as string)?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 2 }}>{a.display_name}</p>
                                            <p style={{ fontSize: 10, color: '#444', letterSpacing: '0.5px' }}>@{a.artist_slug}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                                        <span style={{ fontSize: 10, color: '#22c55e', letterSpacing: '1px', textTransform: 'uppercase' }}>Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Recent sales */}
            {(recentSales?.length ?? 0) > 0 && (
                <div style={{ ...cell, marginTop: 1 }}>
                    <p style={{ fontSize: 11, color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
                        Recent Sales
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
                        {recentSales!.map((s: any, i: number) => (
                            <div key={i} style={{ background: '#0a0a0a', border: '1px solid #161616', padding: '16px' }}>
                                <p style={{ fontSize: 12, color: '#fff', fontWeight: 500, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {s.product_title}
                                </p>
                                <p style={{ fontSize: 10, color: '#555', marginBottom: 10 }}>@{s.artist_slug}</p>
                                <p style={{ fontSize: 18, fontWeight: 600, color: '#22c55e', marginBottom: 2 }}>
                                    ${parseFloat(s.artist_revenue).toLocaleString()}
                                </p>
                                <p style={{ fontSize: 10, color: '#444' }}>artist share</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
