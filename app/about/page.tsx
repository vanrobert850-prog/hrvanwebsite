'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function useReveal() {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
        }, { threshold: 0.08 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return ref
}

const offerings = [
    {
        title: 'Original Paintings',
        desc: 'One-of-a-kind canvases created by hand. Each painting is signed by the artist and comes with a certificate of authenticity.',
        href: '/gallery?category=Paintings',
        cta: 'Browse Paintings',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
            </svg>
        ),
    },
    {
        title: 'Fine Art Prints',
        desc: 'Museum-quality reproductions on archival paper or canvas, produced to order. Own the art you love at every budget.',
        href: '/gallery?category=Prints',
        cta: 'Browse Prints',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
            </svg>
        ),
    },
    {
        title: 'Artist Merchandise',
        desc: 'Apparel, accessories, and home goods featuring original artwork. Wear and share the art you love every day.',
        href: '/gallery',
        cta: 'Shop Merch',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
            </svg>
        ),
    },
]

const benefits = [
    {
        title: 'Global Audience',
        desc: 'Your work reaches art collectors, interior designers, and enthusiasts across the world — not just locally.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
        ),
    },
    {
        title: 'Best Revenue Share',
        desc: 'We pay artists a higher percentage per sale than any traditional gallery or online marketplace.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
        ),
    },
    {
        title: 'Full-Service Sales',
        desc: 'We handle orders, payments, packaging, and worldwide shipping so you can focus on creating.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
            </svg>
        ),
    },
    {
        title: 'Your Own Studio',
        desc: 'A private dashboard to manage your portfolio, track sales and revenue, and connect with your followers.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        title: 'Prints & Merch on Demand',
        desc: 'Upload your art once. We produce fine art prints and branded merchandise to order — zero inventory risk.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
            </svg>
        ),
    },
    {
        title: 'Curator Support',
        desc: 'Our team actively promotes your work through curated collections, social media, and collector newsletters.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
            </svg>
        ),
    },
]

const stats = [
    { value: '4', label: 'Represented Artists' },
    { value: '50+', label: 'Original Works' },
    { value: '10+', label: 'Countries Served' },
    { value: '100%', label: 'Artist First' },
]

const artists = [
    { slug: 'van-robert',    name: 'Van Robert',    specialty: 'Paintings', photo: '/artists/van-robert/portrait.jpg' },
    { slug: 'freddy-javier', name: 'Freddy Javier', specialty: 'Paintings', photo: '/artists/freddy-javier/portrait.jpg' },
    { slug: 'juan-b-nina',   name: 'Juan B. Nina',  specialty: 'Paintings & Poetry', photo: '/artists/juan-b-nina/portrait.jpg' },
    { slug: 'pablo-palasso', name: 'Pablo Palasso', specialty: 'Paintings', photo: '/artists/pablo-palasso/portrait.jpg' },
]

function OfferingCard({ item, index }: { item: typeof offerings[0]; index: number }) {
    const ref = useReveal()
    return (
        <div
            ref={ref as any}
            className={`reveal d${index + 1}`}
            style={{
                background: '#fff',
                border: '1px solid #e8e8e8',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transition: 'box-shadow 0.25s, transform 0.25s',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLElement).style.transform = 'none'
            }}
        >
            <div style={{ color: '#B85C38' }}>{item.icon}</div>
            <div>
                <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.3px', marginBottom: 10, color: '#111' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
            <Link href={item.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                color: '#B85C38', textDecoration: 'none', fontWeight: 500,
                marginTop: 'auto',
            }}>
                {item.cta}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
        </div>
    )
}

function BenefitCard({ item, index }: { item: typeof benefits[0]; index: number }) {
    const ref = useReveal()
    return (
        <div
            ref={ref as any}
            className={`reveal d${(index % 3) + 1}`}
            style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}
        >
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#FAF7F2', border: '1px solid #e8e0d4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#B85C38', flexShrink: 0,
            }}>
                {item.icon}
            </div>
            <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
        </div>
    )
}

