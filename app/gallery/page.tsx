'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const allArtworks = [
    { id: 1,  title: 'Golden horizon',      artist: 'Maria Ruiz',    country: 'Spain',         price: 1200, medium: 'Oil on canvas',     size: '24 × 36 in', category: 'Paintings', style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
    { id: 2,  title: 'Silent garden',       artist: 'James Lee',     country: 'United States',  price: 850,  medium: 'Fine art print',    size: '18 × 24 in', category: 'Prints',    style: 'Contemporary',           subject: 'Nature',       img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
    { id: 3,  title: 'Urban dusk',          artist: 'Sofia Martens', country: 'Belgium',        price: 2100, medium: 'Acrylic on canvas', size: '40 × 50 in', category: 'Paintings', style: 'Abstract',               subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
    { id: 4,  title: 'Morning bloom',       artist: 'Carlos Vega',   country: 'Mexico',         price: 650,  medium: 'Fine art print',    size: '16 × 20 in', category: 'Prints',    style: 'Pop Art',                subject: 'Nature',       img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
    { id: 5,  title: 'Desert wind',         artist: 'Layla Hassan',  country: 'Egypt',          price: 1750, medium: 'Oil on canvas',     size: '30 × 40 in', category: 'Paintings', style: 'Figurative',             subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
    { id: 6,  title: 'Ocean whisper',       artist: 'Nina Storm',    country: 'Denmark',        price: 980,  medium: 'Fine art print',    size: '20 × 28 in', category: 'Prints',    style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
    { id: 7,  title: 'Crimson fields',      artist: 'Andres Mora',   country: 'Colombia',       price: 3200, medium: 'Oil on canvas',     size: '48 × 60 in', category: 'Paintings', style: 'Abstract Expressionism', subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
    { id: 8,  title: 'Quiet forest',        artist: 'Yuki Tanaka',   country: 'Japan',          price: 720,  medium: 'Fine art print',    size: '14 × 20 in', category: 'Prints',    style: 'Contemporary',           subject: 'Nature',       img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
    { id: 9,  title: 'Amber fields',        artist: 'Maria Ruiz',    country: 'Spain',          price: 950,  medium: 'Oil on canvas',     size: '20 × 28 in', category: 'Paintings', style: 'Figurative',             subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
    { id: 10, title: 'Warm light',          artist: 'Maria Ruiz',    country: 'Spain',          price: 1450, medium: 'Oil on canvas',     size: '30 × 40 in', category: 'Paintings', style: 'Contemporary',           subject: 'People',       img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
    { id: 11, title: 'Dusk in Catalonia',   artist: 'Maria Ruiz',    country: 'Spain',          price: 2200, medium: 'Oil on linen',      size: '36 × 48 in', category: 'Paintings', style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
    { id: 12, title: 'Morning fog',         artist: 'James Lee',     country: 'United States',  price: 720,  medium: 'Etching',           size: '16 × 20 in', category: 'Prints',    style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
    { id: 13, title: 'Brooklyn bridge',     artist: 'James Lee',     country: 'United States',  price: 980,  medium: 'Fine art print',    size: '20 × 30 in', category: 'Prints',    style: 'Contemporary',           subject: 'Architecture', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
    { id: 14, title: 'City at rest',        artist: 'James Lee',     country: 'United States',  price: 1100, medium: 'Lithograph',        size: '24 × 32 in', category: 'Prints',    style: 'Modernism',              subject: 'Architecture', img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
    { id: 15, title: 'Kinetic blue',        artist: 'Sofia Martens', country: 'Belgium',        price: 1800, medium: 'Acrylic on canvas', size: '36 × 48 in', category: 'Paintings', style: 'Abstract',               subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
    { id: 16, title: 'Fracture lines',      artist: 'Sofia Martens', country: 'Belgium',        price: 2600, medium: 'Mixed media',       size: '48 × 60 in', category: 'Paintings', style: 'Abstract Expressionism', subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
    { id: 17, title: 'Inner storm',         artist: 'Sofia Martens', country: 'Belgium',        price: 1950, medium: 'Acrylic on canvas', size: '32 × 40 in', category: 'Paintings', style: 'Abstract',               subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
    { id: 18, title: 'Serpent sun',         artist: 'Carlos Vega',   country: 'Mexico',         price: 580,  medium: 'Screen print',      size: '14 × 18 in', category: 'Prints',    style: 'Pop Art',                subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
    { id: 19, title: 'Maize goddess',       artist: 'Carlos Vega',   country: 'Mexico',         price: 890,  medium: 'Fine art print',    size: '20 × 28 in', category: 'Prints',    style: 'Pop Art',                subject: 'People',       img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
    { id: 20, title: 'Night market',        artist: 'Carlos Vega',   country: 'Mexico',         price: 720,  medium: 'Risograph print',   size: '18 × 24 in', category: 'Prints',    style: 'Street Art',             subject: 'People',       img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
    { id: 21, title: 'Nile at dusk',        artist: 'Layla Hassan',  country: 'Egypt',          price: 1900, medium: 'Oil on canvas',     size: '32 × 44 in', category: 'Paintings', style: 'Figurative',             subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
    { id: 22, title: 'Old Cairo',           artist: 'Layla Hassan',  country: 'Egypt',          price: 2400, medium: 'Oil on linen',      size: '40 × 52 in', category: 'Paintings', style: 'Figurative',             subject: 'Architecture', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
    { id: 23, title: 'Sahara morning',      artist: 'Layla Hassan',  country: 'Egypt',          price: 1600, medium: 'Oil on canvas',     size: '28 × 36 in', category: 'Paintings', style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
    { id: 24, title: 'Nordic white',        artist: 'Nina Storm',    country: 'Denmark',        price: 850,  medium: 'Fine art print',    size: '16 × 24 in', category: 'Prints',    style: 'Modernism',              subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
    { id: 25, title: 'Helsingør shore',     artist: 'Nina Storm',    country: 'Denmark',        price: 1200, medium: 'C-type print',      size: '24 × 36 in', category: 'Prints',    style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
    { id: 26, title: 'Winter light',        artist: 'Nina Storm',    country: 'Denmark',        price: 760,  medium: 'Fine art print',    size: '14 × 20 in', category: 'Prints',    style: 'Contemporary',           subject: 'Nature',       img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
    { id: 27, title: 'The blue hour',       artist: 'Andres Mora',   country: 'Colombia',       price: 2800, medium: 'Oil on canvas',     size: '44 × 56 in', category: 'Paintings', style: 'Abstract Expressionism', subject: 'Abstract',     img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
    { id: 28, title: 'Street echo',         artist: 'Andres Mora',   country: 'Colombia',       price: 1400, medium: 'Acrylic on canvas', size: '30 × 40 in', category: 'Paintings', style: 'Street Art',             subject: 'People',       img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
    { id: 29, title: 'Mountain stillness',  artist: 'Yuki Tanaka',   country: 'Japan',          price: 680,  medium: 'Fine art print',    size: '16 × 20 in', category: 'Prints',    style: 'Contemporary',           subject: 'Landscape',    img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
    { id: 30, title: 'Cherry blossom rain', artist: 'Yuki Tanaka',   country: 'Japan',          price: 890,  medium: 'Fine art print',    size: '20 × 28 in', category: 'Prints',    style: 'Contemporary',           subject: 'Nature',       img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
]

const STYLES   = ['Modernism', 'Pop Art', 'Street Art', 'Abstract', 'Abstract Expressionism', 'Contemporary', 'Figurative']
const SUBJECTS = ['People', 'Landscape', 'Still life', 'Nature', 'Architecture', 'Abstract']
const MEDIUMS  = ['Oil on canvas', 'Acrylic on canvas', 'Fine art print', 'Mixed media', 'Etching', 'Lithograph', 'Screen print']
const PRICES   = [
    { label: 'Under $500',      min: 0,    max: 499      },
    { label: '$500 – $1,000',   min: 500,  max: 1000     },
    { label: '$1,000 – $2,000', min: 1001, max: 2000     },
    { label: '$2,000 – $5,000', min: 2001, max: 5000     },
    { label: 'Over $5,000',     min: 5001, max: Infinity  },
]
const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

const HeartIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
const CartIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const PlusIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2"
             style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease', flexShrink: 0 }}>
            <path d="M6 9l6 6 6-6"/>
        </svg>
    )
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div style={{ borderBottom: '1px solid #e8e8e8' }}>
            <button onClick={() => setOpen(o => !o)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase',
                fontFamily: 'inherit', color: '#111',
            }}>
                {title}
                <ChevronIcon open={open} />
            </button>
            {open && <div style={{ paddingBottom: 12 }}>{children}</div>}
        </div>
    )
}

function CheckRow({ label, checked, onChange, radio }: { label: string; checked: boolean; onChange: () => void; radio?: boolean }) {
    return (
        <label onClick={onChange} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0',
            cursor: 'pointer', fontSize: 13, color: checked ? '#111' : '#555', userSelect: 'none',
        }}>
            <div style={{
                width: 16, height: 16, borderRadius: radio ? '50%' : 2,
                border: `1.5px solid ${checked ? '#111' : '#bbb'}`,
                background: checked ? '#111' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s ease',
            }}>
                {checked && (radio
                        ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                        : <svg width="9" height="9" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                )}
            </div>
            {label}
        </label>
    )
}

function ArtCard({ art, index }: { art: typeof allArtworks[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current; if (!el) return
        const timer = setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, index * 50)
        return () => clearTimeout(timer)
    }, [index])

    return (
        <div ref={ref} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
            <Link href={`/artwork/${art.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div
                    style={{ position: 'relative', overflow: 'hidden', background: '#f0ede8', marginBottom: 10 }}
                    onMouseEnter={e => {
                        const img  = e.currentTarget.querySelector('img') as HTMLImageElement
                        const acts = e.currentTarget.querySelector('.acts') as HTMLElement
                        if (img)  img.style.transform = 'scale(1.05)'
                        if (acts) { acts.style.opacity = '1'; acts.style.transform = 'translateY(0)' }
                    }}
                    onMouseLeave={e => {
                        const img  = e.currentTarget.querySelector('img') as HTMLImageElement
                        const acts = e.currentTarget.querySelector('.acts') as HTMLElement
                        if (img)  img.style.transform = 'scale(1)'
                        if (acts) { acts.style.opacity = '0'; acts.style.transform = 'translateY(6px)' }
                    }}
                >
                    <img src={art.img} alt={art.title} loading="lazy"
                         style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                    />
                    <div className="acts" style={{
                        position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 5,
                        opacity: 0, transform: 'translateY(6px)', transition: 'opacity 0.25s ease, transform 0.25s ease',
                    }}>
                        {[<HeartIcon key="h"/>, <PlusIcon key="p"/>, <CartIcon key="c"/>].map((icon, i) => (
                            <button key={i} onClick={e => e.preventDefault()} style={{
                                width: 30, height: 30, background: '#fff', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}>{icon}</button>
                        ))}
                    </div>
                    <div style={{
                        position: 'absolute', top: 8, left: 8,
                        background: 'rgba(255,255,255,0.9)', padding: '3px 7px',
                        fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#666',
                    }}>{art.style}</div>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>${art.price.toLocaleString()}</p>
                <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{art.title}</p>
                <p style={{ fontSize: 11, color: '#888', marginBottom: 1 }}>{art.artist}, {art.country}</p>
                <p style={{ fontSize: 10, color: '#bbb' }}>{art.medium} · {art.size}</p>
            </Link>
        </div>
    )
}

function GalleryInner() {
    const searchParams = useSearchParams()

    const [category,         setCategory]         = useState('All')
    const [selectedStyles,   setSelectedStyles]   = useState<string[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
    const [selectedMediums,  setSelectedMediums]  = useState<string[]>([])
    const [selectedPrice,    setSelectedPrice]    = useState('')
    const [sortBy,           setSortBy]           = useState('Featured')
    const [sidebarOpen,      setSidebarOpen]      = useState(true)
    const [showAllStyles,    setShowAllStyles]    = useState(false)
    const [showAllSubjects,  setShowAllSubjects]  = useState(false)
    const [headerVisible,    setHeaderVisible]    = useState(false)

    useEffect(() => { setTimeout(() => setHeaderVisible(true), 50) }, [])

    // ✅ Re-sync ALL filters whenever URL changes
    useEffect(() => {
        const cat     = searchParams.get('category') || 'All'
        const style   = searchParams.get('style')    || ''
        const subject = searchParams.get('subject')  || ''
        const medium  = searchParams.get('medium')   || ''
        const price   = searchParams.get('price')    || ''

        setCategory(cat)
        setSelectedStyles(style     ? [style]   : [])
        setSelectedSubjects(subject ? [subject] : [])
        setSelectedMediums(medium   ? [medium]  : [])
        setSelectedPrice(price)
    }, [searchParams])

    const toggleStyle   = (s: string) => setSelectedStyles(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
    const toggleSubject = (s: string) => setSelectedSubjects(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
    const toggleMedium  = (s: string) => setSelectedMediums(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

    const activeCount =
        (category !== 'All' ? 1 : 0) +
        selectedStyles.length + selectedSubjects.length +
        selectedMediums.length + (selectedPrice ? 1 : 0)

    const clearAll = () => {
        setCategory('All')
        setSelectedStyles([])
        setSelectedSubjects([])
        setSelectedMediums([])
        setSelectedPrice('')
    }

    let filtered = allArtworks.filter(a => {
        if (category !== 'All' && a.category !== category)          return false
        if (selectedStyles.length   && !selectedStyles.includes(a.style))     return false
        if (selectedSubjects.length && !selectedSubjects.includes(a.subject)) return false
        if (selectedMediums.length  && !selectedMediums.includes(a.medium))   return false
        if (selectedPrice) {
            const r = PRICES.find(p => p.label === selectedPrice)
            if (r && (a.price < r.min || a.price > r.max)) return false
        }
        return true
    })

    if (sortBy === 'Price: Low to High') filtered = [...filtered].sort((a, b) => a.price - b.price)
    if (sortBy === 'Price: High to Low') filtered = [...filtered].sort((a, b) => b.price - a.price)
    if (sortBy === 'Newest')             filtered = [...filtered].reverse()

    const pageTitle = category === 'Paintings' ? 'Original Paintings For Sale'
        : category === 'Prints'    ? 'Fine Art Prints For Sale'
            : 'All Original Artworks'

    const pageDesc = category === 'Paintings'
        ? 'Discover a global selection of original paintings from emerging and independent artists worldwide. Find the perfect handmade artwork to transform your space.'
        : category === 'Prints'
            ? 'Browse fine art prints from independent artists worldwide. Each print is produced to archival standards and comes with a certificate of authenticity.'
            : 'Discover original artworks — paintings and fine art prints — from independent artists around the world.'

    return (
        <main style={{ background: '#FAF7F2', minHeight: '100vh' }}>

            {/* HEADER */}
            <div style={{
                padding: '32px 48px 20px',
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
                <p style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>
                    <Link href="/gallery" style={{ color: '#999', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                        All Artworks
                    </Link>
                    {category !== 'All' && <> / {category}</>}
                    {selectedStyles.length   > 0 && <> / {selectedStyles[0]}</>}
                    {selectedSubjects.length > 0 && <> / {selectedSubjects[0]}</>}
                    {selectedMediums.length  > 0 && <> / {selectedMediums[0]}</>}
                </p>
                <h1 style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 10 }}>
                    {pageTitle}
                </h1>
                <p style={{ fontSize: 14, color: '#666', maxWidth: 780, lineHeight: 1.7 }}>{pageDesc}</p>
            </div>

            {/* TOOLBAR */}
            <div style={{ padding: '0 48px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setSidebarOpen(o => !o)} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        border: '1px solid #ccc', background: '#fff', padding: '8px 16px',
                        fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="4" y1="12" x2="14" y2="12"/>
                            <line x1="4" y1="18" x2="17" y2="18"/>
                        </svg>
                        {sidebarOpen ? 'Hide' : 'Show'} Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                    </button>
                    {activeCount > 0 && (
                        <button onClick={clearAll} style={{
                            fontSize: 12, color: '#B85C38', background: 'none', border: 'none',
                            cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
                        }}>
                            Clear all
                        </button>
                    )}
                    <span style={{ fontSize: 12, color: '#999' }}>{filtered.length} results</span>
                </div>

                {/* ANIMATED SORT PILLS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Sort by:
          </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {SORTS.map(s => (
                            <button
                                key={s}
                                onClick={() => setSortBy(s)}
                                style={{
                                    padding: '7px 14px',
                                    fontSize: 11,
                                    letterSpacing: '0.3px',
                                    border: `1px solid ${sortBy === s ? '#111' : '#ddd'}`,
                                    background: sortBy === s ? '#111' : '#fff',
                                    color: sortBy === s ? '#fff' : '#666',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    transition: 'background 0.25s cubic-bezier(0.4,0,0.2,1), color 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.15s ease, box-shadow 0.15s ease',
                                    transform: sortBy === s ? 'translateY(-1px)' : 'translateY(0)',
                                    boxShadow: sortBy === s ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                                }}
                                onMouseEnter={e => {
                                    if (sortBy !== s) {
                                        (e.currentTarget as HTMLElement).style.borderColor = '#999'
                                        ;(e.currentTarget as HTMLElement).style.color = '#333'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (sortBy !== s) {
                                        (e.currentTarget as HTMLElement).style.borderColor = '#ddd'
                                        ;(e.currentTarget as HTMLElement).style.color = '#666'
                                    }
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SIDEBAR + GRID */}
            <div style={{ display: 'flex', flexDirection: 'row', padding: '0 48px 80px', gap: 40, alignItems: 'flex-start' }}>

                {/* SIDEBAR */}
                {sidebarOpen && (
                    <aside style={{ width: 220, minWidth: 220, flexShrink: 0, animation: 'sideIn 0.3s ease' }}>
                        <style>{`@keyframes sideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }`}</style>

                        <FilterSection title="Category">
                            {['All', 'Paintings', 'Prints'].map(c => (
                                <CheckRow key={c} label={c} checked={category === c} onChange={() => setCategory(c)} radio />
                            ))}
                        </FilterSection>

                        <FilterSection title="Style">
                            {(showAllStyles ? STYLES : STYLES.slice(0, 5)).map(s => (
                                <CheckRow key={s} label={s} checked={selectedStyles.includes(s)} onChange={() => toggleStyle(s)} />
                            ))}
                            <button onClick={() => setShowAllStyles(o => !o)} style={{ fontSize: 11, color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}>
                                {showAllStyles ? 'Show less' : 'Show more'}
                            </button>
                        </FilterSection>

                        <FilterSection title="Subject">
                            {(showAllSubjects ? SUBJECTS : SUBJECTS.slice(0, 4)).map(s => (
                                <CheckRow key={s} label={s} checked={selectedSubjects.includes(s)} onChange={() => toggleSubject(s)} />
                            ))}
                            <button onClick={() => setShowAllSubjects(o => !o)} style={{ fontSize: 11, color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}>
                                {showAllSubjects ? 'Show less' : 'Show more'}
                            </button>
                        </FilterSection>

                        <FilterSection title="Medium" defaultOpen={false}>
                            {MEDIUMS.map(m => (
                                <CheckRow key={m} label={m} checked={selectedMediums.includes(m)} onChange={() => toggleMedium(m)} />
                            ))}
                        </FilterSection>

                        <FilterSection title="Price">
                            {PRICES.map(p => (
                                <CheckRow
                                    key={p.label}
                                    label={p.label}
                                    checked={selectedPrice === p.label}
                                    onChange={() => setSelectedPrice(prev => prev === p.label ? '' : p.label)}
                                    radio
                                />
                            ))}
                        </FilterSection>
                    </aside>
                )}

                {/* ART GRID */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <p style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#888', marginBottom: 16 }}>
                                No artworks match your filters
                            </p>
                            <button onClick={clearAll} style={{
                                fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                                border: '1px solid #111', padding: '10px 24px', cursor: 'pointer',
                                fontFamily: 'inherit', background: 'transparent',
                            }}>
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                            {filtered.map((art, i) => <ArtCard key={art.id} art={art} index={i} />)}
                        </div>
                    )}
                </div>

            </div>
        </main>
    )
}

export default function GalleryPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <main style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#888', fontFamily: 'Georgia, serif', fontSize: 16 }}>Loading artworks...</p>
                </main>
            }>
                <GalleryInner />
            </Suspense>
            <Footer />
        </>
    )
}