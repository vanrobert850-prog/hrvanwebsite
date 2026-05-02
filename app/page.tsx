'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLang } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const heroSlides = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&q=80',
    'https://images.unsplash.com/photo-1578926288207-a90a103f8021?w=1600&q=80',
    'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=1600&q=80',
]

const artworks = [
    { handle: 'caribbean-light',     title: 'Caribbean light',     artist: 'Freddy Javier', country: 'Dominican Republic', price: 1800, medium: 'Oil on canvas',     size: '24 × 36 in', cat: 'Paintings', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
    { handle: 'silent-garden',       title: 'Silent garden',       artist: 'James Lee',     country: 'United States',      price: 850,  medium: 'Fine art print',    size: '18 × 24 in', cat: 'Prints',    img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
    { handle: 'urban-dusk',          title: 'Urban dusk',          artist: 'Sofia Martens', country: 'Belgium',            price: 2100, medium: 'Acrylic on canvas', size: '40 × 50 in', cat: 'Paintings', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
    { handle: 'morning-bloom',       title: 'Morning bloom',       artist: 'Carlos Vega',   country: 'Mexico',             price: 650,  medium: 'Fine art print',    size: '16 × 20 in', cat: 'Prints',    img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
    { handle: 'desert-wind',         title: 'Desert wind',         artist: 'Layla Hassan',  country: 'Egypt',              price: 1750, medium: 'Oil on canvas',     size: '30 × 40 in', cat: 'Paintings', img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
    { handle: 'ocean-whisper',       title: 'Ocean whisper',       artist: 'Nina Storm',    country: 'Denmark',            price: 980,  medium: 'Fine art print',    size: '20 × 28 in', cat: 'Prints',    img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
    { handle: 'crimson-fields',      title: 'Crimson fields',      artist: 'Andres Mora',   country: 'Colombia',           price: 3200, medium: 'Oil on canvas',     size: '48 × 60 in', cat: 'Paintings', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
    { handle: 'quiet-forest',        title: 'Quiet forest',        artist: 'Yuki Tanaka',   country: 'Japan',              price: 720,  medium: 'Fine art print',    size: '14 × 20 in', cat: 'Prints',    img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
]

const artists = [
    { slug: 'freddy-javier', name: 'Freddy Javier', specialty: { en: 'Paintings',              es: 'Pinturas'               }, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { slug: 'james-lee',     name: 'James Lee',     specialty: { en: 'Fine art prints',       es: 'Grabados de arte'       }, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { slug: 'sofia-martens', name: 'Sofia Martens', specialty: { en: 'Abstract paintings',    es: 'Pinturas abstractas'    }, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
    { slug: 'carlos-vega',   name: 'Carlos Vega',   specialty: { en: 'Prints & illustration', es: 'Grabados e ilustración' }, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
]

const whyRows = [
    { labelKey: 'why.label1', descKey: 'why.desc1', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80' },
    { labelKey: 'why.label2', descKey: 'why.desc2', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    { labelKey: 'why.label3', descKey: 'why.desc3', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80' },
    { labelKey: 'why.label4', descKey: 'why.desc4', img: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80' },
]

const testimonials = [
    { quoteKey: 'testimonial1', name: 'Sarah M.', piece: 'Caribbean light by Freddy Javier', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=300&q=80' },
    { quoteKey: 'testimonial2', name: 'David K.',  piece: 'Ocean whisper by Nina Storm',     img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&q=80' },
    { quoteKey: 'testimonial3', name: 'Carlos V.', piece: 'Artist on Van Robert Art Gallery', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&q=80' },
]

const ArrowIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const HeartSmIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
const CartSmIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>

function useReveal() {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
        }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return ref
}

function ArtCard({ art, delay }: { art: typeof artworks[0]; delay: number }) {
    const ref = useReveal()
    return (
        <Link
            ref={ref as any}
            href={`/artwork/${art.handle}`}
            className={`art-card reveal d${delay}`}
            aria-label={`${art.title} by ${art.artist}`}
        >
            <div className="art-card-img">
                <img src={art.img} alt={`${art.title} by ${art.artist}`} loading="lazy" width="400" height="533" />
                <div className="art-card-actions">
                    <button className="art-card-btn" aria-label="Save" onClick={e => e.preventDefault()}><HeartSmIcon /></button>
                    <button className="art-card-btn" aria-label="Add to cart" onClick={e => e.preventDefault()}><CartSmIcon /></button>
                </div>
            </div>
            <p className="art-card-price">${art.price.toLocaleString()}</p>
            <p className="art-card-title">{art.title}</p>
            <p className="art-card-artist">{art.artist}, {art.country}</p>
            <p className="art-card-meta">{art.medium} &nbsp;·&nbsp; {art.size}</p>
        </Link>
    )
}

export default function HomePage() {
    const { lang, t } = useLang()

    const [heroIndex,    setHeroIndex]    = useState(0)
    const [activeFilter, setActiveFilter] = useState('all')
    const [activeDot,    setActiveDot]    = useState(0)
    const [fading,       setFading]       = useState(false)

    const filtered =
        activeFilter === 'all'       ? artworks
            : activeFilter === 'Paintings' ? artworks.filter(a => a.cat === 'Paintings')
                : artworks.filter(a => a.cat === 'Prints')

    useEffect(() => {
        const timer = setInterval(() => setHeroIndex(i => (i + 1) % heroSlides.length), 6000)
        return () => clearInterval(timer)
    }, [])

    const changeDot = (i: number) => {
        setFading(true)
        setTimeout(() => { setActiveDot(i); setFading(false) }, 250)
    }

    useEffect(() => {
        const timer = setInterval(() => changeDot((activeDot + 1) % testimonials.length), 5000)
        return () => clearInterval(timer)
    }, [activeDot])

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
            })
        }, { threshold: 0.1 })
        document.querySelectorAll('.reveal, .reveal-left').forEach(el => obs.observe(el))
        return () => obs.disconnect()
    }, [activeFilter, lang])

    const trustItems = [
        { labelKey: 'trust.global',   descKey: 'trust.global.desc',   icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></> },
        { labelKey: 'trust.secure',   descKey: 'trust.secure.desc',   icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></> },
        { labelKey: 'trust.shipping', descKey: 'trust.shipping.desc', icon: <><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></> },
        { labelKey: 'trust.support',  descKey: 'trust.support.desc',  icon: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/> },
    ]

    return (
        <>
            <Navbar />
            <main>

                <section className="hero" aria-label="Featured artwork carousel">
                    {heroSlides.map((slide, i) => (
                        <img key={slide} className="hero-img" src={slide}
                             alt={`Van Robert Art Gallery featured artwork ${i + 1}`}
                             style={{ opacity: heroIndex === i ? 1 : 0, transition: 'opacity 1.2s ease', zIndex: heroIndex === i ? 1 : 0 }}
                             width="1600" height="540" loading={i === 0 ? 'eager' : 'lazy'}
                        />
                    ))}
                    <div className="hero-overlay" aria-hidden="true" />
                    <div className="hero-box">
                        <h1>{t('hero.title1')}<br />{t('hero.title2')}</h1>
                        <p>{t('hero.sub')}</p>
                        <Link href="/gallery" className="hero-cta">{t('hero.cta')} <ArrowIcon /></Link>
                    </div>
                    <div className="hero-arrows">
                        <button className="hero-arrow" onClick={() => setHeroIndex(i => (i - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide">&#8249;</button>
                        <button className="hero-arrow" onClick={() => setHeroIndex(i => (i + 1) % heroSlides.length)} aria-label="Next slide">&#8250;</button>
                    </div>
                    <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 4 }}>
                        {heroSlides.map((_, i) => (
                            <button key={i} onClick={() => setHeroIndex(i)} aria-label={`Slide ${i + 1}`}
                                    style={{ width: heroIndex === i ? 22 : 8, height: 8, borderRadius: 4, background: heroIndex === i ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }}
                            />
                        ))}
                    </div>
                </section>

                <div className="filter-bar" role="group" aria-label="Filter artworks">
                    {([
                        ['all',       t('filter.all')],
                        ['Paintings', t('filter.paintings')],
                        ['Prints',    t('filter.prints')],
                    ] as [string, string][]).map(([val, label]) => (
                        <button key={val} className={`filter-pill${activeFilter === val ? ' active' : ''}`}
                                onClick={() => setActiveFilter(val)} aria-pressed={activeFilter === val}>
                            {label}
                        </button>
                    ))}
                </div>

                <section className="section-wrap" aria-labelledby="featured-heading">
                    <div className="section-head">
                        <h2 id="featured-heading">{t('section.featured')}</h2>
                        <Link href="/gallery" className="view-all-link">{t('section.viewAll')}</Link>
                    </div>
                    <div className="art-grid">
                        {filtered.slice(0, 4).map((art, i) => <ArtCard key={art.handle} art={art} delay={i + 1} />)}
                    </div>
                </section>

                <section className="why-section" aria-labelledby="why-heading">
                    <div className="why-left reveal-left">
                        <h2 id="why-heading">{t('why.title1')}<br />{t('why.title2')}</h2>
                        <p>{t('why.desc')}</p>
                    </div>
                    <div className="why-rows">
                        {whyRows.map((row, i) => (
                            <article key={i} className={`why-card reveal d${i + 1}`}>
                                <div className="why-card-img">
                                    <img src={row.img} alt={t(row.labelKey)} loading="lazy" width="800" height="280" />
                                </div>
                                <div className="why-card-text">
                                    <p className="why-card-label">{t(row.labelKey)}</p>
                                    <p className="why-card-desc">{t(row.descKey)}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="category-section reveal" aria-labelledby="category-heading">
                    <h2 id="category-heading">{t('section.shopCat')}</h2>
                    <div className="category-pills">
                        <Link href="/gallery?category=Paintings" className="category-btn">{t('section.catPaintings')}</Link>
                        <Link href="/gallery?category=Prints"    className="category-btn">{t('section.catPrints')}</Link>
                    </div>
                </section>

                <section className="trust-section" aria-labelledby="trust-heading">
                    <h2 id="trust-heading">{t('section.whyShop')}</h2>
                    <p>{t('section.whyShopSub')}</p>
                    <div className="trust-grid">
                        {trustItems.map((item, i) => (
                            <div key={i} className={`trust-card reveal d${i + 1}`}>
                                <div className="trust-icon" aria-hidden="true">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">{item.icon}</svg>
                                </div>
                                <h3>{t(item.labelKey)}</h3>
                                <p>{t(item.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section-wrap" style={{ paddingTop: '56px' }} aria-labelledby="arrivals-heading">
                    <div className="section-head">
                        <h2 id="arrivals-heading">{t('section.newArrivals')}</h2>
                        <Link href="/gallery" className="view-all-link">{t('section.browseAll')}</Link>
                    </div>
                    <div className="art-grid">
                        {filtered.slice(4, 8).map((art, i) => <ArtCard key={art.handle} art={art} delay={i + 1} />)}
                    </div>
                </section>

                <div className="price-section reveal" role="group" aria-label="Shop by price range">
                    <h2>{t('section.shopPrice')}</h2>
                    <div className="price-pills">
                        {['Under $500', '$500 – $1,000', '$1,000 – $2,000', '$2,000 – $5,000'].map(p => (
                            <Link key={p} href={`/gallery?price=${encodeURIComponent(p)}`} className="price-pill">{p}</Link>
                        ))}
                    </div>
                </div>

                <section className="artists-section" aria-labelledby="artists-heading">
                    <div className="section-head">
                        <h2 id="artists-heading">{t('section.featuredArtists')}</h2>
                        <Link href="/artists" className="view-all-link">{t('section.viewAllArtists')}</Link>
                    </div>
                    <div className="artists-grid">
                        {artists.map((a, i) => (
                            <Link key={a.slug} href={`/artist/${a.slug}`} className={`artist-card reveal d${i + 1}`}
                                  aria-label={`${a.name} — ${a.specialty[lang] ?? a.specialty.en}`}>
                                <img className="artist-photo" src={a.photo} alt={a.name} loading="lazy" width="56" height="56" />
                                <p className="artist-name">{a.name}</p>
                                <p className="artist-specialty">{a.specialty[lang] ?? a.specialty.en}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="testimonials-section" aria-labelledby="testimonials-heading">
                    <h2 id="testimonials-heading">{t('section.loved')}</h2>
                    <blockquote className={`testimonial-card${fading ? ' fading' : ''}`}>
                        <div className="testimonial-img">
                            <img src={testimonials[activeDot].img} alt="Collector artwork" loading="lazy" width="120" height="120" />
                        </div>
                        <div>
                            <p className="testimonial-quote">{t(testimonials[activeDot].quoteKey)}</p>
                            <cite className="testimonial-name">{testimonials[activeDot].name}</cite>
                            <p className="testimonial-piece">{testimonials[activeDot].piece}</p>
                        </div>
                    </blockquote>
                    <div className="testimonial-dots" role="tablist">
                        {testimonials.map((_, i) => (
                            <button key={i} className={`t-dot${activeDot === i ? ' active' : ''}`}
                                    onClick={() => changeDot(i)} role="tab" aria-selected={activeDot === i} aria-label={`Testimonial ${i + 1}`} />
                        ))}
                    </div>
                </section>

                <section className="cta-banner" aria-labelledby="cta-heading">
                    <img className="cta-banner-img" src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1600&q=80"
                         alt="Art advisor" loading="lazy" width="1600" height="360" />
                    <div className="cta-banner-overlay" aria-hidden="true" />
                    <div className="cta-banner-content reveal">
                        <h2 id="cta-heading">{t('cta.title')}</h2>
                        <p>{t('cta.desc')}</p>
                        <Link href="/contact" className="cta-banner-btn">{t('cta.btn')}</Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    )
}