export default function AboutPage() {
    const missionRef  = useReveal()
    const storyRef    = useReveal()
    const joinRef     = useReveal()

    return (
        <>
            <Navbar />
            <main style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

                {/* ── HERO ───────────────────────────────────────────────── */}
                <section style={{ position: 'relative', height: 560, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                    <img
                        src="/banner/slide1.jpg"
                        alt="Van Robert Art Gallery"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.2) 100%)' }} />
                    <div className="about-hero" style={{ position: 'relative', zIndex: 2, maxWidth: 680, padding: '0 64px' }}>
                        <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                            About Us
                        </p>
                        <h1 style={{ fontSize: 52, fontWeight: 300, color: '#fff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 24, fontFamily: 'Georgia, serif' }}>
                            Empowering Artists.<br />
                            <em style={{ fontStyle: 'italic', color: '#e8d5c4' }}>Inspiring Collectors.</em>
                        </h1>
                        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 500 }}>
                            Van Robert Art Gallery is a curated platform helping independent artists promote and sell their original art, fine art prints, and merchandise to collectors worldwide.
                        </p>
                    </div>
                </section>

                {/* ── MISSION ────────────────────────────────────────────── */}
                <section className="about-section" style={{ background: '#FAF7F2', padding: '96px 64px' }}>
                    <div
                        ref={missionRef as any}
                        className="reveal"
                        style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}
                    >
                        <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 20, fontWeight: 600 }}>
                            Our Mission
                        </p>
                        <h2 style={{ fontSize: 38, fontWeight: 300, letterSpacing: '-0.8px', color: '#111', marginBottom: 28, fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
                            Every artist deserves a global stage
                        </h2>
                        <p style={{ fontSize: 17, color: '#555', lineHeight: 1.8, marginBottom: 16 }}>
                            We believe extraordinary art should not stay hidden. Van Robert Art Gallery was built to bridge the gap between talented independent artists and the collectors who are searching for work that moves them.
                        </p>
                        <p style={{ fontSize: 17, color: '#555', lineHeight: 1.8 }}>
                            By combining a curated online gallery with print-on-demand merchandise and artist tools, we give creators everything they need to build a sustainable career — and give collectors direct access to authentic, original work.
                        </p>
                    </div>
                </section>

                {/* ── STATS BAR ──────────────────────────────────────────── */}
                <section className="about-header" style={{ background: '#111', padding: '56px 64px' }}>
                    <div className="about-stats" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
                        {stats.map((s, i) => (
                            <div key={i} style={{
                                textAlign: 'center', padding: '24px 16px',
                                borderRight: i < stats.length - 1 ? '1px solid #2a2a2a' : 'none',
                            }}>
                                <p style={{ fontSize: 48, fontWeight: 700, color: '#B85C38', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
                                    {s.value}
                                </p>
                                <p style={{ fontSize: 11, color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── WHAT WE OFFER ──────────────────────────────────────── */}
                <section className="about-section" style={{ padding: '96px 64px', background: '#fff' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                                What We Offer
                            </p>
                            <h2 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.6px', color: '#111', fontFamily: 'Georgia, serif' }}>
                                Art in every form
                            </h2>
                        </div>
                        <div className="about-offerings" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                            {offerings.map((item, i) => <OfferingCard key={i} item={item} index={i} />)}
                        </div>
                    </div>
                </section>

                {/* ── OUR STORY ──────────────────────────────────────────── */}
                <section className="about-section" style={{ background: '#FAF7F2', padding: '96px 64px' }}>
                    <div className="about-story" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                        <div ref={storyRef as any} className="reveal">
                            <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                                Our Story
                            </p>
                            <h2 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.6px', color: '#111', marginBottom: 28, fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
                                Born in the Dominican Republic. Built for the world.
                            </h2>
                            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 20 }}>
                                Van Robert Art Gallery was founded with a simple belief: great art should find its home. We started by representing a handful of painters from the Dominican Republic — artists with extraordinary talent but limited access to global collectors.
                            </p>
                            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 20 }}>
                                Over time, we built the tools and platform to scale that mission. Today, we help every artist we represent sell original paintings, fine art prints, and branded merchandise — all managed through a single, easy-to-use dashboard.
                            </p>
                            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>
                                We handle the commerce. Artists focus on creating. Collectors discover work they love.
                            </p>
                        </div>
                        <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                            <img
                                src="/banner/slide2.jpg"
                                alt="Artist at work"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 24, left: 24, right: 24,
                                background: 'rgba(255,255,255,0.95)', padding: '20px 24px',
                                borderLeft: '3px solid #B85C38',
                            }}>
                                <p style={{ fontSize: 14, fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#333', lineHeight: 1.6 }}>
                                    "We give artists the platform to reach collectors they never could alone — and collectors the access to art they never knew existed."
                                </p>
                                <p style={{ fontSize: 11, color: '#B85C38', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 10, fontWeight: 600 }}>
                                    Van Robert, Founder
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FOR ARTISTS ────────────────────────────────────────── */}
                <section className="about-section" style={{ background: '#fff', padding: '96px 64px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                                For Artists
                            </p>
                            <h2 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.6px', color: '#111', fontFamily: 'Georgia, serif', marginBottom: 16 }}>
                                Everything you need to sell your art
                            </h2>
                            <p style={{ fontSize: 16, color: '#777', maxWidth: 520, margin: '0 auto' }}>
                                Join a gallery that puts artists first — from your first sale to a full-time art career.
                            </p>
                        </div>
                        <div className="about-benefits" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 48px' }}>
                            {benefits.map((item, i) => <BenefitCard key={i} item={item} index={i} />)}
                        </div>
                    </div>
                </section>

                {/* ── MEET THE ARTISTS ───────────────────────────────────── */}
                <section className="about-section" style={{ background: '#FAF7F2', padding: '96px 64px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
                            <div>
                                <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontWeight: 600 }}>
                                    The Artists
                                </p>
                                <h2 style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.6px', color: '#111', fontFamily: 'Georgia, serif' }}>
                                    Meet our community
                                </h2>
                            </div>
                            <Link href="/artists" style={{ fontSize: 11, color: '#111', textDecoration: 'none', border: '1px solid #222', padding: '10px 24px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                                View all artists
                            </Link>
                        </div>
                        <div className="about-artists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                            {artists.map((a, i) => (
                                <Link
                                    key={a.slug}
                                    href={`/artist/${a.slug}`}
                                    className={`reveal d${i + 1}`}
                                    style={{ textDecoration: 'none', display: 'block', group: 'artist' } as any}
                                >
                                    <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', marginBottom: 16, background: '#e8e0d4' }}>
                                        <img
                                            src={a.photo}
                                            alt={a.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <p style={{ fontSize: 15, fontWeight: 500, color: '#111', marginBottom: 4 }}>{a.name}</p>
                                    <p style={{ fontSize: 12, color: '#B85C38', letterSpacing: '1px', textTransform: 'uppercase' }}>{a.specialty}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── JOIN CTA ────────────────────────────────────────────── */}
                <section
                    ref={joinRef as any}
                    className="reveal about-section"
                    style={{ background: '#111', padding: '96px 64px' }}
                >
                    <div className="about-join" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

                        {/* Collect */}
                        <div style={{ background: '#1a1a1a', padding: '56px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', fontWeight: 600 }}>
                                For Collectors
                            </p>
                            <h3 style={{ fontSize: 30, fontWeight: 300, color: '#fff', fontFamily: 'Georgia, serif', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                                Discover art that moves you
                            </h3>
                            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>
                                Browse original paintings, fine art prints, and artist merchandise from independent creators. Every piece comes with a certificate of authenticity and ships worldwide.
                            </p>
                            <Link href="/gallery" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: '#B85C38', color: '#fff', padding: '14px 28px',
                                fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase',
                                textDecoration: 'none', fontWeight: 500,
                                transition: 'background 0.2s', alignSelf: 'flex-start',
                            }}>
                                Shop the Gallery
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>

                        {/* Artists */}
                        <div style={{ background: '#222', padding: '56px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#22c55e', fontWeight: 600 }}>
                                For Artists
                            </p>
                            <h3 style={{ fontSize: 30, fontWeight: 300, color: '#fff', fontFamily: 'Georgia, serif', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                                Sell your art worldwide
                            </h3>
                            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>
                                Apply to join our gallery. We represent artists who are serious about their work and ready to reach a global audience. We handle sales, printing, and shipping — you focus on creating.
                            </p>
                            <Link href="/contact" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'transparent', color: '#fff',
                                border: '1px solid #444', padding: '14px 28px',
                                fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase',
                                textDecoration: 'none', fontWeight: 500,
                                transition: 'border-color 0.2s, color 0.2s', alignSelf: 'flex-start',
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'
                                    ;(e.currentTarget as HTMLElement).style.color = '#22c55e'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#444'
                                    ;(e.currentTarget as HTMLElement).style.color = '#fff'
                                }}
                            >
                                Apply as an Artist
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>

                    </div>
                </section>

                <style>{`
    @media (max-width: 768px) {
        .about-hero { padding: 0 20px !important; }
        .about-hero h1 { font-size: 32px !important; }
        .about-stats { grid-template-columns: repeat(2,1fr) !important; padding: 40px 24px !important; }
        .about-stats > div { border-right: none !important; border-bottom: 1px solid #2a2a2a; padding: 20px 12px !important; }
        .about-offerings { grid-template-columns: 1fr !important; }
        .about-story { grid-template-columns: 1fr !important; gap: 40px !important; }
        .about-benefits { grid-template-columns: 1fr !important; }
        .about-artists-grid { grid-template-columns: repeat(2,1fr) !important; }
        .about-join { grid-template-columns: 1fr !important; }
        .about-section { padding: 56px 24px !important; }
        .about-header { padding: 48px 24px 40px !important; }
    }
    @media (max-width: 480px) {
        .about-hero h1 { font-size: 26px !important; }
        .about-stats { grid-template-columns: 1fr !important; }
        .about-stats > div { border-bottom: 1px solid #2a2a2a; }
    }
`}</style>
            </main>
            <Footer />
        </>
    )
}
