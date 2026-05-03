'use client'
import { useState, useEffect } from 'react'

const ARTIST_SLUGS = [
    'van-robert',
    'freddy-javier',
    'juan-b-nina',
    'pablo-palasso',
]

interface ArtistProfile {
    id: string
    artist_slug: string
    clerk_user_id: string
    display_name: string
    created_at: string
}

export default function AdminArtistsPage() {
    const [profiles, setProfiles] = useState<ArtistProfile[]>([])
    const [loading,  setLoading]  = useState(true)
    const [saving,   setSaving]   = useState(false)
    const [msg,      setMsg]      = useState<{ text: string; ok: boolean } | null>(null)
    const [form,     setForm]     = useState({ artist_slug: '', clerk_user_id: '', display_name: '' })

    const fetchProfiles = async () => {
        setLoading(true)
        const res  = await fetch('/api/admin/artists')
        const data = await res.json()
        setProfiles(data.profiles ?? [])
        setLoading(false)
    }

    useEffect(() => { fetchProfiles() }, [])

    const handleSave = async () => {
        if (!form.artist_slug || !form.clerk_user_id || !form.display_name) {
            setMsg({ text: 'All fields are required.', ok: false }); return
        }
        setSaving(true)
        const res  = await fetch('/api/admin/artists', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        const data = await res.json()
        if (data.ok) {
            setMsg({ text: 'Artist linked successfully.', ok: true })
            setForm({ artist_slug: '', clerk_user_id: '', display_name: '' })
            fetchProfiles()
        } else {
            setMsg({ text: data.error ?? 'Something went wrong.', ok: false })
        }
        setSaving(false)
        setTimeout(() => setMsg(null), 4000)
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Remove ${name}? They will lose dashboard access.`)) return
        await fetch(`/api/admin/artists?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        fetchProfiles()
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', background: '#111',
        border: '1px solid #222', color: '#fff',
        padding: '11px 14px', fontSize: 13, outline: 'none',
        fontFamily: 'inherit', transition: 'border-color 0.2s',
        borderRadius: 2,
    }
    const labelStyle: React.CSSProperties = {
        fontSize: 10, color: '#555', letterSpacing: '2px',
        textTransform: 'uppercase', marginBottom: 8, display: 'block',
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid #161616' }}>
                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 10 }}>
                    Management
                </p>
                <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 6 }}>Artists</h1>
                <p style={{ fontSize: 13, color: '#555' }}>
                    Link a Clerk account to an artist profile to grant dashboard access.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }}>

                {/* Form */}
                <div style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', padding: 28, borderRadius: 2 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#555', marginBottom: 24 }}>
                        Link New Artist
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={labelStyle}>Artist Profile</label>
                            <select
                                value={form.artist_slug}
                                onChange={e => setForm(f => ({ ...f, artist_slug: e.target.value }))}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                                <option value="">Select artist...</option>
                                {ARTIST_SLUGS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Clerk User ID</label>
                            <input
                                type="text"
                                placeholder="user_xxxxxxxxxxxxxxxx"
                                value={form.clerk_user_id}
                                onChange={e => setForm(f => ({ ...f, clerk_user_id: e.target.value }))}
                                style={inputStyle}
                            />
                            <p style={{ fontSize: 10, color: '#444', marginTop: 6 }}>
                                clerk.com → Users → click user → copy User ID
                            </p>
                        </div>
                        <div>
                            <label style={labelStyle}>Display Name</label>
                            <input
                                type="text"
                                placeholder="Van Robert"
                                value={form.display_name}
                                onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                background: saving ? '#1a1a1a' : '#B85C38',
                                border: 'none', color: saving ? '#555' : '#fff',
                                padding: '13px', fontSize: 11, letterSpacing: '2px',
                                textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', transition: 'background 0.2s', borderRadius: 2,
                            }}
                        >
                            {saving ? 'Saving...' : 'Link Artist'}
                        </button>
                        {msg && (
                            <div style={{
                                fontSize: 12, padding: '12px 14px',
                                background: msg.ok ? '#0a1f0f' : '#1f0a0a',
                                border: `1px solid ${msg.ok ? '#1a4a25' : '#4a1a1a'}`,
                                color: msg.ok ? '#22c55e' : '#ef4444',
                                borderRadius: 2,
                            }}>
                                {msg.text}
                            </div>
                        )}
                    </div>
                </div>

                {/* Linked artists table */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ fontSize: 10, color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Linked Artists
                            {!loading && (
                                <span style={{ color: '#333', marginLeft: 8 }}>({profiles.length})</span>
                            )}
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', padding: 32, textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>Loading...</p>
                        </div>
                    ) : profiles.length === 0 ? (
                        <div style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', padding: 48, textAlign: 'center' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" style={{ margin: '0 auto 12px', display: 'block' }}>
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                            <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No artists linked yet.</p>
                            <p style={{ fontSize: 11, color: '#333', marginTop: 6 }}>Use the form to link an artist's account.</p>
                        </div>
                    ) : (
                        <>
                            {/* Table header */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
                                padding: '10px 20px', background: '#0a0a0a', border: '1px solid #1c1c1c',
                                borderBottom: 'none',
                            }}>
                                {['Artist', 'Slug', 'Clerk ID', ''].map(h => (
                                    <p key={h} style={{ fontSize: 9, color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>{h}</p>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {profiles.map(p => (
                                    <div key={p.id} style={{
                                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
                                        padding: '16px 20px', alignItems: 'center',
                                        background: '#0d0d0d', border: '1px solid #1c1c1c', borderTop: 'none',
                                        gap: 16,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 30, height: 30, borderRadius: '50%',
                                                background: '#1a1a1a', border: '1px solid #2a2a2a',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 11, color: '#B85C38', fontWeight: 700, flexShrink: 0,
                                            }}>
                                                {p.display_name[0]?.toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{p.display_name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                                            <span style={{ fontSize: 11, color: '#B85C38' }}>@{p.artist_slug}</span>
                                        </div>
                                        <p style={{ fontSize: 10, color: '#555', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.clerk_user_id}
                                        </p>
                                        <button
                                            onClick={() => handleDelete(p.id, p.display_name)}
                                            style={{
                                                background: 'transparent', border: '1px solid #2a1a1a',
                                                color: '#5a2a2a', padding: '5px 12px', fontSize: 9,
                                                cursor: 'pointer', fontFamily: 'inherit',
                                                letterSpacing: '1.5px', textTransform: 'uppercase',
                                                transition: 'all 0.2s', borderRadius: 2, whiteSpace: 'nowrap',
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'
                                                ;(e.currentTarget as HTMLElement).style.color = '#ef4444'
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLElement).style.borderColor = '#2a1a1a'
                                                ;(e.currentTarget as HTMLElement).style.color = '#5a2a2a'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}
