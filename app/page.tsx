'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLang } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const heroSlides = [
    '/banner/slide1.jpg',
    '/banner/slide2.jpg',
    '/banner/slide3.jpg',
]

type ShopifyProduct = {
    id: string
    title: string
    handle: string
    description: string
    vendor: string
    productType: string
    tags: string[]
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
    images: { edges: { node: { url: string; altText: string | null } }[] }
    variants: { edges: { node: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string } } }[] }
}

const allArtists = [
    { slug: 'van-robert',    name: 'Van Robert',    specialty: { en: 'Paintings',          es: 'Pinturas'              }, photo: '/artists/van-robert/portrait.jpg'    },
    { slug: 'freddy-javier', name: 'Freddy Javier', specialty: { en: 'Paintings',          es: 'Pinturas'              }, photo: '/artists/freddy-javier/portrait.jpg' },
    { slug: 'juan-b-nina',   name: 'Juan B. Nina',  specialty: { en: 'Paintings & Poetry', es: 'Pinturas y Poesía'     }, photo: '/artists/juan-b-nina/portrait.jpg'   },
    { slug: 'pablo-palasso', name: 'Pablo Palasso', specialty: { en: 'Paintings',          es: 'Pinturas'              }, photo: '/artists/pablo-palasso/portrait.jpg' },
]

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

const whyRows = [
    { labelKey: 'why.label1', descKey: 'why.desc1', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80' },
    { labelKey: 'why.label2', descKey: 'why.desc2', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    { labelKey: 'why.label3', descKey: 'why.desc3', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80' },
    { labelKey: 'why.label4', descKey: 'why.desc4', img: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80' },
]

const testimonials = [
    {
        quote: 'Van Robert\'s use of color is unlike anything I have seen before. His painting now hangs in my living room and every guest asks about it immediately. A true master.',
        name: 'Marie-Claire D.',
        piece: 'Collector — work by Van Robert',
        img: '/artists/van-robert/cover.jpg',
    },
    {
        quote: 'Freddy Javier captures something deeply Caribbean — the light, the heat, the soul of the island. I purchased two of his pieces and they transformed my home.',
        name: 'Robert A.',
        piece: 'Collector — work by Freddy Javier',
        img: '/artists/freddy-javier/cover.jpg',
    },
    {
        quote: 'Pablo Palasso\'s minimalism is deceptively powerful. One line, one gesture — and yet so much emotion. This gallery gave me access to work I never thought I could own.',
        name: 'Isabelle M.',
        piece: 'Collector — work by Pablo Palasso',
        img: '/artists/pablo-palasso/cover.jpg',
    },
    {
        quote: 'Juan B. Nina\'s poetry lives inside his paintings. His work transcends borders — I found it through this platform and it speaks to me across continents.',
        name: 'Carlos F.',
        piece: 'Collector — work by Juan B. Nina',
        img: '/artists/juan-b-nina/cover.jpg',
    },
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

function ShopifyArtCard({ product, delay }: { product: ShopifyProduct; delay: number }) {
    const ref = useReveal()
    const img    = product.images.edges[0]?.node.url ?? ''
    const price  = parseFloat(product.priceRange.minVariantPrice.amount)
    const artist = product.vendor || product.tags.find(t => t.startsWith('artist:'))?.replace('artist:', '') || ''
    return (
        <Link
            ref={ref as any}
            href={`/artwork/${product.handle}`}
            className={`art-card reveal d${delay}`}
            aria-label={`${product.title} by ${artist}`}
        >
            <div className="art-card-img">
                {img && <img src={img} alt={product.title} loading="lazy" width="400" height="533" />}
                <div className="art-card-actions">
                    <button className="art-card-btn" aria-label="Save" onClick={e => e.preventDefault()}><HeartSmIcon /></button>
                    <button className="art-card-btn" aria-label="Add to cart" onClick={e => e.preventDefault()}><CartSmIcon /></button>
                </div>
            </div>
            <p className="art-card-price">${price.toLocaleString()}</p>
            <p className="art-card-title">{product.title}</p>
            {artist && <p className="art-card-artist">{artist}</p>}
            {product.productType && <p className="art-card-meta">{product.productType}</p>}
        </Link>
    )
}

function ArtworkEmptyState() {
    return (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 24px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" style={{ margin: '0 auto 20px', display: 'block' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
            </svg>
            <p style={{ fontSize: 17, fontFamily: 'Georgia, serif', color: '#888', fontStyle: 'italic', marginBottom: 8 }}>No artwork available at the moment</p>
            <p style={{ fontSize: 13, color: '#bbb' }}>Check back soon — new works are added regularly</p>
        </div>
    )
}

function ArtworkSkeleton() {
    return (
        <>
            {[1,2,3,4].map(i => (
                <div key={i} style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                    <div style={{ background: '#F0EDE8', height: 320, marginBottom: 12 }} />
                    <div style={{ background: '#F0EDE8', height: 14, width: '40%', marginBottom: 8 }} />
                    <div style={{ background: '#F0EDE8', height: 16, width: '70%', marginBottom: 6 }} />
                    <div style={{ background: '#F0EDE8', height: 12, width: '50%' }} />
                </div>
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </>
    )
}

export default function HomePage() {
    const { lang, t } = useLang()

    const [heroIndex,    setHeroIndex]    = useState(0)
    const [activeFilter, setActiveFilter] = useState('all')
    const [activeDot,    setActiveDot]    = useState(0)
    const [fading,       setFading]       = useState(false)
    const [allProducts,  setAllProducts]  = useState<ShopifyProduct[]>([])
    const [loadingArt,   setLoadingArt]   = useState(true)
    const [artists,      setArtists]      = useState(allArtists)

    useEffect(() => { setArtists(shuffle(allArtists)) }, [])

    useEffect(() => {
        fetch('/api/artist-products')
            .then(r => r.json())
            .then(data => {
                const products: ShopifyProduct[] = data.products ?? []
                setAllProducts(shuffle(products))
            })
            .catch(() => setAllProducts([]))
            .finally(() => setLoadingArt(false))
    }, [])

    const filtered =
        activeFilter === 'all'       ? allProducts
            : activeFilter === 'Paintings' ? allProducts.filter(p => p.productType === 'Paintings' || p.tags.includes('Paintings'))
                : allProducts.filter(p => p.productType === 'Prints' || p.tags.includes('Prints'))

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
                        {loadingArt
                            ? <ArtworkSkeleton />
                            : filtered.length === 0
                                ? <ArtworkEmptyState />
                                : filtered.slice(0, 4).map((p, i) => <ShopifyArtCard key={p.id} product={p} delay={i + 1} />)
                        }
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
                        {loadingArt
                            ? <ArtworkSkeleton />
                            : filtered.length <= 4
                                ? <ArtworkEmptyState />
                                : filtered.slice(4, 8).map((p, i) => <ShopifyArtCard key={p.id} product={p} delay={i + 1} />)
                        }
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
                            <p className="testimonial-quote">{testimonials[activeDot].quote}</p>
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