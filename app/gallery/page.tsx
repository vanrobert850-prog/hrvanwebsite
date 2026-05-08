'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
    getAllProducts,
    formatPrice,
    type ShopifyProduct,
} from '../lib/shopify'

// ── ICONS ─────────────────────────────────────────────────────────
const HeartIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
const CartIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2"
             style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease', flexShrink: 0 }}>
            <path d="M6 9l6 6 6-6"/>
        </svg>
    )
}

// ── HELPERS ───────────────────────────────────────────────────────
function parseTags(tags: string[]): Record<string, string> {
    const map: Record<string, string> = {}
    tags.forEach(tag => {
        const [key, ...rest] = tag.split(':')
        if (rest.length) map[key.trim()] = rest.join(':').trim()
        else map[tag.trim()] = tag.trim()
    })
    return map
}

function getProductPrice(product: ShopifyProduct): number {
    return parseFloat(product.priceRange.minVariantPrice.amount)
}

// ── PRICE RANGES ──────────────────────────────────────────────────
const PRICES = [
    { label: 'Under $500',      min: 0,    max: 499      },
    { label: '$500 – $1,000',   min: 500,  max: 1000     },
    { label: '$1,000 – $2,000', min: 1001, max: 2000     },
    { label: '$2,000 – $5,000', min: 2001, max: 5000     },
    { label: 'Over $5,000',     min: 5001, max: Infinity  },
]

const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

// ── FILTER SECTION ────────────────────────────────────────────────
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

// ── SKELETON CARD ─────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div>
            <div style={{
                width: '100%', aspectRatio: '4/5',
                background: 'linear-gradient(90deg, #f0ede8 25%, #e8e4de 50%, #f0ede8 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 10,
            }} />
            <div style={{ height: 14, width: '40%', background: '#f0ede8', borderRadius: 2, marginBottom: 6, animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: 12, width: '70%', background: '#f0ede8', borderRadius: 2, marginBottom: 4, animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: 11, width: '50%', background: '#f0ede8', borderRadius: 2, animation: 'shimmer 1.4s infinite' }} />
        </div>
    )
}

