'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const INQUIRY_TYPES = [
    'Commission a custom artwork',
    'Pricing & availability',
    'Private viewing / studio visit',
    'Corporate art acquisition',
    'Gallery partnership',
    'Press & media',
    'General inquiry',
]

const BUDGETS = [
    'Under $500',
    '$500 – $2,000',
    '$2,000 – $5,000',
    '$5,000 – $10,000',
    '$10,000 – $25,000',
    'Over $25,000',
    'Not sure yet',
]

const TIMELINES = [
    'As soon as possible',
    'Within 1 month',
    '1 – 3 months',
    '3 – 6 months',
    'No rush / flexible',
]

// ── Floating label field ─────────────────────────────────────────────
function FloatField({ label, required, error, value, span, children }: {
    label: string
    required?: boolean
    error?: string
    value: string
    span?: boolean
    children: (id: string, lifted: boolean, focused: boolean) => React.ReactNode
}) {
    const [focused, setFocused] = useState(false)
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const lifted = focused || value.length > 0

    return (
        <div
            style={{ gridColumn: span ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: 4 }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <div className={`inq-wrap${focused ? ' focused' : ''}${error ? ' has-error' : ''}`}
                 style={{ position: 'relative' }}>
                <label
                    htmlFor={id}
                    className={`inq-label${lifted ? ' lifted' : ''}`}
                >
                    {label}{required && <span style={{ color: '#B85C38', marginLeft: 2 }}>*</span>}
                </label>
                {children(id, lifted, focused)}
            </div>
            {error && (
                <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2, paddingLeft: 2 }}>
                    {error}
                </p>
            )}
        </div>
    )
}

// ── Shared input style (base — label floats over it) ─────────────────
const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '24px 16px 8px', fontSize: 14, lineHeight: 1.4,
    border: '1.5px solid #e8e0d8', borderRadius: 6,
    background: '#fff', color: '#111',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.22s ease, box-shadow 0.22s ease, background 0.18s ease',
    appearance: 'none',
}

