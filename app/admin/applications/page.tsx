import { requireAdmin } from '@/app/lib/admin-auth'
import { supabaseAdmin } from '@/app/lib/supabase'

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    pending:  { bg: '#1a1400', border: '#554400', text: '#f59e0b' },
    approved: { bg: '#0a1f0f', border: '#1a4a25', text: '#22c55e' },
    rejected: { bg: '#1f0a0a', border: '#4a1a1a', text: '#ef4444' },
}

export default async function AdminApplicationsPage() {
    await requireAdmin()

    const { data: applications } = await supabaseAdmin
        .from('artist_applications')
        .select('*')
        .order('created_at', { ascending: false })

    const pending  = applications?.filter(a => a.status === 'pending').length  ?? 0
    const approved = applications?.filter(a => a.status === 'approved').length ?? 0
    const total    = applications?.length ?? 0

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid #161616' }}>
                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 10 }}>
                    Management
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 6 }}>Artist Applications</h1>
                        <p style={{ fontSize: 13, color: '#555' }}>
                            {total} application{total !== 1 ? 's' : ''} — {pending} pending review
                        </p>
                    </div>
                    {total > 0 && (
                        <div style={{ display: 'flex', gap: 24 }}>
                            {[
                                { label: 'Total',    value: total,    color: '#fff'     },
                                { label: 'Pending',  value: pending,  color: '#f59e0b' },
                                { label: 'Approved', value: approved, color: '#22c55e' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 24, fontWeight: 600, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</p>
                                    <p style={{ fontSize: 10, color: '#555', letterSpacing: '1px' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {total === 0 ? (
                <div style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', padding: 64, textAlign: 'center' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <p style={{ fontSize: 15, color: '#555', fontStyle: 'italic' }}>No applications yet.</p>
                    <p style={{ fontSize: 12, color: '#333', marginTop: 6 }}>Applications submitted via /contact will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {applications!.map((app) => {
                        const sc = statusColors[app.status] ?? statusColors.pending
                        return (
                            <div key={app.id} style={{ background: '#0d0d0d', border: '1px solid #1c1c1c' }}>

                                {/* Row header */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 16, padding: '18px 24px', alignItems: 'center', borderBottom: '1px solid #161616', background: '#0a0a0a' }}>
                                    <div>
                                        <p style={{ fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 2 }}>{app.artist_name}</p>
                                        <p style={{ fontSize: 11, color: '#555' }}>{app.full_name}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 12, color: '#888' }}>{app.email}</p>
                                        {app.medium && <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{app.medium}</p>}
                                    </div>
                                    <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, padding: '4px 12px', borderRadius: 20, textAlign: 'center' }}>
                                        <span style={{ fontSize: 10, color: sc.text, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 11, color: '#444', whiteSpace: 'nowrap' }}>
                                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Details */}
                                <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                                    {app.portfolio && (
                                        <div>
                                            <p style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Portfolio / Samples</p>
                                            <a href={app.portfolio} target="_blank" rel="noopener noreferrer"
                                               style={{ fontSize: 12, color: '#B85C38', wordBreak: 'break-all' }}>
                                                {app.portfolio}
                                            </a>
                                        </div>
                                    )}
                                    {app.instagram && (
                                        <div>
                                            <p style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Instagram</p>
                                            <p style={{ fontSize: 12, color: '#888' }}>{app.instagram}</p>
                                        </div>
                                    )}
                                    {app.website && (
                                        <div>
                                            <p style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Website</p>
                                            <a href={app.website} target="_blank" rel="noopener noreferrer"
                                               style={{ fontSize: 12, color: '#B85C38', wordBreak: 'break-all' }}>
                                                {app.website}
                                            </a>
                                        </div>
                                    )}
                                    {app.experience && (
                                        <div>
                                            <p style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Experience</p>
                                            <p style={{ fontSize: 12, color: '#888' }}>{app.experience} years</p>
                                        </div>
                                    )}
                                    {app.message && (
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <p style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>Message</p>
                                            <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6, fontStyle: 'italic' }}>"{app.message}"</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
