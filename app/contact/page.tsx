'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type Step = 1 | 2 | 3
type Flow = 'form' | 'success' | 'error'

const mediums = [
    'Oil on canvas', 'Acrylic on canvas', 'Watercolor',
    'Mixed media', 'Digital art', 'Photography',
    'Sculpture', 'Printmaking', 'Other',
]

const lbl: React.CSSProperties = {
    fontSize: 10, color: '#999', letterSpacing: '2.5px',
    textTransform: 'uppercase', marginBottom: 7,
    display: 'block', fontWeight: 600,
}

// Defined OUTSIDE the page component so React never unmounts inputs on re-render
function Field({ name, label, req, errors, children }: {
    name: string; label: string; req?: boolean
    errors: Record<string, string>; children: React.ReactNode
}) {
    return (
        <div>
            <label style={lbl}>
                {label}{req && <span style={{ color: '#B85C38', marginLeft: 3 }}>*</span>}
            </label>
            {children}
            {errors[name] && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 5 }}>{errors[name]}</p>}
        </div>
    )
}

const steps = [
    { n: 1, label: 'Personal' },
    { n: 2, label: 'Your Art' },
    { n: 3, label: 'Message' },
]

export default function ContactPage() {
    const [flow,    setFlow]    = useState<Flow>('form')
    const [step,    setStep]    = useState<Step>(1)
    const [sending, setSending] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)
    const [errors,  setErrors]  = useState<Record<string, string>>({})

    const [form, setForm] = useState({
        full_name:   '',
        email:       '',
        artist_name: '',
        instagram:   '',
        website:     '',
        medium:      '',
        experience:  '',
        portfolio:   '',
        message:     '',
    })

    const set = (k: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setForm(f => ({ ...f, [k]: e.target.value }))
            if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n })
        }

    const inp = (name: string): React.CSSProperties => ({
        width: '100%', background: '#fff',
        border: `1.5px solid ${errors[name] ? '#ef4444' : focused === name ? '#111' : '#e0dbd4'}`,
        color: '#111', padding: '13px 16px', fontSize: 14, outline: 'none',
        fontFamily: 'inherit', borderRadius: 2,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: focused === name ? '0 0 0 3px rgba(17,17,17,0.06)' : 'none',
        appearance: 'none' as any,
    })

    const validateStep = (s: Step) => {
        const e: Record<string, string> = {}
        if (s === 1) {
            if (!form.full_name.trim())  e.full_name = 'Full name is required'
            if (!form.email.trim())      e.email     = 'Email is required'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
        }
        if (s === 2) {
            if (!form.artist_name.trim()) e.artist_name = 'Artist name is required'
            if (!form.medium)             e.medium      = 'Please select a medium'
            if (!form.portfolio.trim())   e.portfolio   = 'Work samples link is required'
        }
        if (s === 3) {
            if (!form.message.trim())     e.message     = 'Please write a message'
            if (form.message.trim().length < 30) e.message = 'Tell us a bit more (at least 30 characters)'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const next = () => {
        if (!validateStep(step)) return
        setStep(s => Math.min(s + 1, 3) as Step)
    }

    const back = () => {
        setErrors({})
        setStep(s => Math.max(s - 1, 1) as Step)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateStep(3)) return
        setSending(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            setFlow(res.ok ? 'success' : 'error')
        } catch {
            setFlow('error')
        } finally {
            setSending(false)
        }
    }

    const pct = step === 1 ? 33 : step === 2 ? 66 : 100

    return (
        <>
            <Navbar />
            <main style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#FAF7F2', minHeight: '100vh' }}>

                {/* ── HEADER ── */}
                <div className="contact-header" style={{ background: '#111', padding: '72px 64px 64px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                            Join the Gallery
                        </p>
                        <h1 style={{ fontSize: 48, fontWeight: 300, color: '#fff', fontFamily: 'Georgia, serif', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 20 }}>
                            Apply as an Artist
                        </h1>
                        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.7, maxWidth: 520 }}>
                            We represent independent artists ready to reach a global audience. Fill out the form and we'll be in touch within 5 business days.
                        </p>
                    </div>
                </div>

                {/* ── BODY ── */}
                <div className="contact-body" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 64px 96px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 56, alignItems: 'start' }}>

                    {/* ── FORM COLUMN ── */}
                    <div>

                        {/* ── SUCCESS ── */}
                        {flow === 'success' && (
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '72px 56px', textAlign: 'center', animation: 'fadeInUp 0.4s ease' }}>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0faf4', border: '1px solid #bbf0cc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <h2 style={{ fontSize: 32, fontWeight: 300, color: '#111', fontFamily: 'Georgia, serif', marginBottom: 16, letterSpacing: '-0.5px' }}>
                                    Application received!
                                </h2>
                                <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, maxWidth: 400, margin: '0 auto 36px' }}>
                                    Thank you, <strong>{form.artist_name || form.full_name}</strong>. Our team will review your work and get back to you within <strong>5 business days</strong>.
                                </p>
                                <Link href="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#111', color: '#fff', padding: '14px 32px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}>
                                    Browse the Gallery
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </Link>
                            </div>
                        )}

                        {/* ── ERROR ── */}
                        {flow === 'error' && (
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px 56px', textAlign: 'center' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff5f5', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                </div>
                                <h2 style={{ fontSize: 24, fontWeight: 400, color: '#111', marginBottom: 12 }}>Something went wrong</h2>
                                <p style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>We couldn't submit your application. Please try again.</p>
                                <button onClick={() => { setFlow('form'); setStep(3) }} style={{ background: '#111', border: 'none', color: '#fff', padding: '13px 28px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Try Again
                                </button>
                            </div>
                        )}

                        {flow === 'form' && (
                            <>
                                {/* ── PROGRESS ── */}
                                <div style={{ marginBottom: 32 }}>
                                    {/* Step labels */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                        {steps.map(s => (
                                            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{
                                                    width: 26, height: 26, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: step > s.n ? '#22c55e' : step === s.n ? '#111' : '#e8e0d4',
                                                    color: step >= s.n ? '#fff' : '#aaa',
                                                    transition: 'all 0.3s ease', flexShrink: 0,
                                                }}>
                                                    {step > s.n
                                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                                        : s.n
                                                    }
                                                </div>
                                                <span style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: step === s.n ? '#111' : '#aaa', fontWeight: step === s.n ? 700 : 400, transition: 'color 0.3s' }}>
                                                    {s.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Bar */}
                                    <div style={{ height: 3, background: '#e8e0d4', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: '#111', width: `${pct}%`, transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)', borderRadius: 2 }} />
                                    </div>
                                </div>

                                {/* ── STEP 1: Personal ── */}
                                {step === 1 && (
                                    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '40px 40px 36px', borderLeft: '3px solid #B85C38' }}>
                                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 32 }}>
                                                Step 1 — Personal Information
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                                <div className="contact-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                    <Field name="full_name" label="Full Name" req errors={errors}>
                                                        <input type="text" value={form.full_name} onChange={set('full_name')} placeholder="Your full name" style={inp('full_name')} onFocus={() => setFocused('full_name')} onBlur={() => setFocused(null)} />
                                                    </Field>
                                                    <Field name="email" label="Email Address" req errors={errors}>
                                                        <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" style={inp('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                                            <button type="button" onClick={next} style={{ background: '#111', border: 'none', color: '#fff', padding: '15px 36px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s' }}>
                                                Continue
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 2: Art ── */}
                                {step === 2 && (
                                    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '40px 40px 36px', borderLeft: '3px solid #B85C38' }}>
                                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 32 }}>
                                                Step 2 — About Your Art
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                                <div className="contact-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                    <Field name="artist_name" label="Artist / Stage Name" req errors={errors}>
                                                        <input type="text" value={form.artist_name} onChange={set('artist_name')} placeholder="How you sign your work" style={inp('artist_name')} onFocus={() => setFocused('artist_name')} onBlur={() => setFocused(null)} />
                                                    </Field>
                                                    <Field name="medium" label="Primary Medium" req errors={errors}>
                                                        <select value={form.medium} onChange={set('medium')} style={{ ...inp('medium'), cursor: 'pointer', background: '#fff' }} onFocus={() => setFocused('medium')} onBlur={() => setFocused(null)}>
                                                            <option value="">Select medium…</option>
                                                            {mediums.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                    </Field>
                                                </div>
                                                <div className="contact-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                    <Field name="instagram" label="Instagram Handle" errors={errors}>
                                                        <input type="text" value={form.instagram} onChange={set('instagram')} placeholder="@yourhandle" style={inp('instagram')} onFocus={() => setFocused('instagram')} onBlur={() => setFocused(null)} />
                                                    </Field>
                                                    <Field name="experience" label="Years Creating" errors={errors}>
                                                        <input type="number" min="0" max="80" value={form.experience} onChange={set('experience')} placeholder="e.g. 5" style={inp('experience')} onFocus={() => setFocused('experience')} onBlur={() => setFocused(null)} />
                                                    </Field>
                                                </div>
                                                <Field name="website" label="Personal Website" errors={errors}>
                                                    <input type="url" value={form.website} onChange={set('website')} placeholder="https://yourwebsite.com" style={inp('website')} onFocus={() => setFocused('website')} onBlur={() => setFocused(null)} />
                                                </Field>
                                                <Field name="portfolio" label="Link to Work Samples" req errors={errors}>
                                                    <input type="text" value={form.portfolio} onChange={set('portfolio')} placeholder="Google Drive, Dropbox, Instagram, Behance…" style={inp('portfolio')} onFocus={() => setFocused('portfolio')} onBlur={() => setFocused(null)} />
                                                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>Share a link where we can view samples of your work.</p>
                                                </Field>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                                            <button type="button" onClick={back} style={{ background: 'transparent', border: '1.5px solid #ddd', color: '#555', padding: '14px 28px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'border-color 0.2s' }}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                                Back
                                            </button>
                                            <button type="button" onClick={next} style={{ background: '#111', border: 'none', color: '#fff', padding: '15px 36px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                                                Continue
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 3: Message ── */}
                                {step === 3 && (
                                    <form onSubmit={handleSubmit} style={{ animation: 'fadeInUp 0.3s ease' }}>
                                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '40px 40px 36px', borderLeft: '3px solid #B85C38' }}>
                                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
                                                Step 3 — Tell Us About Yourself
                                            </p>
                                            <p style={{ fontSize: 13, color: '#888', marginBottom: 32, lineHeight: 1.5 }}>
                                                This is your chance to introduce yourself. Tell us about your practice, what inspires you, and why you want to join the gallery.
                                            </p>
                                            <div>
                                                <label style={lbl}>Your Message <span style={{ color: '#B85C38' }}>*</span></label>
                                                <textarea
                                                    value={form.message} onChange={set('message')} rows={7}
                                                    placeholder="Tell us about your artistic practice, what you create, why you want to join Van Robert Art Gallery, and what makes your work unique…"
                                                    style={{ ...inp('message'), resize: 'vertical' }}
                                                    onFocus={() => setFocused('message')}
                                                    onBlur={() => setFocused(null)}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                                    {errors.message
                                                        ? <p style={{ fontSize: 11, color: '#ef4444' }}>{errors.message}</p>
                                                        : <p style={{ fontSize: 11, color: '#aaa' }}>Minimum 30 characters.</p>
                                                    }
                                                    <p style={{ fontSize: 11, color: form.message.length > 0 ? '#888' : '#ccc' }}>{form.message.length} / 2000</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review summary */}
                                        <div style={{ background: '#F7F3EE', border: '1px solid #e8e0d4', padding: '20px 24px', marginTop: 2, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                                            <div>
                                                <p style={{ fontSize: 9, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Name</p>
                                                <p style={{ fontSize: 13, color: '#555' }}>{form.full_name}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 9, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Email</p>
                                                <p style={{ fontSize: 13, color: '#555' }}>{form.email}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 9, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Artist Name</p>
                                                <p style={{ fontSize: 13, color: '#555' }}>{form.artist_name}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 9, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Medium</p>
                                                <p style={{ fontSize: 13, color: '#555' }}>{form.medium}</p>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button type="button" onClick={back} style={{ background: 'transparent', border: '1.5px solid #ddd', color: '#555', padding: '14px 28px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                                Back
                                            </button>
                                            <button type="submit" disabled={sending} style={{ background: sending ? '#555' : '#B85C38', border: 'none', color: '#fff', padding: '16px 40px', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s' }}>
                                                {sending ? 'Submitting…' : (
                                                    <>Submit Application <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div className="contact-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 80 }}>

                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '32px 28px' }}>
                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>
                                What Happens Next
                            </p>
                            {[
                                { n: '01', title: 'We review your work', desc: 'Our curators review every application personally within 5 business days.' },
                                { n: '02', title: 'We reach out',        desc: 'If it is a fit, we will contact you to discuss next steps and onboarding.' },
                                { n: '03', title: 'Set up your studio',  desc: 'Upload your art, set prices, and go live with your own gallery page.' },
                                { n: '04', title: 'Start selling',       desc: 'We handle orders, printing, and worldwide shipping. You focus on art.' },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 22 : 0 }}>
                                    <span style={{ fontSize: 11, color: '#B85C38', fontWeight: 700, letterSpacing: '1px', flexShrink: 0, marginTop: 2 }}>{s.n}</span>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 3 }}>{s.title}</p>
                                        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#111', padding: '32px 28px' }}>
                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
                                What We Offer Artists
                            </p>
                            {[
                                'Best revenue share in the market',
                                'Global audience of art collectors',
                                'Fine art prints & merch on demand',
                                'Personal dashboard & analytics',
                                'Curator promotion & newsletters',
                                'Worldwide order fulfillment',
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 5 ? 13 : 0 }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                                    <p style={{ fontSize: 13, color: '#999', lineHeight: 1.5 }}>{item}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#FAF7F2', border: '1px solid #e8e0d4', padding: '22px 28px' }}>
                            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, marginBottom: 10 }}>
                                Already represented? Access your studio dashboard.
                            </p>
                            <Link href="/artists" style={{ fontSize: 11, color: '#B85C38', textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                                View our artists →
                            </Link>
                        </div>

                    </div>
                </div>

                <style>{`
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
        .contact-header { padding: 48px 24px 40px !important; }
        .contact-header h1 { font-size: 32px !important; }
        .contact-body { grid-template-columns: 1fr !important; padding: 40px 20px 64px !important; gap: 32px !important; }
        .contact-sidebar { position: static !important; }
        .contact-field-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 480px) {
        .contact-header h1 { font-size: 26px !important; }
    }
`}</style>

            </main>
            <Footer />
        </>
    )
}
