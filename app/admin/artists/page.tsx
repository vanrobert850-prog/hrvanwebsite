'use client'
import { useState, useEffect } from 'react'

const ARTIST_SLUGS = [
    'maria-ruiz', 'james-lee', 'sofia-martens',
    'carlos-vega', 'layla-hassan', 'nina-storm',
]

interface ArtistProfile {
    id: string
    artist_slug: string
    clerk_user_id: string
    display_name: string
    created_at: string
}

const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0d0d0d',
    border: '1px solid #1a1a1a', color: '#fff',
    padding: '11px 14px', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
}
const labelStyle: React.CSSProperties = {
    fontSize: 10, color: '#444', letterSpacing: '2px',
    textTransform: 'uppercase', marginBottom: 8, display: 'block',
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

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this artist link? They will lose dashboard access.')) return
        await fetch(`/api/admin/artists?id=${id}`, { method: 'DELETE' })
        fetchProfiles()
    }

    return (
        <div>
            <div style={{ marginBottom: 48 }}>
                <p style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>Management</p>
                <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 4 }}>Artists</h1>
                <p style={{ fontSize: 13, color: '#444' }}>Link a Google account to an artist profile.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 40, alignItems: 'start' }}>
                {/* Form */}
                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: 28 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#444', marginBottom: 24 }}>
                        Link New Artist
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={labelStyle}>Artist Profile</label>
                            <select value={form.artist_slug} onChange={e => setForm(f => ({ ...f, artist_slug: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="">Select artist...</option>
                                {ARTIST_SLUGS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Clerk User ID</label>
                            <input type="text" placeholder="user_xxxxxxxxxxxxxxxx" value={form.clerk_user_id} onChange={e => setForm(f => ({ ...f, clerk_user_id: e.target.value }))} style={inputStyle} />
                            <p style={{ fontSize: 10, color: '#2a2a2a', marginTop: 5 }}>clerk.com → Users → click user → copy User ID</p>
                        </div>
                        <div>
                            <label style={labelStyle}>Display Name</label>
                            <input type="text" placeholder="Maria Ruiz" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} style={inputStyle} />
                        </div>
                        <button onClick={handleSave} disabled={saving} style={{ background: saving ? '#1a1a1a' : '#B85C38', border: 'none', color: saving ? '#444' : '#fff', padding: '12px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            {saving ? 'Saving...' : 'Link Artist'}
                        </button>
                        {msg && (
                            <p style={{ fontSize: 12, padding: '10px 14px', background: msg.ok ? '#0d2010' : '#200d0d', border: `1px solid ${msg.ok ? '#1a4a1a' : '#4a1a1a'}`, color: msg.ok ? '#22c55e' : '#ef4444' }}>
                                {msg.text}
                            </p>
                        )}
                    </div>
                </div>

                {/* Linked artists */}
                <div>
                    <p style={{ fontSize: 10, color: '#444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
                        Linked Artists ({profiles.length})
                    </p>
                    {loading ? (
                        <p style={{ fontSize: 13, color: '#333' }}>Loading...</p>
                    ) : profiles.length === 0 ? (
                        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: 32, textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: '#333' }}>No artists linked yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {profiles.map(p => (
                                <div key={p.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                                            <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{p.display_name}</span>
                                            <span style={{ fontSize: 11, color: '#B85C38' }}>@{p.artist_slug}</span>
                                        </div>
                                        <p style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'monospace', paddingLeft: 15 }}>{p.clerk_user_id}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        style={{ background: 'transparent', border: '1px solid #2a1a1a', color: '#5a2a2a', padding: '6px 14px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a1a1a'; (e.currentTarget as HTMLElement).style.color = '#5a2a2a' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}