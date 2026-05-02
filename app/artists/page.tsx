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
        joined: '2026',
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
        joined: '2026',
        photo: '/artists/juan-b-nina/portrait.jpg',
        photoPosition: 'center top',
        cover: '/artists/juan-b-nina/cover.jpg',
        bio: 'Dominican painter, poet, and essayist born in San Cristóbal. Participated in over thirty collective exhibitions and biennials, with solo shows in the Dominican Republic, Cuba, the United States, and Puerto Rico.',
        works: 0,
    },
    {
        slug: 'pablo-palasso',
        name: 'Pablo Palasso',
        location: 'Santo Domingo, Dominican Republic',
        specialty: 'Paintings',
        joined: '2026',
        photo: '/artists/pablo-palasso/portrait.jpg',
        photoPosition: 'center top',
        cover: '/artists/pablo-palasso/cover.jpg',
        bio: 'Renowned Dominican painter born in 1954. Self-taught minimalist with 30+ solo exhibitions and 60+ group shows across multiple continents, UNESCO Gold Medal laureate and Christie\'s auction house featured artist.',
        works: 0,
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
                    <div style={{ background: '#fff' }}>
                        {/* Portrait circle — only this overlaps the cover image */}
                        <div style={{ padding: '0 20px', marginTop: -32 }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
                                border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                background: '#F0EDE8',
                            }}>
                                <img
                                    src={artist.photo}
                                    alt={artist.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: artist.photoPosition ?? 'center top', display: 'block' }}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        {/* Text — fully on white background, never overlapping image */}
                        <div style={{ padding: '10px 20px 24px' }}>
                            <p style={{ fontSize: 11, color: '#B85C38', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 3 }}>
                                {artist.specialty}
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{artist.name}</p>
                            <p style={{ fontSize: 11, color: '#999', marginBottom: 12 }}>{artist.location}</p>
                            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75, marginBottom: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                {artist.bio.slice(0, 130)}...
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0ede8' }}>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 1 }}>{artist.joined}</p>
                                    <p style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Member since</p>
                                </div>
                                <span style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                                    View Profile
                                </span>
                            </div>
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