function InquireForm() {
    const searchParams = useSearchParams()
    const prefilledArtist = searchParams.get('artist') ?? ''

    const [form, setForm] = useState({
        full_name:    '',
        email:        '',
        phone:        '',
        artist_name:  prefilledArtist,
        inquiry_type: '',
        budget:       '',
        timeline:     '',
        message:      '',
    })
    const [errors,     setErrors]     = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [success,    setSuccess]    = useState(false)

    useEffect(() => {
        if (prefilledArtist) setForm(f => ({ ...f, artist_name: prefilledArtist }))
    }, [prefilledArtist])

    const set = (key: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [key]: e.target.value }))

    const validate = () => {
        const e: Record<string, string> = {}
        if (!form.full_name.trim()) e.full_name = 'Your name is required'
        if (!form.email.trim())     e.email     = 'Your email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email)) e.email = 'Please enter a valid email'
        if (!form.message.trim())   e.message   = 'Tell us what you have in mind'
        return e
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setErrors({})
        setSubmitting(true)
        try {
            const res  = await fetch('/api/inquire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (data.ok) setSuccess(true)
            else setErrors({ _form: data.error ?? 'Something went wrong. Please try again.' })
        } catch {
            setErrors({ _form: 'Network error — please check your connection and try again.' })
        } finally {
            setSubmitting(false)
        }
    }

    if (success) return (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4',
                border: '2px solid #22c55e', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 24px',
            }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 300, fontFamily: 'Georgia, serif', marginBottom: 12 }}>
                Message received
            </h2>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8, marginBottom: 32 }}>
                Thank you for reaching out. One of our curators will review your inquiry
                and get back to you within <strong style={{ color: '#111' }}>1–2 business days</strong>.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/gallery" style={{
                    padding: '12px 28px', background: '#111', color: '#fff',
                    fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: 4,
                }}>Browse Artworks</Link>
                <Link href="/artists" style={{
                    padding: '12px 28px', border: '1px solid #e8e0d8', color: '#555',
                    fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: 4,
                }}>View Artists</Link>
            </div>
        </div>
    )

    return (
        <form onSubmit={handleSubmit} noValidate style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <div className="inquire-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                <FloatField label="Your name" required error={errors.full_name} value={form.full_name}>
                    {(id) => (
                        <input id={id} type="text" value={form.full_name} onChange={set('full_name')}
                            autoComplete="name"
                            style={{ ...inp, borderColor: errors.full_name ? '#ef4444' : undefined }} />
                    )}
                </FloatField>

                <FloatField label="Email address" required error={errors.email} value={form.email}>
                    {(id) => (
                        <input id={id} type="email" value={form.email} onChange={set('email')}
                            autoComplete="email"
                            style={{ ...inp, borderColor: errors.email ? '#ef4444' : undefined }} />
                    )}
                </FloatField>

                <FloatField label="Phone (optional)" value={form.phone}>
                    {(id) => (
                        <input id={id} type="tel" value={form.phone} onChange={set('phone')}
                            autoComplete="tel" style={inp} />
                    )}
                </FloatField>

                <FloatField label="Artist of interest" value={form.artist_name}>
                    {(id) => (
                        <input id={id} type="text" value={form.artist_name} onChange={set('artist_name')}
                            style={inp} />
                    )}
                </FloatField>

                <FloatField label="What can we help with?" value={form.inquiry_type}>
                    {(id, lifted) => (
                        <select id={id} value={form.inquiry_type} onChange={set('inquiry_type')}
                            style={{ ...inp, cursor: 'pointer', color: form.inquiry_type ? '#111' : (lifted ? '#aaa' : 'transparent') }}>
                            <option value="" disabled></option>
                            {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    )}
                </FloatField>

                <FloatField label="Approximate budget" value={form.budget}>
                    {(id, lifted) => (
                        <select id={id} value={form.budget} onChange={set('budget')}
                            style={{ ...inp, cursor: 'pointer', color: form.budget ? '#111' : (lifted ? '#aaa' : 'transparent') }}>
                            <option value="" disabled></option>
                            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    )}
                </FloatField>

                <FloatField label="Desired timeline" value={form.timeline} span>
                    {(id, lifted) => (
                        <select id={id} value={form.timeline} onChange={set('timeline')}
                            style={{ ...inp, cursor: 'pointer', color: form.timeline ? '#111' : (lifted ? '#aaa' : 'transparent') }}>
                            <option value="" disabled></option>
                            {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    )}
                </FloatField>

                <FloatField label="Tell us about your project" required error={errors.message} value={form.message} span>
                    {(id) => (
                        <textarea id={id} value={form.message} onChange={set('message')} rows={5}
                            style={{ ...inp, borderColor: errors.message ? '#ef4444' : undefined, minHeight: 130, resize: 'vertical' }} />
                    )}
                </FloatField>

            </div>

            {errors._form && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 13, color: '#ef4444' }}>
                    {errors._form}
                </div>
            )}

            <button type="submit" disabled={submitting} className="inq-submit"
                style={{
                    marginTop: 24, width: '100%', padding: '17px',
                    background: submitting ? '#aaa' : '#111',
                    color: '#fff', border: 'none', fontSize: 11,
                    letterSpacing: '2.5px', textTransform: 'uppercase',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', borderRadius: 6,
                }}
            >
                {submitting ? 'Sending…' : 'Send Inquiry'}
            </button>

            <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                Your information is kept private and will only be used to respond to your inquiry.
            </p>
        </form>
    )
}

