'use client'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect, useRef } from 'react'

const artists = [
    {
        slug: 'freddy-javier',
        name: 'Freddy Javier',
        location: 'Hato Mayor, Dominican Republic',
        specialty: 'Paintings',
        joined: '1970',
        photo: '/artists/freddy-javier/portrait.jpg',
        photoPosition: 'center top',
        cover: '/artists/freddy-javier/cover.jpg',
        bio: 'Dominican painter and muralist born in Hato Mayor in 1946. Graduated from the National School of Fine Arts in Santo Domingo; his work is held in collections across the Americas and Europe.',
        works: 0,
    },
    {
        slug: 'juan-b-nina',
        name: 'Juan B. Nina',
        location: 'San Cristóbal, Dominican Republic',
        specialty: 'Paintings & Poetry',
        joined: '1992',
        photo: '/artists/juan-b-nina/portrait.jpg',
        photoPosition: 'center top',
        cover: '/artists/juan-b-nina/cover.jpg',
        bio: 'Dominican painter, poet, and essayist born in San Cristóbal. Participated in over thirty collective exhibitions and biennials, with solo shows in the Dominican Republic, Cuba, the United States, and Puerto Rico.',
        works: 0,
    },
    {
        slug: 'james-lee',
        name: 'James Lee',
        location: 'New York, NY, United States',
        specialty: 'Fine Art Prints',
        joined: '2019',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        photoPosition: 'center top',
        cover: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
        bio: 'New York-based printmaker whose work merges traditional etching techniques with digital processes. His prints explore themes of urban solitude.',
        works: 18,
    },
    {
        slug: 'sofia-martens',
        name: 'Sofia Martens',
        location: 'Brussels, Belgium',
        specialty: 'Abstract Paintings',
        joined: '2017',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        photoPosition: 'center top',
        cover: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
        bio: 'Creates large-scale abstract paintings that pulsate with energy and movement. Uses acrylic and mixed media to build layers of texture and color.',
        works: 31,
    },
    {
        slug: 'carlos-vega',
        name: 'Carlos Vega',
        location: 'Mexico City, Mexico',
        specialty: 'Prints & Illustration',
        joined: '2020',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        photoPosition: 'center top',
        cover: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
        bio: 'Mexican artist whose work draws deeply from pre-Columbian mythology and contemporary street culture. His prints blend ancient symbolism with vibrant color.',
        works: 15,
    },
    {
        slug: 'layla-hassan',
        name: 'Layla Hassan',
        location: 'Cairo, Egypt',
        specialty: 'Oil Paintings',
        joined: '2016',
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
        photoPosition: 'center top',
        cover: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80',
        bio: 'Paints the quiet dignity of everyday life in North Africa and the Middle East. Her oil paintings capture light falling on ancient walls and desert landscapes.',
        works: 22,
    },
    {
        slug: 'nina-storm',
        name: 'Nina Storm',
        location: 'Copenhagen, Denmark',
        specialty: 'Fine Art Prints',
        joined: '2019',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
        photoPosition: 'center top',
        cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
        bio: 'Creates photographic fine art prints that blur the boundary between documentation and painting. Her lens captures Nordic light in a timeless way.',
        works: 19,
    },
]

function ArtistCard({ artist, index }: { artist: typeof artists[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const timer = setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, index * 120)
        return () => clearTimeout(timer)
    }, [index])

    return (
        <div
            ref={ref}
            style={{
                opacity: 0,
                transform: 'translateY(32px)',
                transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)',
            }}
        >
            <Link href={`/artist/${artist.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div
                    style={{ border: '1px solid #E8E8E8', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    }}
                >
                    <div style={{ height: 180, overflow: 'hidden' }}>
                        <img
                            src={artist.cover}
                            alt={artist.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                            loading="lazy"
                        />
                    </div>
                    <div style={{ padding: '0 20px 24px', background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 14, marginTop: -28 }}>
                            <div style={{
                                width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                                border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                                background: '#F0EDE8',
                            }}>
                                <img
                                    src={artist.photo}
                                    alt={artist.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: artist.photoPosition ?? 'center top', display: 'block' }}
                                    loading="lazy"
                                />
                            </div>
                            <div style={{ paddingBottom: 4 }}>
                                <p style={{ fontSize: 11, color: '#B85C38', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
                                    {artist.specialty}
                                </p>
                                <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 1 }}>{artist.name}</p>
                                <p style={{ fontSize: 11, color: '#999', marginBottom: 0 }}>{artist.location}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                            {artist.bio.slice(0, 130)}...
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0ede8' }}>
                            <div style={{ display: 'flex', gap: 20 }}>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 600 }}>{artist.joined}</p>
                                    <p style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Since</p>
                                </div>
                            </div>
                            <span style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                                View Profile
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default function ArtistsPage() {
    const [heroVisible, setHeroVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setHeroVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <Navbar />
            <main style={{ background: '#fff', minHeight: '100vh' }}>

                <section style={{
                    background: '#F7F4F0',
                    padding: '80px 48px 64px',
                    textAlign: 'center',
                    borderBottom: '1px solid #E8E8E8',
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)',
                }}>
                    <p style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 16, fontFamily: 'Arial' }}>
                        Our Community
                    </p>
                    <h1 style={{ fontSize: 40, fontWeight: 300, fontFamily: 'Georgia, serif', marginBottom: 20, lineHeight: 1.3 }}>
                        Meet the Artists
                    </h1>
                    <p style={{ fontSize: 16, color: '#666', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                        Discover independent artists from around the world. Each artist brings a unique perspective, technique, and story to their work.
                    </p>
                </section>

                <section style={{ padding: '64px 48px', maxWidth: 1400, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                        {artists.map((artist, i) => (
                            <ArtistCard key={artist.slug} artist={artist} index={i} />
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    )
}