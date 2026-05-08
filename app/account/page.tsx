'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser, SignInButton } from '@clerk/nextjs'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface WishlistItem {
    id: string
    product_handle: string
    product_title: string
    product_image: string | null
    product_price: string | null
    created_at: string
}

export default function AccountPage() {
    const { user, isLoaded } = useUser()
    const [items,   setItems]   = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [removing, setRemoving] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoaded) return
        if (!user) { setLoading(false); return }
        fetch('/api/wishlist')
            .then(r => r.json())
            .then(d => setItems(d.items ?? []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [user, isLoaded])

    const removeItem = async (handle: string) => {
        setRemoving(handle)
        await fetch(`/api/wishlist?handle=${encodeURIComponent(handle)}`, { method: 'DELETE' })
        setItems(prev => prev.filter(i => i.product_handle !== handle))
        setRemoving(null)
    }

    return (
        <>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                @keyframes spin   { to { transform:rotate(360deg); } }
                .wish-card { transition: box-shadow 0.2s, transform 0.2s; }
                .wish-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important; transform: translateY(-2px); }
                .remove-btn { transition: color 0.15s, border-color 0.15s; }
                .remove-btn:hover { color: #ef4444 !important; border-color: #ef4444 !important; }
                @media (max-width: 768px) {
                    .account-layout { padding: 0 20px !important; }
                    .account-hero   { padding: 40px 20px 32px !important; }
                    .wish-grid      { grid-template-columns: repeat(2,1fr) !important; }
                }
                @media (max-width: 480px) {
                    .wish-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            <Navbar />

            {/* Hero */}
            <div className="account-hero" style={{
                background: 'linear-gradient(135deg, #111 0%, #1c1410 100%)',
                padding: '52px 40px 40px',
                animation: 'fadeUp 0.4s ease both',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 14 }}>
                        My Account
                    </p>
                    <h1 style={{ fontSize: 34, fontWeight: 300, fontFamily: 'Georgia, serif', color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
                        {user ? `Welcome, ${user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}` : 'My Account'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#555' }}>
                        Your saved artworks and wishlist.
                    </p>
                </div>
            </div>

            <div className="account-layout" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px 80px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

                {/* Not signed in */}
                {isLoaded && !user && (
                    <div style={{ background: '#fff', border: '1px solid #f0ebe3', padding: '72px 40px', textAlign: 'center', borderRadius: 2 }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e8ddd0" strokeWidth="1" style={{ margin: '0 auto 20px', display: 'block' }}>
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                        </svg>
                        <p style={{ fontSize: 20, fontFamily: 'Georgia, serif', color: '#888', marginBottom: 10 }}>
                            Sign in to view your wishlist
                        </p>
                        <p style={{ fontSize: 13, color: '#bbb', marginBottom: 28, lineHeight: 1.7 }}>
                            Save artworks you love and they'll appear here so you can find them again easily.
                        </p>
                        <SignInButton mode="modal">
                            <button style={{
                                background: '#B85C38', color: '#fff', border: 'none',
                                padding: '13px 32px', fontSize: 11, letterSpacing: '2px',
                                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                                borderRadius: 2,
                            }}>
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                )}

                {/* Loading */}
                {(!isLoaded || (isLoaded && user && loading)) && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{ width: 32, height: 32, border: '2px solid #f0ebe3', borderTopColor: '#B85C38', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    </div>
                )}

                {/* Wishlist */}
                {isLoaded && user && !loading && (
                    <>
                        {/* Section header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #f0ebe3' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#B85C38" stroke="#B85C38" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                                </svg>
                                <h2 style={{ fontSize: 18, fontWeight: 400, color: '#111', fontFamily: 'Georgia, serif' }}>
                                    Saved Artworks
                                </h2>
                                <span style={{
                                    fontSize: 10, color: '#B85C38', background: '#fdf5f1',
                                    border: '1px solid #f0d8cc', padding: '2px 8px', borderRadius: 20,
                                    letterSpacing: '1px',
                                }}>
                                    {items.length}
                                </span>
                            </div>
                            <Link href="/gallery" style={{ fontSize: 11, color: '#aaa', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Browse More →
                            </Link>
                        </div>

                        {items.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #f0ebe3', padding: '72px 40px', textAlign: 'center', borderRadius: 2, animation: 'fadeUp 0.4s ease both' }}>
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#e8ddd0" strokeWidth="1" style={{ margin: '0 auto 18px', display: 'block' }}>
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                                </svg>
                                <p style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#bbb', marginBottom: 10 }}>
                                    Your wishlist is empty
                                </p>
                                <p style={{ fontSize: 13, color: '#ccc', marginBottom: 28, lineHeight: 1.7 }}>
                                    Click the heart ♥ on any artwork to save it here.
                                </p>
                                <Link href="/gallery" style={{
                                    display: 'inline-block', background: '#B85C38', color: '#fff',
                                    padding: '12px 28px', fontSize: 11, letterSpacing: '2px',
                                    textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
                                }}>
                                    Explore Artworks
                                </Link>
                            </div>
                        ) : (
                            <div className="wish-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, animation: 'fadeUp 0.4s ease both' }}>
                                {items.map(item => (
                                    <div key={item.id} className="wish-card" style={{
                                        background: '#fff', border: '1px solid #f0ebe3',
                                        borderRadius: 2, overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    }}>
                                        {/* Image */}
                                        <Link href={`/artwork/${item.product_handle}`} style={{ display: 'block', textDecoration: 'none' }}>
                                            <div style={{ height: 220, background: '#f5f0ea', overflow: 'hidden', position: 'relative' }}>
                                                {item.product_image
                                                    ? <img
                                                        src={item.product_image}
                                                        alt={item.product_title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                                        onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
                                                        onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                                                      />
                                                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                      </div>
                                                }
                                                {/* Heart badge */}
                                                <div style={{
                                                    position: 'absolute', top: 10, right: 10,
                                                    background: 'rgba(255,255,255,0.9)',
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: '1px solid #f0d8cc',
                                                }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#B85C38" stroke="#B85C38" strokeWidth="1.5">
                                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>

                                        <div style={{ padding: '14px 16px 16px' }}>
                                            <Link href={`/artwork/${item.product_handle}`} style={{ textDecoration: 'none' }}>
                                                <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.product_title || 'Untitled'}
                                                </p>
                                            </Link>
                                            {item.product_price && (
                                                <p style={{ fontSize: 13, color: '#B85C38', fontWeight: 600, marginBottom: 12 }}>
                                                    {item.product_price}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Link href={`/artwork/${item.product_handle}`} style={{
                                                    flex: 1, textAlign: 'center', padding: '9px 0',
                                                    background: '#111', color: '#fff',
                                                    fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase',
                                                    textDecoration: 'none', borderRadius: 2,
                                                }}>
                                                    View
                                                </Link>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeItem(item.product_handle)}
                                                    disabled={removing === item.product_handle}
                                                    style={{
                                                        padding: '9px 14px',
                                                        background: 'transparent', border: '1px solid #e8e0d8',
                                                        color: '#aaa', fontSize: 10, letterSpacing: '1px',
                                                        textTransform: 'uppercase', cursor: 'pointer',
                                                        fontFamily: 'inherit', borderRadius: 2,
                                                    }}
                                                    title="Remove from wishlist"
                                                >
                                                    {removing === item.product_handle ? '…' : '♥ Remove'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    )
}
