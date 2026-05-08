'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useLang } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import { useUser } from '@clerk/nextjs'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
    getProductByHandle,
    getAllProducts,
    getFirstVariantId,
    formatPrice,
    type ShopifyProduct,
} from '../../lib/shopify'

// ── FRAME OPTIONS ─────────────────────────────────────────────────
const frames = [
    { id: 'none',         label: { en: 'No frame',       es: 'Sin marco'          }, price: 0,   style: { padding: 0,  background: 'transparent', boxShadow: 'none' },                                                                                                                                                thumb: { background: '#f0ede8', border: '2px dashed #ccc'       } },
    { id: 'thin-black',   label: { en: 'Thin black',     es: 'Negro fino'         }, price: 80,  style: { padding: 12, background: '#111',         boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },                                                                                                                        thumb: { background: '#111',    border: '2px solid transparent' } },
    { id: 'thin-white',   label: { en: 'Thin white',     es: 'Blanco fino'        }, price: 80,  style: { padding: 12, background: '#f5f5f5',      boxShadow: '0 8px 32px rgba(0,0,0,0.15)', outline: '1px solid #e0e0e0' },                                                                                         thumb: { background: '#f5f5f5', border: '2px solid #ddd'        } },
    { id: 'thick-black',  label: { en: 'Thick black',    es: 'Negro grueso'       }, price: 120, style: { padding: 24, background: '#111',         boxShadow: '0 12px 40px rgba(0,0,0,0.3)' },                                                                                                                       thumb: { background: '#111',    border: '6px solid #111'        } },
    { id: 'thick-white',  label: { en: 'Thick white',    es: 'Blanco grueso'      }, price: 120, style: { padding: 24, background: '#f0f0f0',      boxShadow: '0 12px 40px rgba(0,0,0,0.15)', outline: '1px solid #ddd' },                                                                                            thumb: { background: '#f0f0f0', border: '6px solid #ddd'        } },
    { id: 'gold',         label: { en: 'Gold ornate',    es: 'Dorado ornamental'  }, price: 220, style: { padding: 20, background: 'linear-gradient(135deg,#c9a84c 0%,#f0d060 25%,#b8922a 50%,#e8c040 75%,#c9a84c 100%)', boxShadow: '0 0 0 3px #8B6914,0 0 0 5px #c9a84c,0 12px 40px rgba(0,0,0,0.35)' },         thumb: { background: 'linear-gradient(135deg,#c9a84c,#f0d060,#b8922a)', border: '2px solid #8B6914' } },
    { id: 'silver',       label: { en: 'Silver classic', es: 'Plata clásico'      }, price: 180, style: { padding: 18, background: 'linear-gradient(135deg,#9e9e9e 0%,#e0e0e0 30%,#bdbdbd 60%,#d4d4d4 100%)', boxShadow: '0 0 0 2px #757575,0 10px 36px rgba(0,0,0,0.25)' },                                        thumb: { background: 'linear-gradient(135deg,#9e9e9e,#e0e0e0,#bdbdbd)', border: '2px solid #757575' } },
    { id: 'natural-wood', label: { en: 'Natural wood',   es: 'Madera natural'     }, price: 150, style: { padding: 16, background: 'linear-gradient(135deg,#8B6914 0%,#D4A853 25%,#A0722A 50%,#C4943A 75%,#8B6914 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },                                               thumb: { background: 'linear-gradient(135deg,#8B6914,#D4A853,#A0722A)', border: '2px solid #6B4F10' } },
    { id: 'dark-wood',    label: { en: 'Dark wood',      es: 'Madera oscura'      }, price: 150, style: { padding: 16, background: 'linear-gradient(135deg,#2C1810 0%,#5C3A1E 30%,#3D2410 60%,#4A2E14 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' },                                                            thumb: { background: 'linear-gradient(135deg,#2C1810,#5C3A1E,#3D2410)', border: '2px solid #1A0F08' } },
    { id: 'float-black',  label: { en: 'Float mount',    es: 'Montaje flotante'   }, price: 160, style: { padding: 32, background: '#1a1a1a',       boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05),0 16px 48px rgba(0,0,0,0.4)' },                                                                               thumb: { background: '#1a1a1a', border: '2px solid transparent' } },
]

// ── ICONS ─────────────────────────────────────────────────────────
const CheckIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
const HeartIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
const ShareIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
const ZoomIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
const TruckIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
const ShieldIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const ArrowIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const FrameIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
const SpinnerIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>

// ── HELPER — extract tags into a map ─────────────────────────────
function parseTags(tags: string[]): Record<string, string> {
    const map: Record<string, string> = {}
    tags.forEach(tag => {
        const [key, ...rest] = tag.split(':')
        if (rest.length) map[key.trim()] = rest.join(':').trim()
        else map[tag.trim()] = tag.trim()
    })
    return map
}

// ── SKELETON LOADER ───────────────────────────────────────────────
function Skeleton({ w, h, style }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) {
    return (
        <div style={{
            width: w ?? '100%', height: h ?? 20,
            background: 'linear-gradient(90deg, #f0ede8 25%, #e8e4de 50%, #f0ede8 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
            borderRadius: 2,
            ...style,
        }} />
    )
}

export default function ArtworkPage({ params }: { params: Promise<{ handle: string }> }) {
    const { lang } = useLang()
    const { addItem, loading: cartLoading } = useCart()
    const { user, isLoaded: userLoaded } = useUser()

    // Unwrap params
    const [handle, setHandle] = useState<string | null>(null)
    useEffect(() => {
        params.then(p => setHandle(p.handle))
    }, [params])

    const [product,        setProduct]        = useState<ShopifyProduct | null>(null)
    const [related,        setRelated]        = useState<ShopifyProduct[]>([])
    const [loading,        setLoading]        = useState(true)
    const [notFound404,    setNotFound404]    = useState(false)
    const [mounted,        setMounted]        = useState(false)
    const [wishlisted,     setWishlisted]     = useState(false)
    const [wishlistCount,  setWishlistCount]  = useState(0)
    const [wishlistBusy,   setWishlistBusy]   = useState(false)
    const [addedToCart,  setAddedToCart]  = useState(false)
    const [zoomed,       setZoomed]       = useState(false)
    const [activeImg,    setActiveImg]    = useState(0)
    const [copied,       setCopied]       = useState(false)
    const [activeFrame,  setActiveFrame]  = useState('none')
    const [frameHover,   setFrameHover]   = useState<string | null>(null)

    // Entry animation
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60)
        return () => clearTimeout(t)
    }, [])

    // Fetch product from Shopify using handle
    useEffect(() => {
        if (!handle) return
        setLoading(true)
        getProductByHandle(handle)
            .then(p => {
                if (!p) { setNotFound404(true); return }
                setProduct(p)
                setLoading(false)
                // Fetch related products by same type
                getAllProducts().then(all => {
                    const rel = all
                        .filter(a => a.handle !== handle && a.productType === p.productType)
                        .slice(0, 4)
                    setRelated(rel)
                })
            })
            .catch(() => { setNotFound404(true); setLoading(false) })
        // Fetch public wishlist count
        fetch(`/api/wishlist/count?handle=${encodeURIComponent(handle)}`)
            .then(r => r.json())
            .then(d => setWishlistCount(d.count ?? 0))
            .catch(() => {})
    }, [handle])

    // Check if current user has this in their wishlist
    useEffect(() => {
        if (!handle || !userLoaded || !user) return
        fetch('/api/wishlist')
            .then(r => r.json())
            .then(d => {
                const saved = (d.items ?? []).some((i: { product_handle: string }) => i.product_handle === handle)
                setWishlisted(saved)
            })
            .catch(() => {})
    }, [handle, user, userLoaded])

    if (notFound404) notFound()

    // Derived values from Shopify product
    const variantId   = product ? getFirstVariantId(product) : null
    const images      = product?.images?.edges?.map(e => e.node.url) ?? []
    const price       = product ? parseFloat(product.priceRange.minVariantPrice.amount) : 0
    const currency    = product?.priceRange?.minVariantPrice?.currencyCode ?? 'USD'
    const tagMap      = product ? parseTags(product.tags) : {}
    const framePrice  = frames.find(f => f.id === activeFrame)?.price ?? 0
    const totalPrice  = price + framePrice
    const currentFrame = frames.find(f => f.id === (frameHover || activeFrame)) ?? frames[0]
    const mainImage   = images[activeImg] ?? ''

    const handleAddToCart = async () => {
        if (!variantId) return
        try {
            await addItem(variantId, 1)
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2500)
        } catch {
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2500)
        }
    }

    const handleWishlist = async () => {
        if (!user) {
            // Trigger Clerk sign-in modal programmatically via redirect
            window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`
            return
        }
        if (!handle || !product || wishlistBusy) return
        setWishlistBusy(true)
        if (wishlisted) {
            await fetch(`/api/wishlist?handle=${encodeURIComponent(handle)}`, { method: 'DELETE' })
            setWishlisted(false)
            setWishlistCount(c => Math.max(0, c - 1))
        } else {
            const img = product.images?.edges?.[0]?.node?.url ?? ''
            const priceVal = formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
            await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_handle: handle,
                    product_title: product.title,
                    product_image: img,
                    product_price: priceVal,
                }),
            })
            setWishlisted(true)
            setWishlistCount(c => c + 1)
        }
        setWishlistBusy(false)
    }

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const L = {
        en: {
            allArtworks: 'All Artworks',
            by: 'by',
            viewArtist: 'View artist profile',
            addToCart: cartLoading ? 'Adding...' : addedToCart ? '✓ Added to cart' : 'Add to cart',
            save: wishlisted ? 'Saved' : 'Save',
            share: copied ? 'Copied!' : 'Share',
            details: 'Artwork details',
            medium: 'Medium', size: 'Size', style: 'Style',
            subject: 'Subject', year: 'Year', category: 'Category', artist: 'Artist',
            framing: 'Framing', framingNote: 'Preview how this artwork looks with different frames.',
            shipping: 'Shipping & returns',
            guarantee: 'Buyer guarantee',
            guaranteeText: 'If your artwork arrives damaged or is not as described, we will replace it or issue a full refund.',
            about: 'About the artist',
            related: 'You may also like',
            original: 'Original artwork',
            certificate: 'Certificate of authenticity',
            freeShip: 'Free shipping on orders over $500',
            shippingItems: ['Ships within 5–7 business days', 'Professionally packaged and insured', 'Delivered to 100+ countries', 'Certificate of authenticity included', '14-day return policy'],
            zoom: 'Click to zoom',
            loading: 'Loading artwork...',
        },
        es: {
            allArtworks: 'Todas las obras',
            by: 'por',
            viewArtist: 'Ver perfil del artista',
            addToCart: cartLoading ? 'Añadiendo...' : addedToCart ? '✓ Añadido al carrito' : 'Añadir al carrito',
            save: wishlisted ? 'Guardado' : 'Guardar',
            share: copied ? '¡Copiado!' : 'Compartir',
            details: 'Detalles de la obra',
            medium: 'Técnica', size: 'Tamaño', style: 'Estilo',
            subject: 'Tema', year: 'Año', category: 'Categoría', artist: 'Artista',
            framing: 'Enmarcado', framingNote: 'Previsualiza cómo se ve esta obra con diferentes marcos.',
            shipping: 'Envío y devoluciones',
            guarantee: 'Garantía del comprador',
            guaranteeText: 'Si tu obra llega dañada o no es como se describe, la reemplazamos o emitimos un reembolso completo.',
            about: 'Sobre el artista',
            related: 'También te puede gustar',
            original: 'Obra original',
            certificate: 'Certificado de autenticidad',
            freeShip: 'Envío gratis en pedidos superiores a $500',
            shippingItems: ['Envío en 5–7 días hábiles', 'Empacado profesionalmente y asegurado', 'Entregado a más de 100 países', 'Certificado de autenticidad incluido', 'Política de devolución de 14 días'],
            zoom: 'Clic para ampliar',
            loading: 'Cargando obra...',
        },
    }[lang]

    return (
        <>
            <style>{`
        @keyframes artworkFadeUp  { from { opacity:0; transform:translateY(24px); }  to { opacity:1; transform:translateY(0); } }
        @keyframes artworkFadeIn  { from { opacity:0; }                              to { opacity:1; } }
        @keyframes artworkSlideR  { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes artworkSlideL  { from { opacity:0; transform:translateX(24px); }  to { opacity:1; transform:translateX(0); } }
        @keyframes zoomIn         { from { opacity:0; transform:scale(0.95); }       to { opacity:1; transform:scale(1); } }
        @keyframes spin           { from { transform:rotate(0deg); }                 to { transform:rotate(360deg); } }
        @keyframes shimmer        { from { background-position: 200% 0; }            to { background-position:-200% 0; } }
        .frame-thumb {
          width:52px; height:52px; cursor:pointer; position:relative; flex-shrink:0;
          transition:transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease;
          overflow:hidden;
        }
        .frame-thumb:hover  { transform:scale(1.1); }
        .frame-thumb.active { box-shadow:0 0 0 2.5px #111; }
        @media (max-width:768px) {
          .artwork-layout  { grid-template-columns:1fr !important; gap:32px !important; padding:0 20px 60px !important; }
          .artwork-sticky  { position:static !important; }
          .related-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .artwork-crumb   { padding:14px 20px !important; }
          .artist-strip    { padding:28px 20px !important; }
          .related-section { padding:48px 20px 60px !important; }
        }
      `}</style>

            <Navbar />

            {/* ZOOM OVERLAY */}
            {zoomed && mainImage && (
                <div onClick={() => setZoomed(false)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'zoom-out', animation: 'zoomIn 0.25s ease',
                }}>
                    <div style={{ ...currentFrame.style, animation: 'zoomIn 0.3s ease', maxWidth: '85vw' }}
                         onClick={e => e.stopPropagation()}>
                        <img src={mainImage} alt={product?.title ?? ''}
                             style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} />
                    </div>
                    <button onClick={() => setZoomed(false)} style={{
                        position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.15)',
                        border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%',
                        fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>×</button>
                </div>
            )}

            <main style={{ background: '#FAF7F2', minHeight: '100vh' }}>

                {/* BREADCRUMB */}
                <div className="artwork-crumb" style={{
                    padding: '20px 48px', fontSize: 12, color: '#999',
                    opacity: mounted ? 1 : 0,
                    animation: mounted ? 'artworkFadeIn 0.5s ease forwards' : 'none',
                }}>
                    <Link href="/gallery" style={{ color: '#999', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                        {L.allArtworks}
                    </Link>
                    {' / '}
                    {loading ? (
                        <Skeleton w={120} h={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                    ) : (
                        <>
                            <Link href={`/gallery?category=${product?.productType}`}
                                  style={{ color: '#999', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                {product?.productType}
                            </Link>
                            {' / '}
                            <span style={{ color: '#555' }}>{product?.title}</span>
                        </>
                    )}
                </div>

                {/* MAIN LAYOUT */}
                <div className="artwork-layout" style={{
                    display: 'grid', gridTemplateColumns: '1fr 460px',
                    gap: 56, padding: '0 48px 80px', maxWidth: 1280, margin: '0 auto',
                }}>

                    {/* ── LEFT — IMAGE ── */}
                    <div style={{
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? 'artworkSlideR 0.7s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
                    }}>
                        {loading ? (
                            <>
                                <Skeleton w="100%" h={480} style={{ marginBottom: 16 }} />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[0,1,2].map(i => <Skeleton key={i} w={68} h={68} />)}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Framed preview */}
                                <div onClick={() => setZoomed(true)} style={{
                                    cursor: 'zoom-in', marginBottom: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: '#e8e4de', padding: 32, minHeight: 480, position: 'relative',
                                }}>
                                    <div style={{ ...currentFrame.style, maxWidth: '100%', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                                        <img src={mainImage} alt={product?.title ?? ''} style={{
                                            width: '100%', maxWidth: 480, aspectRatio: '4/3',
                                            objectFit: 'cover', display: 'block',
                                            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                                        }} />
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: 16, right: 16,
                                        background: 'rgba(255,255,255,0.92)', padding: '5px 12px',
                                        fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, color: '#555',
                                    }}>
                                        <ZoomIcon /> {L.zoom}
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                {images.length > 1 && (
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                                        {images.map((img, i) => (
                                            <div key={i} onClick={() => setActiveImg(i)} style={{
                                                width: 68, height: 68, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                                                border: `2px solid ${activeImg === i ? '#111' : 'transparent'}`,
                                                transition: 'border-color 0.2s ease',
                                            }}>
                                                <img src={img} alt={`View ${i + 1}`}
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Trust badges */}
                                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                    {[L.original, L.certificate, L.freeShip].map((b, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                                            <CheckIcon /> {b}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── RIGHT — INFO ── */}
                    <div className="artwork-sticky" style={{
                        position: 'sticky', top: 88, alignSelf: 'start',
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? 'artworkSlideL 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s forwards' : 'none',
                    }}>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Skeleton w={120} h={24} />
                                <Skeleton w="80%" h={36} />
                                <Skeleton w={160} h={18} />
                                <Skeleton w={140} h={40} />
                                <Skeleton w="100%" h={52} />
                                <Skeleton w="100%" h={52} />
                                <Skeleton w="100%" h={160} />
                            </div>
                        ) : product ? (
                            <>
                                {/* Tags */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#B85C38', border: '1px solid #B85C38', padding: '3px 10px' }}>
                    {product.productType}
                  </span>
                                    {tagMap.style && (
                                        <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#888', border: '1px solid #ddd', padding: '3px 10px' }}>
                      {tagMap.style}
                    </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 style={{ fontSize: 28, fontWeight: 300, fontFamily: 'Georgia, serif', marginBottom: 8, lineHeight: 1.3 }}>
                                    {product.title}
                                </h1>
                                <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>
                                    {L.by}{' '}
                                    <Link href={`/artist/${tagMap['artist'] ?? product.vendor.toLowerCase().replace(/ /g, '-')}`}
                                          style={{ color: '#111', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                        {product.vendor}
                                    </Link>
                                    {tagMap.country && `, ${tagMap.country}`}
                                </p>

                                {/* Price */}
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: 30, fontWeight: 600, marginBottom: 4 }}>
                                        {formatPrice(String(totalPrice), currency)}
                                        {framePrice > 0 && (
                                            <span style={{ fontSize: 13, fontWeight: 400, color: '#888', marginLeft: 10 }}>
                        (+${framePrice} {lang === 'en' ? 'framing' : 'enmarcado'})
                      </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: 12, color: '#888' }}>
                                        {lang === 'en' ? 'Free shipping · 14-day returns' : 'Envío gratis · Devoluciones en 14 días'}
                                    </p>
                                </div>

                                {/* FRAMING */}
                                <div style={{ marginBottom: 28, border: '1px solid #e8e8e8', padding: '20px', background: '#fff' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <FrameIcon />
                                        <p style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                                            {L.framing}
                                        </p>
                                        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#B85C38', fontWeight: 500 }}>
                      {(frames.find(f => f.id === activeFrame) ?? frames[0]).label[lang]}
                                            {framePrice > 0 && ` — +$${framePrice}`}
                    </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>{L.framingNote}</p>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {frames.map(frame => (
                                            <div
                                                key={frame.id}
                                                className={`frame-thumb${activeFrame === frame.id ? ' active' : ''}`}
                                                onClick={() => setActiveFrame(frame.id)}
                                                onMouseEnter={() => setFrameHover(frame.id)}
                                                onMouseLeave={() => setFrameHover(null)}
                                                title={`${frame.label[lang]}${frame.price > 0 ? ` (+$${frame.price})` : ''}`}
                                            >
                                                {frame.id === 'none' ? (
                                                    <div style={{
                                                        width: '100%', height: '100%', background: '#f0ede8',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        border: activeFrame === frame.id ? '2px solid #111' : '2px dashed #ccc',
                                                    }}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                                                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                            <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        width: '100%', height: '100%', position: 'relative',
                                                        background: frame.thumb.background,
                                                        border: activeFrame === frame.id ? '2px solid #111' : frame.thumb.border,
                                                        overflow: 'hidden',
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: ['thick-black','thick-white','float-black'].includes(frame.id) ? 10 : 7,
                                                            backgroundImage: mainImage ? `url(${mainImage})` : 'none',
                                                            backgroundSize: 'cover', backgroundPosition: 'center',
                                                            background: mainImage ? undefined : '#8B7355',
                                                        }} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 11, color: '#888', marginTop: 10, textAlign: 'center' }}>
                                        {(frames.find(f => f.id === activeFrame) ?? frames[0]).label[lang]}
                                        {framePrice > 0 ? ` — +$${framePrice}` : ` — ${lang === 'en' ? 'Included' : 'Incluido'}`}
                                    </p>
                                </div>

                                {/* ADD TO CART */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading || !variantId}
                                    style={{
                                        width: '100%', padding: '16px 24px',
                                        background: addedToCart ? '#2a7a2a' : cartLoading ? '#555' : '#111',
                                        color: '#fff', border: 'none',
                                        cursor: cartLoading || !variantId ? 'not-allowed' : 'pointer',
                                        fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase',
                                        fontFamily: 'inherit', marginBottom: 10,
                                        transition: 'background 0.35s cubic-bezier(0.4,0,0.2,1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    }}
                                >
                                    {cartLoading && <SpinnerIcon />}
                                    {L.addToCart}
                                </button>

                                {/* Wishlist count */}
                                {wishlistCount > 0 && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        marginBottom: 10, fontSize: 12, color: '#888',
                                    }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#B85C38" stroke="#B85C38" strokeWidth="1.5">
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                                        </svg>
                                        <span>
                                            <strong style={{ color: '#111' }}>{wishlistCount}</strong>
                                            {' '}{lang === 'en'
                                                ? `collector${wishlistCount !== 1 ? 's have' : ' has'} this on their wishlist`
                                                : `coleccionista${wishlistCount !== 1 ? 's tienen' : ' tiene'} esto en su lista`}
                                        </span>
                                    </div>
                                )}

                                {/* Secondary actions */}
                                <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                                    <button onClick={handleWishlist} disabled={wishlistBusy} style={{
                                        flex: 1, padding: '11px', border: `1px solid ${wishlisted ? '#B85C38' : '#ddd'}`,
                                        background: wishlisted ? '#fdf5f1' : 'transparent',
                                        color: wishlisted ? '#B85C38' : '#555',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                        fontSize: 12, letterSpacing: '1px', cursor: wishlistBusy ? 'wait' : 'pointer',
                                        fontFamily: 'inherit', transition: 'all 0.25s ease',
                                        opacity: wishlistBusy ? 0.7 : 1,
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24"
                                             fill={wishlisted ? '#B85C38' : 'none'}
                                             stroke={wishlisted ? '#B85C38' : 'currentColor'} strokeWidth="1.5">
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                                        </svg>
                                        {L.save}
                                    </button>
                                    <button onClick={handleShare} style={{
                                        flex: 1, padding: '11px', border: '1px solid #ddd',
                                        background: 'transparent', color: copied ? '#2a7a2a' : '#555',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                        fontSize: 12, letterSpacing: '1px', cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'all 0.25s ease',
                                    }}>
                                        <ShareIcon /> {L.share}
                                    </button>
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontSize: 14, color: '#555', lineHeight: 1.85,
                                    fontFamily: 'Georgia, serif', fontStyle: 'italic',
                                    marginBottom: 24, borderLeft: '3px solid #B85C38', paddingLeft: 16,
                                }}>
                                    {product.description}
                                </p>

                                {/* Details table */}
                                <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 20, marginBottom: 20 }}>
                                    <p style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
                                        {L.details}
                                    </p>
                                    {([
                                        [L.artist,   product.vendor],
                                        [L.category, product.productType],
                                        [L.medium,   tagMap.medium   ?? '—'],
                                        [L.size,     tagMap.size     ?? '—'],
                                        [L.style,    tagMap.style    ?? '—'],
                                        [L.subject,  tagMap.subject  ?? '—'],
                                        [L.year,     tagMap.year     ?? '—'],
                                    ] as [string, string][]).map(([key, val]) => (
                                        <div key={key} style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            padding: '7px 0', borderBottom: '1px solid #f4f4f4', fontSize: 13,
                                        }}>
                                            <span style={{ color: '#888' }}>{key}</span>
                                            <span style={{ color: '#111', fontWeight: 500 }}>{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping */}
                                <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 18, marginBottom: 18 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <TruckIcon />
                                        <p style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                                            {L.shipping}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                        {L.shippingItems.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555' }}>
                                                <CheckIcon /> {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Guarantee */}
                                <div style={{ background: '#F7F4F0', padding: '14px 18px', display: 'flex', gap: 12 }}>
                                    <div style={{ flexShrink: 0, marginTop: 1 }}><ShieldIcon /></div>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{L.guarantee}</p>
                                        <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{L.guaranteeText}</p>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* ARTIST STRIP */}
                {!loading && product && (
                    <div className="artist-strip" style={{
                        background: '#fff', borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8',
                        padding: '36px 48px', maxWidth: 1280, margin: '0 auto',
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? 'artworkFadeUp 0.7s ease 0.3s forwards' : 'none',
                    }}>
                        <p style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 18, fontWeight: 600 }}>
                            {L.about}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0ede8', border: '2px solid #F0EDE8', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                </svg>
                            </div>
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <p style={{ fontSize: 18, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 3 }}>{product.vendor}</p>
                                {tagMap.country && <p style={{ fontSize: 13, color: '#888' }}>{tagMap.country}</p>}
                            </div>
                            <Link
                                href={`/artist/${tagMap['artist'] ?? product.vendor.toLowerCase().replace(/ /g, '-')}`}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    border: '1px solid #111', padding: '10px 22px',
                                    fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                                    color: '#111', transition: 'all 0.25s ease', flexShrink: 0,
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#111'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#111' }}
                            >
                                {L.viewArtist} <ArrowIcon />
                            </Link>
                        </div>
                    </div>
                )}

                {/* RELATED */}
                {!loading && related.length > 0 && (
                    <div className="related-section" style={{
                        padding: '60px 48px 80px', maxWidth: 1280, margin: '0 auto',
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? 'artworkFadeUp 0.7s ease 0.4s forwards' : 'none',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 400, fontFamily: 'Georgia, serif' }}>{L.related}</h2>
                            <Link href="/gallery" style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                                {lang === 'en' ? 'View all' : 'Ver todo'}
                            </Link>
                        </div>
                        <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
                            {related.map((a, i) => {
                                const relImg = a.images?.edges?.[0]?.node?.url ?? ''
                                const relPrice = parseFloat(a.priceRange.minVariantPrice.amount)
                                return (
                                    <Link key={a.handle} href={`/artwork/${a.handle}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{
                                            position: 'relative', overflow: 'hidden', background: '#f0ede8',
                                            marginBottom: 10, aspectRatio: '3/4',
                                            opacity: mounted ? 1 : 0,
                                            animation: mounted ? `artworkFadeUp 0.6s ease ${0.45 + i * 0.08}s forwards` : 'none',
                                        }}
                                             onMouseEnter={e => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1.05)' }}
                                             onMouseLeave={e => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1)' }}
                                        >
                                            {relImg && <img src={relImg} alt={a.title} loading="lazy"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />}
                                        </div>
                                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{formatPrice(String(relPrice), a.priceRange.minVariantPrice.currencyCode)}</p>
                                        <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{a.title}</p>
                                        <p style={{ fontSize: 11, color: '#888' }}>{a.vendor}</p>
                                        <p style={{ fontSize: 10, color: '#bbb' }}>{a.productType}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}

            </main>

            <Footer />
        </>
    )
}