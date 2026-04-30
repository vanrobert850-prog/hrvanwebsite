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
            <div style={{ marginBottom: 48 }}>
                <p style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>Analytics</p>
                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 4 }}>Followers</h1>
                <p style={{ fontSize: 13, color: '#444' }}>
                    {follows?.length ?? 0} total follows across {sorted.length} artist{sorted.length !== 1 ? 's' : ''}
                </p>
            </div>

            {sorted.length === 0 ? (
                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: 48, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#333' }}>No follows yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {sorted.map(([slug, artistFollows]) => (
                        <div key={slug}>
                            {/* Artist header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 1, padding: '16px 20px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderBottom: 'none' }}>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#B85C38' }} />
                                <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>@{slug}</span>
                                <span style={{ fontSize: 11, color: '#444', marginLeft: 'auto' }}>
                                    {artistFollows?.length} follower{artistFollows?.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Followers */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {artistFollows?.map((f, i) => (
                                    <div key={i} style={{ background: '#090909', border: '1px solid #141414', padding: '11px 20px', paddingLeft: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 11, color: '#2a2a2a', fontFamily: 'monospace' }}>
                                            {f.follower_id}
                                        </span>
                                        <span style={{ fontSize: 10, color: '#1a1a1a' }}>
                                            {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}