import { requireAdmin } from '@/app/lib/admin-auth'
import { supabaseAdmin } from '@/app/lib/supabase'

export default async function AdminFollowersPage() {
    await requireAdmin()

    const { data: follows } = await supabaseAdmin
        .from('follows')
        .select('*')
        .order('created_at', { ascending: false })

    const byArtist: Record<string, typeof follows> = {}
    follows?.forEach(f => {
        if (!byArtist[f.artist_slug]) byArtist[f.artist_slug] = []
        byArtist[f.artist_slug]!.push(f)
    })

    const sorted = Object.entries(byArtist).sort((a, b) => (b[1]?.length ?? 0) - (a[1]?.length ?? 0))

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid #161616' }}>
                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 10 }}>
                    Analytics
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 6 }}>Followers</h1>
                        <p style={{ fontSize: 13, color: '#555' }}>
                            {follows?.length ?? 0} total follow{follows?.length !== 1 ? 's' : ''} across {sorted.length} artist{sorted.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {sorted.length > 0 && (
                        <div style={{ display: 'flex', gap: 24 }}>
                            {sorted.slice(0, 3).map(([slug, artistFollows]) => (
                                <div key={slug} style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 24, fontWeight: 600, color: '#22c55e', letterSpacing: '-0.5px' }}>
                                        {artistFollows?.length}
                                    </p>
                                    <p style={{ fontSize: 10, color: '#555', letterSpacing: '1px' }}>@{slug}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {sorted.length === 0 ? (
                <div style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', padding: 64, textAlign: 'center' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                    <p style={{ fontSize: 15, color: '#555', fontStyle: 'italic' }}>No follows yet.</p>
                    <p style={{ fontSize: 12, color: '#333', marginTop: 6 }}>Follows will appear here once visitors start following artists.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sorted.map(([slug, artistFollows]) => (
                        <div key={slug} style={{ background: '#0d0d0d', border: '1px solid #1c1c1c' }}>

                            {/* Artist header */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '16px 20px',
                                borderBottom: '1px solid #161616',
                                background: '#0a0a0a',
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: '#1a1a1a', border: '1px solid #222',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, color: '#B85C38', fontWeight: 700, flexShrink: 0,
                                }}>
                                    {slug[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>@{slug}</span>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        background: '#22c55e18', border: '1px solid #22c55e33',
                                        padding: '4px 12px', borderRadius: 20,
                                    }}>
                                        <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                                            {artistFollows?.length} follower{artistFollows?.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Table header */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr auto',
                                padding: '8px 20px',
                                borderBottom: '1px solid #141414',
                            }}>
                                <p style={{ fontSize: 9, color: '#333', letterSpacing: '2px', textTransform: 'uppercase' }}>Follower ID</p>
                                <p style={{ fontSize: 9, color: '#333', letterSpacing: '2px', textTransform: 'uppercase' }}>Date</p>
                            </div>

                            {/* Follower rows */}
                            {artistFollows?.map((f, i) => (
                                <div key={i} style={{
                                    display: 'grid', gridTemplateColumns: '1fr auto',
                                    padding: '11px 20px', alignItems: 'center',
                                    borderBottom: i < (artistFollows.length - 1) ? '1px solid #111' : 'none',
                                    transition: 'background 0.1s',
                                }}>
                                    <span style={{ fontSize: 11, color: '#666', fontFamily: 'monospace' }}>
                                        {f.follower_id}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#444' }}>
                                        {new Date(f.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
