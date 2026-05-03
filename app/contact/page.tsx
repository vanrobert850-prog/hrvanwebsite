'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type Step = 'form' | 'success' | 'error'

const mediums = [
    'Oil on canvas',
    'Acrylic on canvas',
    'Watercolor',
    'Mixed media',
    'Digital art',
    'Photography',
    'Sculpture',
    'Printmaking',
    'Other',
]

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1px solid #ddd',
    color: '#111',
    padding: '13px 16px',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    borderRadius: 0,
    appearance: 'none',
}

const labelStyle: React.CSSProperties = {
    fontSize: 10,
    color: '#999',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    marginBottom: 8,
    display: 'block',
    fontWeight: 600,
}

function Field({
    label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label style={labelStyle}>
                {label}{required && <span style={{ color: '#B85C38', marginLeft: 3 }}>*</span>}
            </label>
            {children}
        </div>
    )
}

export default function ContactPage() {
    const [step, setStep] = useState<Step>('form')
    const [sending, setSending] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)

    const [form, setForm] = useState({
        full_name:    '',
        email:        '',
        artist_name:  '',
        instagram:    '',
        website:      '',
        medium:       '',
        experience:   '',
        portfolio:    '',
        message:      '',
    })

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    const focusStyle = (name: string): React.CSSProperties => ({
        ...inputStyle,
        borderColor: focused === name ? '#111' : '#ddd',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) setStep('success')
            else        setStep('error')
        } catch {
            setStep('error')
        } finally {
            setSending(false)
        }
    }

    return (
        <>
            <Navbar />
            <main style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#FAF7F2', minHeight: '100vh' }}>

                {/* ── HEADER ─────────────────────────────────────────── */}
                <div style={{ background: '#111', padding: '72px 64px 64px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                            Join the Gallery
                        </p>
                        <h1 style={{ fontSize: 48, fontWeight: 300, color: '#fff', fontFamily: 'Georgia, serif', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 20 }}>
                            Apply as an Artist
                        </h1>
                        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.7, maxWidth: 560 }}>
                            We represent independent artists ready to reach a global audience. Tell us about your work and we'll be in touch within 5 business days.
                        </p>
                    </div>
                </div>

                {/* ── CONTENT ────────────────────────────────────────── */}
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 64px 96px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 64, alignItems: 'start' }}>

                    {/* ── FORM ───────────────────────────────────────── */}
                    {step === 'form' && (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                            {/* Personal info */}
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '36px 40px', marginBottom: 2 }}>
                                <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
                                    Personal Information
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                                    <Field label="Full Name" required>
                                        <input
                                            type="text" required value={form.full_name} onChange={set('full_name')}
                                            placeholder="Your full name"
                                            style={focusStyle('full_name')}
                                            onFocus={() => setFocused('full_name')}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </Field>
                                    <Field label="Email Address" required>
                                        <input
                                            type="email" required value={form.email} onChange={set('email')}
                                            placeholder="you@example.com"
                                            style={focusStyle('email')}
                                            onFocus={() => setFocused('email')}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </Field>
                                </div>
                            </div>

                            {/* Artist info */}
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '36px 40px', marginBottom: 2 }}>
                                <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
                                    About Your Art
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                                        <Field label="Artist / Stage Name" required>
                                            <input
                                                type="text" required value={form.artist_name} onChange={set('artist_name')}
                                                placeholder="How you sign your work"
                                                style={focusStyle('artist_name')}
                                                onFocus={() => setFocused('artist_name')}
                                                onBlur={() => setFocused(null)}
                                            />
                                        </Field>
                                        <Field label="Primary Medium" required>
                                            <select
                                                required value={form.medium} onChange={set('medium')}
                                                style={{ ...focusStyle('medium'), cursor: 'pointer', background: '#fff' }}
                                                onFocus={() => setFocused('medium')}
                                                onBlur={() => setFocused(null)}
                                            >
                                                <option value="">Select medium…</option>
                                                {mediums.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </Field>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                                        <Field label="Instagram Handle">
                                            <input
                                                type="text" value={form.instagram} onChange={set('instagram')}
                                                placeholder="@yourhandle"
                                                style={focusStyle('instagram')}
                                                onFocus={() => setFocused('instagram')}
                                                onBlur={() => setFocused(null)}
                                            />
                                        </Field>
                                        <Field label="Years Creating">
                                            <input
                                                type="number" min="0" max="80" value={form.experience} onChange={set('experience')}
                                                placeholder="e.g. 5"
                                                style={focusStyle('experience')}
                                                onFocus={() => setFocused('experience')}
                                                onBlur={() => setFocused(null)}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Portfolio / Website">
                                        <input
                                            type="url" value={form.website} onChange={set('website')}
                                            placeholder="https://yourwebsite.com"
                                            style={focusStyle('website')}
                                            onFocus={() => setFocused('website')}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </Field>
                                    <Field label="Link to Work Samples" required>
                                        <input
                                            type="text" required value={form.portfolio} onChange={set('portfolio')}
                                            placeholder="Google Drive, Dropbox, Instagram, Behance…"
                                            style={focusStyle('portfolio')}
                                            onFocus={() => setFocused('portfolio')}
                                            onBlur={() => setFocused(null)}
                                        />
                                        <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>Share a link where we can view samples of your work.</p>
                                    </Field>
                                </div>
                            </div>

                            {/* Message */}
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '36px 40px', marginBottom: 24 }}>
                                <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
                                    Tell Us About Yourself
                                </p>
                                <Field label="Your Message" required>
                                    <textarea
                                        required value={form.message} onChange={set('message')}
                                        rows={5}
                                        placeholder="Tell us about your artistic practice, what you create, and why you want to join Van Robert Art Gallery…"
                                        style={{
                                            ...focusStyle('message'),
                                            resize: 'vertical',
                                            borderColor: focused === 'message' ? '#111' : '#ddd',
                                        }}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused(null)}
                                    />
                                </Field>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                style={{
                                    background: sending ? '#888' : '#111',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '18px 40px',
                                    fontSize: 11,
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    cursor: sending ? 'not-allowed' : 'pointer',
                                    fontFamily: 'inherit',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    transition: 'background 0.2s',
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {sending ? (
                                    <>Sending…</>
                                ) : (
                                    <>
                                        Submit Application
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* ── SUCCESS ─────────────────────────────────────── */}
                    {step === 'success' && (
                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px 56px', textAlign: 'center' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: '#f0faf4', border: '1px solid #bbf0cc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 28px',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <h2 style={{ fontSize: 28, fontWeight: 300, color: '#111', fontFamily: 'Georgia, serif', marginBottom: 16, letterSpacing: '-0.5px' }}>
                                Application received!
                            </h2>
                            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 32px' }}>
                                Thank you for applying to Van Robert Art Gallery. Our team will review your work and get back to you within <strong>5 business days</strong>.
                            </p>
                            <Link href="/gallery" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: '#111', color: '#fff', padding: '13px 28px',
                                fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase',
                                textDecoration: 'none', fontWeight: 500,
                            }}>
                                Browse the Gallery
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>
                    )}

                    {/* ── ERROR ───────────────────────────────────────── */}
                    {step === 'error' && (
                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px 56px', textAlign: 'center' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: '#fff5f5', border: '1px solid #fecaca',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 28px',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 400, color: '#111', marginBottom: 12 }}>Something went wrong</h2>
                            <p style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>We couldn't submit your application. Please try again.</p>
                            <button
                                onClick={() => setStep('form')}
                                style={{
                                    background: '#111', border: 'none', color: '#fff',
                                    padding: '12px 28px', fontSize: 11, letterSpacing: '2px',
                                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* ── SIDEBAR ─────────────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                        {/* What happens next */}
                        <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '32px 28px' }}>
                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>
                                What Happens Next
                            </p>
                            {[
                                { n: '01', title: 'We review your work', desc: 'Our curators review every application personally within 5 business days.' },
                                { n: '02', title: 'We reach out', desc: 'If it's a fit, we'll contact you to discuss next steps and onboarding.' },
                                { n: '03', title: 'Set up your studio', desc: 'Upload your art, set prices, and go live with your own gallery page.' },
                                { n: '04', title: 'Start selling', desc: 'We handle orders, printing, and worldwide shipping. You focus on art.' },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < 3 ? 24 : 0 }}>
                                    <span style={{ fontSize: 11, color: '#B85C38', fontWeight: 700, letterSpacing: '1px', flexShrink: 0, marginTop: 1 }}>{s.n}</span>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 4 }}>{s.title}</p>
                                        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* We offer */}
                        <div style={{ background: '#111', border: '1px solid #222', padding: '32px 28px' }}>
                            <p style={{ fontSize: 10, color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
                                What We Offer Artists
                            </p>
                            {[
                                'Best revenue share in the market',
                                'Global audience of art collectors',
                                'Fine art print & merch on demand',
                                'Personal dashboard & analytics',
                                'Curator promotion & newsletters',
                                'Worldwide order fulfillment',
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 5 ? 14 : 0 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>{item}</p>
                                </div>
                            ))}
                        </div>

                        {/* Already a member */}
                        <div style={{ background: '#FAF7F2', border: '1px solid #e8e0d4', padding: '24px 28px' }}>
                            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
                                Already a represented artist? Access your studio dashboard.
                            </p>
                            <Link href="/artists" style={{ fontSize: 11, color: '#B85C38', textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                                View our artists →
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
