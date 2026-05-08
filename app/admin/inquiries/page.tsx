'use client'
import { useState, useEffect } from 'react'

interface Inquiry {
    id: string
    full_name: string
    email: string
    phone: string | null
    artist_name: string | null
    inquiry_type: string | null
    budget: string | null
    timeline: string | null
    message: string
    status: string
    created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    new:        { bg: '#0a1a2a', color: '#3b82f6', border: '#1a3a5a' },
    contacted:  { bg: '#0a1a0f', color: '#22c55e', border: '#1a4a25' },
    closed:     { bg: '#1a1a1a', color: '#555',    border: '#2a2a2a' },
}

export default function AdminInquiriesPage() {
    const [items,   setItems]   = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/admin/inquiries')
            .then(r => r.json())
            .then(d => setItems(d.items ?? []))
            .finally(() => setLoading(false))
    }, [])

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id)
        await fetch('/api/admin/inquiries', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        })
        setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
        setUpdating(null)
    }

    const labelStyle: React.CSSProperties = {
        fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase',
    }
    const valueStyle: React.CSSProperties = { fontSize: 12, color: '#ccc', marginTop: 3 }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid #161616' }}>
                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 10 }}>
                    Curator Inbox
                </p>
                <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 6 }}>Inquiries</h1>
                <p style={{ fontSize: 13, color: '#555' }}>
                    Messages from collectors and clients sent via the "Contact our Curators" form.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>Loading…</p>
                </div>
            ) : items.length === 0 ? (
                <div style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', padding: 64, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No inquiries yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Header row */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 180px 140px 120px 100px',
                        padding: '10px 20px', background: '#0a0a0a', border: '1px solid #1c1c1c',
                        borderBottom: 'none', gap: 12,
                    }}>
                        {['From', 'Artist', 'Type', 'Budget', 'Status'].map(h => (
                            <p key={h} style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>{h}</p>
                        ))}
                    </div>

                    {items.map(item => {
                        const sc = STATUS_COLORS[item.status] ?? STATUS_COLORS.new
                        const isOpen = expanded === item.id
                        return (
                            <div key={item.id} style={{ border: '1px solid #1c1c1c', borderTop: 'none' }}>
                                {/* Summary row */}
                                <div
                                    onClick={() => setExpanded(isOpen ? null : item.id)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '1fr 180px 140px 120px 100px',
                                        padding: '16px 20px', alignItems: 'center', gap: 12,
                                        background: isOpen ? '#111' : '#0d0d0d', cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 2 }}>{item.full_name}</p>
                                        <p style={{ fontSize: 11, color: '#555' }}>
                                            {item.email}{item.phone ? ` · ${item.phone}` : ''}
                                        </p>
                                    </div>
                                    <p style={{ fontSize: 12, color: '#888' }}>{item.artist_name || '—'}</p>
                                    <p style={{ fontSize: 11, color: '#666' }}>{item.inquiry_type || '—'}</p>
                                    <p style={{ fontSize: 11, color: '#666' }}>{item.budget || '—'}</p>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center',
                                        padding: '3px 10px', background: sc.bg,
                                        border: `1px solid ${sc.border}`, borderRadius: 2,
                                        fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase',
                                        color: sc.color, width: 'fit-content',
                                    }}>
                                        {item.status}
                                    </div>
                                </div>

                                {/* Expanded detail */}
                                {isOpen && (
                                    <div style={{ padding: '20px 24px 24px', background: '#0a0a0a', borderTop: '1px solid #161616' }}>
                                        {/* Message */}
                                        <p style={{ ...labelStyle, marginBottom: 8 }}>Message</p>
                                        <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.8, background: '#111', padding: '14px 16px', borderRadius: 2, marginBottom: 20, border: '1px solid #1c1c1c', whiteSpace: 'pre-wrap' }}>
                                            {item.message}
                                        </p>

                                        {/* Details */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
                                            <div>
                                                <p style={labelStyle}>Date received</p>
                                                <p style={valueStyle}>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            {item.timeline && (
                                                <div>
                                                    <p style={labelStyle}>Timeline</p>
                                                    <p style={valueStyle}>{item.timeline}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p style={labelStyle}>Email</p>
                                                <a href={`mailto:${item.email}`} style={{ ...valueStyle, color: '#3b82f6', textDecoration: 'none', display: 'block' }}>{item.email}</a>
                                            </div>
                                            {item.phone && (
                                                <div>
                                                    <p style={labelStyle}>Phone</p>
                                                    <a href={`tel:${item.phone}`} style={{ ...valueStyle, color: '#3b82f6', textDecoration: 'none', display: 'block' }}>{item.phone}</a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status buttons */}
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <p style={{ ...labelStyle, marginRight: 4 }}>Mark as:</p>
                                            {(['new', 'contacted', 'closed'] as const).map(s => (
                                                <button
                                                    key={s}
                                                    disabled={item.status === s || updating === item.id}
                                                    onClick={() => updateStatus(item.id, s)}
                                                    style={{
                                                        padding: '5px 14px', fontSize: 9, letterSpacing: '1.5px',
                                                        textTransform: 'uppercase', cursor: item.status === s ? 'default' : 'pointer',
                                                        fontFamily: 'inherit', borderRadius: 2,
                                                        background: item.status === s ? STATUS_COLORS[s].bg : 'transparent',
                                                        border: `1px solid ${item.status === s ? STATUS_COLORS[s].border : '#2a2a2a'}`,
                                                        color: item.status === s ? STATUS_COLORS[s].color : '#555',
                                                        transition: 'all 0.15s',
                                                        opacity: updating === item.id ? 0.5 : 1,
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
