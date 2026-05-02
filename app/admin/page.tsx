import { requireAdmin } from '@/app/lib/admin-auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export default async function AdminDashboard() {
    await requireAdmin()

    const [
        { count: totalFollows  },
        { count: totalArtists  },
        { data: recentFollows  },
        { data: recentArtists  },
    ] = await Promise.all([
        supabaseAdmin.from('follows').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('artist_profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('follows').select('artist_slug, follower_id, created_at').order('created_at', { ascending: false }).limit(8),
        supabaseAdmin.from('artist_profiles').select('*').order('created_at', { ascending: false }).limit(4),
    ])

    const stats = [
        { label: 'Artists linked',  value: totalArtists ?? 0, color: '#B85C38', icon: '🎨' },
        { label: 'Total follows',   value: totalFollows  ?? 0, color: '#22c55e', icon: '👥' },
    ]

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: 48 }}>
                <p style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
                    Overview
                </p>
                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: 13, color: '#444' }}>
                    Welcome back. Here's what's happening on Van Robert Art Gallery.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, marginBottom: 48, maxWidth: 480 }}>
                {stats.map(s => (
                    <div key={s.label} style={{
                        background: '#0d0d0d', border: '1px solid #1a1a1a',
                        padding: '32px 28px',
                    }}>
                        <p style={{ fontSize: 42, fontWeight: 600, color: s.color, marginBottom: 8, letterSpacing: '-1px' }}>
                            {s.value}
                        </p>
                        <p style={{ fontSize: 11, color: '#333', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

                {/* Recent follows */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                        <p style={{ fontSize: 11, color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Recent Follows
                        </p>
                        <a href="/admin/followers" style={{ fontSize: 11, color: '#333', textDecoration: 'none', letterSpacing: '1px' }}>
                            View all →
                        </a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {!recentFollows?.length ? (
                            <p style={{ fontSize: 13, color: '#333', padding: '20px 0' }}>No follows yet.</p>
                        ) : recentFollows.map((f, i) => (
                            <div key={i} style={{
                                background: '#0d0d0d', border: '1px solid #1a1a1a',
                                padding: '14px 16px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <span style={{ fontSize: 12, color: '#B85C38', marginRight: 8 }}>
                                        @{f.artist_slug}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#333' }}>
                                        new follower
                                    </span>
                                </div>
                                <span style={{ fontSize: 10, color: '#222' }}>
                                    {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Linked artists */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                        <p style={{ fontSize: 11, color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Linked Artists
                        </p>
                        <a href="/admin/artists" style={{ fontSize: 11, color: '#333', textDecoration: 'none', letterSpacing: '1px' }}>
                            Manage →
                        </a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {!recentArtists?.length ? (
                            <p style={{ fontSize: 13, color: '#333', padding: '20px 0' }}>No artists linked yet.</p>
                        ) : recentArtists.map((a, i) => (
                            <div key={i} style={{
                                background: '#0d0d0d', border: '1px solid #1a1a1a',
                                padding: '14px 16px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginRight: 10 }}>
                                        {a.display_name}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#333' }}>@{a.artist_slug}</span>
                                </div>
                                <div style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: '#22c55e', boxShadow: '0 0 6px #22c55e55',
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}