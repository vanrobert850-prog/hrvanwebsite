'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
    totalUnitsSold: number
    totalRevenue: number
    totalArtistEarnings: number
    commissionRate: number
    totalProducts: number
}

interface Product {
    id: string
    title: string
    handle: string
    tags: string[]
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
    images: { edges: { node: { url: string } }[] }
    totalInventory: number
    salesData: { units: number; revenue: number; artistRevenue: number }
}

interface Sale {
    id: string
    product_title: string
    quantity: number
    sale_price: number
    artist_revenue: number
    created_at: string
}

interface DashboardData {
    profile: { display_name: string }
    stats: Stats
    products: Product[]
    recentSales: Sale[]
}

function fmt(amount: number, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export default function ArtistDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [slug,    setSlug]    = useState<string | null>(null)
    const [data,    setData]    = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)
    const [tab,     setTab]     = useState<'overview' | 'products' | 'sales'>('overview')

    useEffect(() => {
        params.then(p => setSlug(p.slug))
    }, [params])

    useEffect(() => {
        if (!isLoaded || !user || !slug) return

        fetch(`/api/artist-stats?artist_slug=${slug}`)
            .then(r => r.json())
            .then(d => {
                if (d.error) { setError(d.error); return }
                setData(d)
            })
            .catch(() => setError('Failed to load dashboard'))
            .finally(() => setLoading(false))
    }, [user, isLoaded, slug])

    if (!isLoaded || loading) return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, border: '2px solid #e8e8e8', borderTopColor: '#B85C38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 13, color: '#888', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Loading your studio...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    )

    if (error) return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, color: '#888', marginBottom: 16 }}>Access denied or not found.</p>
                <Link href="/" style={{ fontSize: 12, color: '#B85C38' }}>← Go home</Link>
            </div>
        </div>
    )

    if (!data) return null

    const { stats, products, recentSales } = data
    const displayName = data.profile.display_name

    const statCards = [
        { label: 'Your Earnings (10%)', value: fmt(stats.totalArtistEarnings), color: '#22c55e', sub: `of ${fmt(stats.totalRevenue)} total sales` },
        { label: 'Units Sold',          value: stats.totalUnitsSold,            color: '#B85C38', sub: 'across all artworks' },
        { label: 'Active Artworks',     value: stats.totalProducts,             color: '#3b82f6', sub: 'listed on the store' },
        { label: 'Commission Rate',     value: '10%',                           color: '#8b5cf6', sub: 'of each sale price' },
    ]

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'products', label: `Artworks (${products.length})` },
        { key: 'sales',    label: `Recent Sales (${recentSales.length})` },
    ] as const

    return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

            {/* Header */}
            <div style={{ background: '#111', color: '#fff', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B85C38' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>Van Robert Art Gallery</span>
                        </div>
                    </Link>
                    <span style={{ color: '#333' }}>/</span>
                    <span style={{ fontSize: 12, color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Artist Studio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 13, color: '#666' }}>{displayName}</span>
                    <Link href={`/artist/${slug}`} style={{
                        fontSize: 11, color: '#888', textDecoration: 'none',
                        border: '1px solid #2a2a2a', padding: '6px 14px',
                        letterSpacing: '1px', textTransform: 'uppercase',
                        transition: 'color 0.2s',
                    }}>
                        View Profile →
                    </Link>
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>

                {/* Page title */}
                <div style={{ marginBottom: 40 }}>
                    <p style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 8 }}>
                        Artist Studio
                    </p>
                    <h1 style={{ fontSize: 32, fontWeight: 300, fontFamily: 'Georgia, serif', marginBottom: 4 }}>
                        {displayName}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>
                        Your sales data, earnings, and artwork performance.
                    </p>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 48 }}>
                    {statCards.map(s => (
                        <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '28px 24px' }}>
                            <p style={{ fontSize: 32, fontWeight: 600, color: s.color, marginBottom: 6, letterSpacing: '-0.5px' }}>
                                {s.value}
                            </p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#111', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                                {s.label}
                            </p>
                            <p style={{ fontSize: 11, color: '#aaa' }}>{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: 32 }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            padding: '12px 24px', fontSize: 12, textTransform: 'uppercase',
                            letterSpacing: '1px', background: 'transparent', border: 'none',
                            borderBottom: tab === t.key ? '2px solid #B85C38' : '2px solid transparent',
                            color: tab === t.key ? '#111' : '#aaa',
                            cursor: 'pointer', marginBottom: -1, fontFamily: 'inherit',
                            transition: 'color 0.2s',
                        }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* OVERVIEW TAB */}
                {tab === 'overview' && (
                    <div>
                        {recentSales.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px', textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontFamily: 'Georgia, serif', color: '#888', marginBottom: 8 }}>No sales yet</p>
                                <p style={{ fontSize: 13, color: '#bbb' }}>
                                    Your sales will appear here once customers purchase your artwork.<br/>
                                    Make sure your products are tagged with <code style={{ background: '#f5f5f5', padding: '2px 6px', fontSize: 11 }}>artist:{slug}</code> in Shopify.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: 11, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
                                    Recent Activity
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {recentSales.slice(0, 5).map(sale => (
                                        <div key={sale.id} style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{sale.product_title}</p>
                                                <p style={{ fontSize: 11, color: '#aaa' }}>
                                                    {sale.quantity} unit{sale.quantity !== 1 ? 's' : ''} · {new Date(sale.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 16, fontWeight: 600, color: '#22c55e', marginBottom: 2 }}>
                                                    {fmt(sale.artist_revenue)}
                                                </p>
                                                <p style={{ fontSize: 11, color: '#aaa' }}>your 10%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {tab === 'products' && (
                    <div>
                        {products.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px', textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontFamily: 'Georgia, serif', color: '#888', marginBottom: 8 }}>No artworks found</p>
                                <p style={{ fontSize: 13, color: '#bbb' }}>
                                    Tag your Shopify products with <code style={{ background: '#f5f5f5', padding: '2px 6px', fontSize: 11 }}>artist:{slug}</code> to see them here.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                                {products.map(p => {
                                    const img = p.images?.edges?.[0]?.node?.url
                                    const price = parseFloat(p.priceRange.minVariantPrice.amount)
                                    const inStock = p.totalInventory ?? 0
                                    return (
                                        <div key={p.id} style={{ background: '#fff', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                                            {/* Product image */}
                                            <div style={{ height: 200, background: '#f0ede8', overflow: 'hidden', position: 'relative' }}>
                                                {img && <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                {/* Stock badge */}
                                                <div style={{
                                                    position: 'absolute', top: 10, right: 10,
                                                    background: inStock > 0 ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)',
                                                    color: '#fff', fontSize: 10, padding: '3px 8px',
                                                    letterSpacing: '1px', textTransform: 'uppercase',
                                                }}>
                                                    {inStock > 0 ? `${inStock} in stock` : 'Out of stock'}
                                                </div>
                                            </div>

                                            <div style={{ padding: '16px 18px' }}>
                                                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{p.title}</p>
                                                <p style={{ fontSize: 13, color: '#B85C38', fontWeight: 600, marginBottom: 12 }}>
                                                    {fmt(price)}
                                                </p>

                                                {/* Sales stats for this product */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 12, borderTop: '1px solid #f4f4f4' }}>
                                                    <div style={{ textAlign: 'center', background: '#faf7f2', padding: '10px 8px' }}>
                                                        <p style={{ fontSize: 18, fontWeight: 600, color: '#111', marginBottom: 2 }}>
                                                            {p.salesData.units}
                                                        </p>
                                                        <p style={{ fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Sold</p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', background: '#f0fdf4', padding: '10px 8px' }}>
                                                        <p style={{ fontSize: 18, fontWeight: 600, color: '#22c55e', marginBottom: 2 }}>
                                                            {fmt(p.salesData.artistRevenue)}
                                                        </p>
                                                        <p style={{ fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Earned</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* SALES TAB */}
                {tab === 'sales' && (
                    <div>
                        {recentSales.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px', textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontFamily: 'Georgia, serif', color: '#888' }}>No sales yet</p>
                            </div>
                        ) : (
                            <>
                                {/* Summary row */}
                                <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '16px 20px', marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                        {recentSales.length} transaction{recentSales.length !== 1 ? 's' : ''}
                                    </span>
                                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
                                        Total earned: {fmt(stats.totalArtistEarnings)}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {recentSales.map(sale => (
                                        <div key={sale.id} style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{sale.product_title}</p>
                                                <p style={{ fontSize: 11, color: '#aaa' }}>
                                                    {sale.quantity} unit{sale.quantity !== 1 ? 's' : ''} ·{' '}
                                                    {new Date(sale.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 16, fontWeight: 600, color: '#22c55e', marginBottom: 2 }}>
                                                    {fmt(sale.artist_revenue)}
                                                </p>
                                                <p style={{ fontSize: 11, color: '#ddd' }}>
                                                    Sale: {fmt(sale.sale_price)}
                                                </p>
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