export default function InquirePage() {
    return (
        <>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

                /* ── Floating label ── */
                .inq-label {
                    position: absolute;
                    left: 16px; top: 50%; transform: translateY(-50%);
                    font-size: 13px; color: #aaa; pointer-events: none;
                    transition: top 0.22s cubic-bezier(0.4,0,0.2,1),
                                transform 0.22s cubic-bezier(0.4,0,0.2,1),
                                font-size 0.22s cubic-bezier(0.4,0,0.2,1),
                                color 0.22s ease;
                    transform-origin: left center;
                    white-space: nowrap;
                    letter-spacing: 0;
                }
                /* textarea: label starts near the top */
                .inq-wrap textarea ~ .inq-label,
                .inq-wrap:has(textarea) .inq-label { top: 20px; transform: none; }

                /* lifted: moves above content */
                .inq-label.lifted {
                    top: 9px !important;
                    transform: none !important;
                    font-size: 10px !important;
                    letter-spacing: 0.5px !important;
                    color: #999 !important;
                }
                .inq-wrap.focused .inq-label.lifted {
                    color: #B85C38 !important;
                }

                /* ── Input states ── */
                .inq-wrap input,
                .inq-wrap textarea,
                .inq-wrap select {
                    transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.18s ease;
                }
                .inq-wrap:hover input,
                .inq-wrap:hover textarea,
                .inq-wrap:hover select {
                    border-color: #c8b8a8;
                    background: #fffdf9;
                }
                .inq-wrap.focused input,
                .inq-wrap.focused textarea,
                .inq-wrap.focused select {
                    border-color: #B85C38 !important;
                    box-shadow: 0 0 0 3px rgba(184,92,56,0.10);
                    background: #fff !important;
                }
                .inq-wrap.has-error input,
                .inq-wrap.has-error textarea,
                .inq-wrap.has-error select {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 3px rgba(239,68,68,0.08) !important;
                }

                /* ── Select arrow ── */
                .inq-wrap select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23bbb' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                    padding-right: 40px;
                }
                .inq-wrap.focused select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B85C38' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
                }

                /* ── Submit button ── */
                .inq-submit {
                    transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease !important;
                }
                .inq-submit:not(:disabled):hover {
                    background: #9a4a28 !important;
                    box-shadow: 0 8px 24px rgba(184,92,56,0.30) !important;
                    transform: translateY(-2px);
                }
                .inq-submit:not(:disabled):active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(184,92,56,0.15) !important;
                }

                @media (max-width: 900px) {
                    .inquire-layout  { grid-template-columns: 1fr !important; }
                    .inquire-sidebar { border-left: none !important; border-top: 1px solid #f0ebe3 !important; padding: 32px 0 0 !important; margin-top: 8px !important; }
                }
                @media (max-width: 600px) {
                    .inquire-hero  { padding: 40px 20px 32px !important; }
                    .inquire-body  { padding: 32px 20px 64px !important; }
                    .inquire-grid  { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <Navbar />

            {/* Hero */}
            <div className="inquire-hero" style={{
                background: 'linear-gradient(135deg, #111 0%, #1c1410 100%)',
                padding: '56px 48px 48px',
            }}>
                <div style={{ maxWidth: 820, margin: '0 auto' }}>
                    <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 14 }}>
                        Van Robert Art Gallery
                    </p>
                    <h1 style={{ fontSize: 36, fontWeight: 300, fontFamily: 'Georgia, serif', color: '#fff', marginBottom: 10, letterSpacing: '-0.5px' }}>
                        Contact our Curators
                    </h1>
                    <p style={{ fontSize: 14, color: '#666', maxWidth: 500, lineHeight: 1.7 }}>
                        Whether you're looking to commission a bespoke artwork, purchase a piece, or simply learn more — our team is here to help.
                    </p>
                </div>
            </div>

            {/* Body */}
            <div style={{ background: '#FDFAF6', minHeight: '60vh' }}>
                <div className="inquire-body" style={{ maxWidth: 1000, margin: '0 auto', padding: '52px 48px 80px' }}>
                    <div className="inquire-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 56 }}>

                        {/* Form */}
                        <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                            <Suspense fallback={null}>
                                <InquireForm />
                            </Suspense>
                        </div>

                        {/* Sidebar */}
                        <div className="inquire-sidebar" style={{ borderLeft: '1px solid #f0ebe3', paddingLeft: 40, animation: 'fadeUp 0.4s ease 0.1s both' }}>

                            <div style={{ marginBottom: 36 }}>
                                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                                    What to expect
                                </p>
                                {[
                                    { icon: '01', label: 'We review your inquiry',  sub: 'Our team reads every message personally.'         },
                                    { icon: '02', label: 'We connect you',           sub: 'We match you with the right artist and work.'     },
                                    { icon: '03', label: 'You get a response',       sub: 'Typically within 1–2 business days.'             },
                                ].map(s => (
                                    <div key={s.icon} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                            background: '#fdf5f1', border: '1px solid #f0d8cc',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 9, fontWeight: 700, color: '#B85C38', letterSpacing: '0.5px',
                                        }}>{s.icon}</div>
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 2 }}>{s.label}</p>
                                            <p style={{ fontSize: 11, color: '#aaa', lineHeight: 1.5 }}>{s.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid #f0ebe3', marginBottom: 28 }} />

                            <div style={{ marginBottom: 28 }}>
                                <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: 14, fontWeight: 600 }}>
                                    Also available
                                </p>
                                {[
                                    { label: 'Browse all artworks', href: '/gallery'  },
                                    { label: 'Meet our artists',     href: '/artists'  },
                                    { label: 'Apply as an artist',   href: '/contact'  },
                                    { label: 'About the gallery',    href: '/about'    },
                                ].map(l => (
                                    <Link key={l.href} href={l.href}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#888', textDecoration: 'none', padding: '7px 0', borderBottom: '1px solid #f9f5f0', transition: 'color 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#B85C38'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#888'}
                                    >
                                        <span style={{ color: '#ddd' }}>→</span> {l.label}
                                    </Link>
                                ))}
                            </div>

                            <div style={{ background: '#fff', border: '1px solid #f0ebe3', padding: '16px 18px', borderRadius: 6 }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 600, color: '#111', marginBottom: 4 }}>Private & confidential</p>
                                        <p style={{ fontSize: 11, color: '#aaa', lineHeight: 1.6 }}>
                                            Your details are never shared with third parties and are used solely to respond to your inquiry.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