// ── ART CARD ──────────────────────────────────────────────────────
function ArtCard({ product, index, wishlistedHandles, onWishlistToggle, showWishlist }: {
    product: ShopifyProduct
    index: number
    wishlistedHandles?: Set<string>
    onWishlistToggle?: (handle: string) => void
    showWishlist?: boolean
}) {
    const ref = useRef<HTMLDivElement>(null)
    const tagMap    = parseTags(product.tags)
    const price     = getProductPrice(product)
    const imageNode = product.images?.edges?.[0]?.node

    // Use the actual image dimensions from Shopify to preserve natural aspect ratio
    const imgUrl    = imageNode?.url ?? ''
    const imgWidth  = imageNode?.width  ?? 800
    const imgHeight = imageNode?.height ?? 800
    const aspectRatio = `${imgWidth} / ${imgHeight}`
    const isWishlisted = wishlistedHandles?.has(product.handle) ?? false

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
            <Link href={`/artwork/${product.handle}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div
                    style={{ position: 'relative', overflow: 'hidden', background: '#f0ede8', marginBottom: 10 }}
                    onMouseEnter={e => {
                        const img  = e.currentTarget.querySelector('img') as HTMLImageElement
                        const acts = e.currentTarget.querySelector('.acts') as HTMLElement
                        const heart = e.currentTarget.querySelector('.gallery-card-heart') as HTMLElement
                        if (img)  img.style.transform = 'scale(1.05)'
                        if (acts) { acts.style.opacity = '1'; acts.style.transform = 'translateY(0)' }
                        if (heart) heart.style.opacity = '1'
                    }}
                    onMouseLeave={e => {
                        const img  = e.currentTarget.querySelector('img') as HTMLImageElement
                        const acts = e.currentTarget.querySelector('.acts') as HTMLElement
                        const heart = e.currentTarget.querySelector('.gallery-card-heart') as HTMLElement
                        if (img)  img.style.transform = 'scale(1)'
                        if (acts) { acts.style.opacity = '0'; acts.style.transform = 'translateY(6px)' }
                        if (heart && window.innerWidth > 768) heart.style.opacity = '0'
                    }}
                >
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt={imageNode?.altText || product.title}
                            loading="lazy"
                            width={imgWidth}
                            height={imgHeight}
                            style={{
                                width: '100%',
                                height: 'auto',
                                aspectRatio,
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%', aspectRatio: '4/5', background: '#e8e4de', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                    )}

                    {/* Wishlist heart button */}
                    {showWishlist && onWishlistToggle && (
                        <button
                            className="gallery-card-heart"
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            onClick={e => { e.preventDefault(); e.stopPropagation(); onWishlistToggle(product.handle) }}
                            style={{
                                position: 'absolute', top: 10, right: 10,
                                width: 34, height: 34, borderRadius: '50%',
                                background: '#fff', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                opacity: 0, transition: 'opacity 0.2s ease',
                                zIndex: 3,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24"
                                 fill={isWishlisted ? '#B85C38' : 'none'}
                                 stroke={isWishlisted ? '#B85C38' : '#555'}
                                 strokeWidth="1.5">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                            </svg>
                        </button>
                    )}

                    {/* Action buttons */}
                    <div className="acts" style={{
                        position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 5,
                        opacity: 0, transform: 'translateY(6px)', transition: 'opacity 0.25s ease, transform 0.25s ease',
                    }}>
                        {[<HeartIcon key="h"/>, <CartIcon key="c"/>].map((icon, i) => (
                            <button key={i} onClick={e => e.preventDefault()} style={{
                                width: 30, height: 30, background: '#fff', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}>{icon}</button>
                        ))}
                    </div>

                    {/* Style badge */}
                    {(tagMap.style || product.productType) && (
                        <div style={{
                            position: 'absolute', top: 8, left: 8,
                            background: 'rgba(255,255,255,0.9)', padding: '3px 7px',
                            fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#666',
                        }}>
                            {tagMap.style || product.productType}
                        </div>
                    )}
                </div>

                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                    {formatPrice(String(price), product.priceRange.minVariantPrice.currencyCode)}
                </p>
                <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{product.title}</p>
                <p style={{ fontSize: 11, color: '#888', marginBottom: 1 }}>
                    {product.vendor}{tagMap.country ? `, ${tagMap.country}` : ''}
                </p>
                <p style={{ fontSize: 10, color: '#bbb' }}>
                    {tagMap.medium || product.productType}
                </p>
            </Link>
        </div>
    )
}

// ── MAIN GALLERY ──────────────────────────────────────────────────
function GalleryInner() {
    const searchParams = useSearchParams()
    const { user } = useUser()

    const [allProducts,        setAllProducts]        = useState<ShopifyProduct[]>([])
    const [loading,            setLoading]            = useState(true)
    const [category,           setCategory]           = useState('All')
    const [selectedStyles,     setSelectedStyles]     = useState<string[]>([])
    const [selectedMediums,    setSelectedMediums]    = useState<string[]>([])
    const [selectedPrice,      setSelectedPrice]      = useState('')
    const [sortBy,             setSortBy]             = useState('Featured')
    const [sidebarOpen,        setSidebarOpen]        = useState(true)
    const [mobileSidebarOpen,  setMobileSidebarOpen]  = useState(false)
    const [headerVisible,      setHeaderVisible]      = useState(false)
    const [wishlistedHandles,  setWishlistedHandles]  = useState<Set<string>>(new Set())

    // Fetch all products from Shopify on mount
    useEffect(() => {
        setLoading(true)
        getAllProducts()
            .then(products => { setAllProducts(products); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!user) return
        fetch('/api/wishlist')
            .then(r => r.ok ? r.json() : { items: [] })
            .then(data => {
                const handles = (data.items ?? []).map((item: { product_handle: string }) => item.product_handle)
                setWishlistedHandles(new Set(handles))
            })
            .catch(() => {})
    }, [user])

    const handleWishlistToggle = async (handle: string) => {
        if (!user) return
        const wasWishlisted = wishlistedHandles.has(handle)
        setWishlistedHandles(prev => {
            const next = new Set(prev)
            if (wasWishlisted) next.delete(handle)
            else next.add(handle)
            return next
        })
        try {
            if (wasWishlisted) {
                await fetch('/api/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_handle: handle }) })
            } else {
                await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_handle: handle }) })
            }
        } catch {
            setWishlistedHandles(prev => {
                const next = new Set(prev)
                if (wasWishlisted) next.add(handle)
                else next.delete(handle)
                return next
            })
        }
    }

    useEffect(() => { setTimeout(() => setHeaderVisible(true), 50) }, [])

    // Sync filters from URL params
    useEffect(() => {
        setCategory(searchParams.get('category') || 'All')
        setSelectedStyles(searchParams.get('style')  ? [searchParams.get('style')!]  : [])
        setSelectedMediums(searchParams.get('medium') ? [searchParams.get('medium')!] : [])
        setSelectedPrice(searchParams.get('price') || '')
    }, [searchParams])

    // Build filter options dynamically from real Shopify data
    const allStyles = [...new Set(
        allProducts.map(p => parseTags(p.tags).style).filter(Boolean)
    )].sort() as string[]

    const allMediums = [...new Set(
        allProducts.map(p => parseTags(p.tags).medium || p.productType).filter(Boolean)
    )].sort() as string[]

    const allCategories = ['All', ...new Set(
        allProducts.map(p => p.productType).filter(Boolean)
    )]

    const toggleStyle  = (s: string) => setSelectedStyles(p  => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
    const toggleMedium = (s: string) => setSelectedMediums(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

    const activeCount =
        (category !== 'All' ? 1 : 0) +
        selectedStyles.length + selectedMediums.length +
        (selectedPrice ? 1 : 0)

    const clearAll = () => {
        setCategory('All')
        setSelectedStyles([])
        setSelectedMediums([])
        setSelectedPrice('')
    }

    // Filter products
    let filtered = allProducts.filter(p => {
        const tagMap = parseTags(p.tags)
        const price  = getProductPrice(p)
        if (category !== 'All' && p.productType !== category)                            return false
        if (selectedStyles.length  && !selectedStyles.includes(tagMap.style  || ''))    return false
        if (selectedMediums.length && !selectedMediums.includes(tagMap.medium || p.productType)) return false
        if (selectedPrice) {
            const r = PRICES.find(pr => pr.label === selectedPrice)
            if (r && (price < r.min || price > r.max)) return false
        }
        return true
    })

    // Sort
    if (sortBy === 'Price: Low to High') filtered = [...filtered].sort((a, b) => getProductPrice(a) - getProductPrice(b))
    if (sortBy === 'Price: High to Low') filtered = [...filtered].sort((a, b) => getProductPrice(b) - getProductPrice(a))
    if (sortBy === 'Newest')             filtered = [...filtered].reverse()

    const pageTitle = category === 'All' ? 'All Original Artworks' : `${category} For Sale`

    return (
        <main style={{ background: '#FAF7F2', minHeight: '100vh' }}>
            <style>{`
                @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
                @keyframes sideIn  { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
                .gallery-filter-btn { display: none; }
                @media (max-width: 768px) {
                  .gallery-sidebar { display: none !important; }
                  .gallery-sidebar.open { display: block !important; }
                  .gallery-filter-btn { display: flex !important; }
                  .gallery-layout { flex-direction: column !important; padding: 0 20px 60px !important; }
                  .gallery-masonry { columns: 2 !important; }
                }
                @media (max-width: 480px) {
                  .gallery-masonry { columns: 1 !important; }
                }
                @media (max-width: 768px) {
                  .gallery-card-heart { opacity: 1 !important; }
                }
            `}</style>

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
                </p>
                <h1 style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 10 }}>
                    {pageTitle}
                </h1>
                <p style={{ fontSize: 14, color: '#666', maxWidth: 780, lineHeight: 1.7 }}>
                    Discover original artworks from independent artists worldwide.
                </p>
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
                    <span style={{ fontSize: 12, color: '#999' }}>
                        {loading ? 'Loading...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
                    </span>
                </div>

                {/* SORT PILLS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>Sort by:</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {SORTS.map(s => (
                            <button key={s} onClick={() => setSortBy(s)} style={{
                                padding: '7px 14px', fontSize: 11, letterSpacing: '0.3px',
                                border: `1px solid ${sortBy === s ? '#111' : '#ddd'}`,
                                background: sortBy === s ? '#111' : '#fff',
                                color: sortBy === s ? '#fff' : '#666',
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.25s ease',
                                transform: sortBy === s ? 'translateY(-1px)' : 'translateY(0)',
                                boxShadow: sortBy === s ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                            }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SIDEBAR + GRID */}
            <div className="gallery-layout" style={{ display: 'flex', padding: '0 48px 80px', gap: 40, alignItems: 'flex-start' }}>

                {/* SIDEBAR */}
                <aside
                    className={`gallery-sidebar${mobileSidebarOpen ? ' open' : ''}`}
                    style={{
                        width: 220, minWidth: 220, flexShrink: 0,
                        animation: 'sideIn 0.3s ease',
                        display: sidebarOpen ? undefined : 'none',
                    }}
                >

                    <FilterSection title="Category">
                        {allCategories.map(c => (
                            <CheckRow key={c} label={c} checked={category === c} onChange={() => setCategory(c)} radio />
                        ))}
                    </FilterSection>

                    {allStyles.length > 0 && (
                        <FilterSection title="Style">
                            {allStyles.map(s => (
                                <CheckRow key={s} label={s} checked={selectedStyles.includes(s)} onChange={() => toggleStyle(s)} />
                            ))}
                        </FilterSection>
                    )}

                    {allMediums.length > 0 && (
                        <FilterSection title="Medium" defaultOpen={false}>
                            {allMediums.map(m => (
                                <CheckRow key={m} label={m} checked={selectedMediums.includes(m)} onChange={() => toggleMedium(m)} />
                            ))}
                        </FilterSection>
                    )}

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

                {/* ART GRID — masonry-style using CSS columns so images show at natural size */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Mobile filters toggle button */}
                    <button
                        className="gallery-filter-btn"
                        onClick={() => setMobileSidebarOpen(o => !o)}
                        style={{
                            alignItems: 'center', gap: 8,
                            border: '1px solid #ccc', background: '#fff', padding: '8px 16px',
                            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                            marginBottom: 16, width: '100%', justifyContent: 'center',
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="4" y1="12" x2="14" y2="12"/>
                            <line x1="4" y1="18" x2="17" y2="18"/>
                        </svg>
                        {mobileSidebarOpen ? 'Hide' : 'Show'} Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                    </button>
                    {loading ? (
                        <div className="gallery-masonry" style={{ columns: '3 auto', columnGap: 20 }}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} style={{ breakInside: 'avoid', marginBottom: 20 }}>
                                    <SkeletonCard />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <p style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#888', marginBottom: 16 }}>
                                {allProducts.length === 0
                                    ? 'No artworks found in your Shopify store yet.'
                                    : 'No artworks match your filters'}
                            </p>
                            {activeCount > 0 && (
                                <button onClick={clearAll} style={{
                                    fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                                    border: '1px solid #111', padding: '10px 24px', cursor: 'pointer',
                                    fontFamily: 'inherit', background: 'transparent',
                                }}>
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        // CSS columns (masonry layout) — each image uses its natural aspect ratio
                        <div className="gallery-masonry" style={{ columns: '3 auto', columnGap: 20 }}>
                            {filtered.map((product, i) => (
                                <div key={product.id} style={{ breakInside: 'avoid', marginBottom: 20 }}>
                                    <ArtCard
                                        product={product}
                                        index={i}
                                        wishlistedHandles={wishlistedHandles}
                                        onWishlistToggle={handleWishlistToggle}
                                        showWishlist={!!user}
                                    />
                                </div>
                            ))}
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