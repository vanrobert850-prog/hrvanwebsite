'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
    totalUnitsSold: number
    totalProducts: number
}

interface Product {
    id: string
    title: string
    handle: string
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
    images: { edges: { node: { url: string } }[] }
    totalInventory: number
    salesData: { units: number }
}

interface Sale {
    id: string
    product_title: string
    quantity: number
    created_at: string
}

interface DashboardData {
    profile: { display_name: string }
    stats: Stats
    products: Product[]
    recentSales: Sale[]
}

export default function ArtistDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [slug,    setSlug]    = useState<string | null>(null)
    const [data,    setData]    = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)
    const [tab,     setTab]     = useState<'overview' | 'artworks' | 'sales'>('overview')

    useEffect(() => {
        params.then(p => setSlug(p.slug))
    }, [params])

    useEffect(() => {
        if (!isLoaded || !slug) return
        if (!user) { router.replace('/'); return }

        fetch(`/api/artist-stats?artist_slug=${encodeURIComponent(slug)}`)
            .then(async r => {
                if (r.status === 401 || r.status === 403) { router.replace('/'); return }
                const d = await r.json()
                if (d.error) { setError(d.error); return }
                setData(d)
            })
            .catch(() => setError('Failed to load dashboard'))
            .finally(() => setLoading(false))
    }, [user, isLoaded, slug, router])

    if (!isLoaded || loading) return (
        <div style={{ minHeight: '100vh', background: '#FDFAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 40, height: 40, margin: '0 auto 20px',
                    border: '2px solid #e8ddd0', borderTopColor: '#B85C38',
                    borderRadius: '50%', animation: 'spin 0.9s linear infinite',
                }} />
                <p style={{ fontSize: 13, color: '#aaa', fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '0.5px' }}>
                    Opening your studio…
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    )

    if (error) return (
        <div style={{ minHeight: '100vh', background: '#FDFAF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 15, color: '#888', marginBottom: 16, fontFamily: 'Georgia, serif' }}>Access denied or profile not found.</p>
                <Link href="/" style={{ fontSize: 12, color: '#B85C38', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>← Return home</Link>
            </div>
        </div>
    )

    if (!data) return null

    const { stats, products, recentSales } = data
    const displayName = data.profile.display_name

    // Top selling product
    const topProduct = [...products].sort((a, b) => b.salesData.units - a.salesData.units)[0]

    return (
        <div style={{ minHeight: '100vh', background: '#FDFAF6', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .studio-tab { transition: color 0.2s, border-color 0.2s; }
                .studio-tab:hover { color: #111 !important; }
                .artwork-card { transition: box-shadow 0.25s, transform 0.25s; }
                .artwork-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important; transform: translateY(-2px); }
                .sale-row:hover { background: #fffdf9 !important; }
                @media (max-width: 768px) {
                    .studio-header-inner { padding: 0 20px !important; }
                    .studio-body { padding: 32px 20px !important; }
                    .studio-hero { padding: 40px 20px 32px !important; }
                    .studio-stats { grid-template-columns: 1fr 1fr !important; }
                    .studio-artworks { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 480px) {
                    .studio-artworks { grid-template-columns: 1fr !important; }
                    .studio-stats { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* ── Top bar ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f0ebe3' }}>
                <div className="studio-header-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#B85C38' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#111' }}>Van Robert</span>
                        <span style={{ fontSize: 11, color: '#ccc' }}>/ Studio</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ fontSize: 12, color: '#aaa' }}>{displayName}</span>
                        <Link href={`/artist/${slug}`} style={{
                            fontSize: 10, color: '#B85C38', textDecoration: 'none',
                            border: '1px solid #f0d8cc', padding: '6px 16px',
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            borderRadius: 2, transition: 'background 0.2s',
                        }}>
                            View Profile →
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Hero ── */}
            <div className="studio-hero" style={{
                background: 'linear-gradient(135deg, #111 0%, #1c1410 100%)',
                padding: '52px 40px 44px',
                animation: 'fadeUp 0.5s ease both',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 14 }}>
                        Artist Studio
                    </p>
                    <h1 style={{ fontSize: 36, fontWeight: 300, fontFamily: 'Georgia, serif', color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
                        Welcome back, {displayName}
                    </h1>
                    <p style={{ fontSize: 13, color: '#666', maxWidth: 440 }}>
                        Track your artwork performance and see how many collectors you've reached.
                    </p>
                </div>
            </div>

            {/* ── Stats bar ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f0ebe3' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
                    <div className="studio-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderLeft: '1px solid #f0ebe3' }}>
                        {[
                            { value: stats.totalUnitsSold,  label: 'Units Sold',      sub: 'total across all artworks', accent: '#B85C38' },
                            { value: stats.totalProducts,   label: 'Active Artworks', sub: 'listed on the store',        accent: '#3b82f6' },
                            { value: topProduct ? topProduct.salesData.units : 0, label: 'Best Seller Units', sub: topProduct ? topProduct.title : 'no sales yet', accent: '#22c55e' },
                        ].map(s => (
                            <div key={s.label} style={{ padding: '28px 32px', borderRight: '1px solid #f0ebe3', borderBottom: '1px solid #f0ebe3' }}>
                                <p style={{ fontSize: 36, fontWeight: 700, color: s.accent, marginBottom: 4, letterSpacing: '-1px', lineHeight: 1 }}>
                                    {s.value}
                                </p>
                                <p style={{ fontSize: 11, fontWeight: 600, color: '#111', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                                    {s.label}
                                </p>
                                <p style={{ fontSize: 11, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {s.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="studio-body" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0ebe3', marginBottom: 36, gap: 4 }}>
                    {([
                        { key: 'overview', label: 'Overview' },
                        { key: 'artworks', label: `Artworks (${products.length})` },
                        { key: 'sales',    label: `Sales History (${recentSales.length})` },
                    ] as const).map(t => (
                        <button key={t.key} className="studio-tab" onClick={() => setTab(t.key)} style={{
                            padding: '10px 20px', fontSize: 12, textTransform: 'uppercase',
                            letterSpacing: '1px', background: 'transparent', border: 'none',
                            borderBottom: tab === t.key ? '2px solid #B85C38' : '2px solid transparent',
                            color: tab === t.key ? '#111' : '#bbb',
                            cursor: 'pointer', marginBottom: -1, fontFamily: 'inherit',
                        }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW TAB ── */}
                {tab === 'overview' && (
                    <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                        {recentSales.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #f0ebe3', padding: '72px 40px', textAlign: 'center', borderRadius: 2 }}>
                                {/* Palette icon */}
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8ddd0" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                                    <circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="9" r="1.5" fill="#e8ddd0"/><circle cx="15.5" cy="9" r="1.5" fill="#e8ddd0"/><circle cx="8.5" cy="15" r="1.5" fill="#e8ddd0"/><circle cx="15.5" cy="15" r="1.5" fill="#e8ddd0"/>
                                </svg>
                                <p style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#ccc', marginBottom: 10 }}>
                                    No sales yet
                                </p>
                                <p style={{ fontSize: 13, color: '#bbb', lineHeight: 1.7 }}>
                                    Your sales will appear here as collectors discover your work.<br/>
                                    Make sure your products are tagged <code style={{ background: '#f9f5f0', padding: '2px 8px', fontSize: 11, borderRadius: 2 }}>artist:{slug}</code> in Shopify.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: 10, color: '#bbb', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>
                                    Recent Sales
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {recentSales.slice(0, 6).map(sale => (
                                        <div key={sale.id} className="sale-row" style={{
                                            background: '#fff', border: '1px solid #f0ebe3',
                                            padding: '18px 24px',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            transition: 'background 0.15s',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                                                <div>
                                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 3 }}>
                                                        {sale.product_title}
                                                    </p>
                                                    <p style={{ fontSize: 11, color: '#bbb' }}>
                                                        {new Date(sale.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                background: '#f9f5f0', border: '1px solid #f0ebe3',
                                                padding: '6px 14px', borderRadius: 20,
                                            }}>
                                                <span style={{ fontSize: 15, fontWeight: 700, color: '#B85C38' }}>{sale.quantity}</span>
                                                <span style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    unit{sale.quantity !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── ARTWORKS TAB ── */}
                {tab === 'artworks' && (
                    <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                        {products.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #f0ebe3', padding: '72px 40px', textAlign: 'center', borderRadius: 2 }}>
                                <p style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#ccc', marginBottom: 10 }}>No artworks found</p>
                                <p style={{ fontSize: 13, color: '#bbb' }}>
                                    Tag your Shopify products with <code style={{ background: '#f9f5f0', padding: '2px 8px', fontSize: 11, borderRadius: 2 }}>artist:{slug}</code> to see them here.
                                </p>
                            </div>
                        ) : (
                            <div className="studio-artworks" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                                {products.map(p => {
                                    const img = p.images?.edges?.[0]?.node?.url
                                    const maxUnits = Math.max(...products.map(x => x.salesData.units), 1)
                                    const pct = Math.round((p.salesData.units / maxUnits) * 100)
                                    return (
                                        <div key={p.id} className="artwork-card" style={{
                                            background: '#fff', border: '1px solid #f0ebe3',
                                            overflow: 'hidden', borderRadius: 2,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        }}>
                                            {/* Image */}
                                            <div style={{ height: 200, background: '#f5f0ea', overflow: 'hidden', position: 'relative' }}>
                                                {img
                                                    ? <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                      </div>
                                                }
                                                {/* In stock badge */}
                                                <div style={{
                                                    position: 'absolute', top: 10, right: 10,
                                                    background: (p.totalInventory ?? 0) > 0 ? 'rgba(255,255,255,0.92)' : 'rgba(239,68,68,0.85)',
                                                    color: (p.totalInventory ?? 0) > 0 ? '#22c55e' : '#fff',
                                                    fontSize: 9, padding: '3px 8px',
                                                    letterSpacing: '1px', textTransform: 'uppercase',
                                                    borderRadius: 20, fontWeight: 700,
                                                    border: (p.totalInventory ?? 0) > 0 ? '1px solid #d1fae5' : 'none',
                                                }}>
                                                    {(p.totalInventory ?? 0) > 0 ? `${p.totalInventory} in stock` : 'Out of stock'}
                                                </div>
                                            </div>

                                            <div style={{ padding: '16px 18px 20px' }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {p.title}
                                                </p>

                                                {/* Units sold */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <span style={{ fontSize: 10, color: '#bbb', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Units Sold</span>
                                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#B85C38' }}>{p.salesData.units}</span>
                                                </div>

                                                {/* Progress bar */}
                                                <div style={{ height: 4, background: '#f5f0ea', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%', borderRadius: 4,
                                                        background: 'linear-gradient(90deg, #B85C38, #d4845e)',
                                                        width: `${pct}%`,
                                                        transition: 'width 0.6s ease',
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── SALES HISTORY TAB ── */}
                {tab === 'sales' && (
                    <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                        {recentSales.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #f0ebe3', padding: '72px 40px', textAlign: 'center', borderRadius: 2 }}>
                                <p style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#ccc' }}>No sales yet</p>
                            </div>
                        ) : (
                            <>
                                {/* Summary */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #111 0%, #1c1410 100%)',
                                    padding: '20px 28px', marginBottom: 2, borderRadius: 2,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <span style={{ fontSize: 11, color: '#666', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                        {recentSales.length} transaction{recentSales.length !== 1 ? 's' : ''}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B85C38' }} />
                                        <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>
                                            {stats.totalUnitsSold} total units sold
                                        </span>
                                    </div>
                                </div>

                                {/* Rows */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {recentSales.map((sale, i) => (
                                        <div key={sale.id} className="sale-row" style={{
                                            background: '#fff', border: '1px solid #f0ebe3',
                                            padding: '16px 24px',
                                            display: 'grid', gridTemplateColumns: '1fr auto auto',
                                            alignItems: 'center', gap: 20,
                                            transition: 'background 0.15s',
                                        }}>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 3 }}>{sale.product_title}</p>
                                                <p style={{ fontSize: 11, color: '#bbb' }}>
                                                    {new Date(sale.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 11, color: '#ddd', letterSpacing: '1px', textTransform: 'uppercase' }}>Units</p>
                                            </div>
                                            <div style={{
                                                minWidth: 48, textAlign: 'center',
                                                background: '#fdf5f1', border: '1px solid #f0d8cc',
                                                padding: '8px 14px', borderRadius: 20,
                                            }}>
                                                <p style={{ fontSize: 18, fontWeight: 700, color: '#B85C38', lineHeight: 1 }}>{sale.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
