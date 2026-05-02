'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FollowButton from '../../components/FollowButton'
import { type ShopifyProduct } from '../../lib/shopify'

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
        studio: '/artists/freddy-javier/studio.jpg',
        bioShort: 'Dominican painter and muralist bridging fine art tradition with Caribbean visual heritage, exhibited across the Americas and Europe since the 1960s.',
        about: `Born September 24, 1946, in the province of Hato Mayor, Dominican Republic.\n\nFreddy Javier studied at the National School of Fine Arts (Escuela Nacional de Bellas Artes), graduating as a Fine Arts professor in 1970.\n\nThe Museum of Graphic Arts of Ciudad Bolívar, Venezuela has acquired one of his paintings, alongside several renowned private collections throughout the Dominican Republic.\n\nHe has also developed as a muralist, creating works including the rooftop workshop-museum of the Palace of Fine Arts in Santo Domingo, as well as murals at Cuba Ocho Art Center in Miami and the Andresearch Center.`,
        education: `National School of Fine Arts, Santo Domingo — Graduated as Fine Arts Professor (1970)`,
        exhibitions: `SOLO EXHIBITIONS\n2012 — Sala de Arte Evolutivo, Contemporary Art\n2012 — Sala de Arte Centro Cultural Ocho, Miami\n2009 — Sala de Arte UNESCO (Two-Artist Show)\n2007 — Sala de Arte Ramón Oviedo\n2006 — Galería de Artes Arawak\n2002 — Isla del Sol, Galería de Bodden, Santo Domingo\n2001 — Museo de las Casas Reales, Casa de Bastidas, Santo Domingo\n1996 — Museum of Modern Art, Santo Domingo\n1992 — Museum of Modern Art, Santo Domingo\n1991 — Dominican College of Visual Artists (CODAP)\n1989 — Museo Voluntario de las Casas Reales\n1988 — Galería Sebelén\n1985 — Sala de Arte Maria-Lejos\n1984 — Galerías Arawak\n1975 — Casa de Teatro\n\nSELECTED GROUP EXHIBITIONS\n2003 — "Dominican Art on the Cigar Route," Miami (benefit for Corazones Unidos Foundation)\n2000 — Joint Exhibition, Japan\n1999 — Joint Exhibition, Caracas, Venezuela\n1998 — Group Exhibition, Florence, Italy\n1997 — Benefit Exhibition for Oncological & Integral Health Foundation, St. Joseph's\n1996 — "Color of Santo Domingo," Galería de Arte Latino\n1994 — 1st Magistral Painting Collective, Hotel Hamaca Beach Resort, Boca Chica\n1994 — "Testimonio, sólo una Época," Casa de Francia / Caribbean Culture, Germany\n1993 — Third Drawing Salon, Arawak — "The Flowers of May," CODAP\n1993 — National Day of Visual Artists, CODAP\n1993 — 16th Anniversary of CODAP\n1991 — First Lithography Collective, Latin American & Caribbean Print Biennial, San Juan, Puerto Rico\n1990 — Banco Metropolitano\n1989 — Banco Miramar, Santiago & San Francisco de Macorís\n1988 — First Dominican Festival of Visual Arts\n1988 — San Juan Biennial of Latin American & Caribbean Print, Puerto Rico\n1987 — Museum of Art & History, San Juan, Puerto Rico\n1987 — "20 Artists," Galería de Arte Sebelén\n1987 — Dominican Contemporary Art (CDAP)\n1987 — Young Dominican Art in New York\n1986 — "Tribute to Liberty," Dominican Painters in New York\n1986 — Pan-American of Dominican Visual Arts\n1985 — III Exhibition, Hotel Sheraton — Galería de Arte Nader\n1984 — Galería de Arte Giotto\n1983 — Galería Pro-Venezuela, Caracas / Galería de Arte Chosseria\n1983 — I.C.D.A. Primavera\n1982 — VI Exhibition of Dominican Painters & Sculptors\n1982 — F.A.O. Visual Arts Competition\n1981 — II Exhibition "Painters of Our Land," Hotel Sheraton\n1980 — I Exhibition "Painters of Our Land," Hotel Sheraton / Galería Logos, Puerto Rico\n1979 — Cultural Center of Curaçao / Altos de Chavón, La Romana\n1978 — Palace of Fine Arts, Dominican College of Visual Artists\n1977 — Group Exhibition, Puerto Rico\n1976 — Group Exhibition, Panama\n1975 — Galería de Arte Giotto\n1974 — Museo del Hombre Dominicano / Galería Casa de Teatro, Santo Domingo\n1972 — First Biennial of the Santo Domingo City Council\n1971 — Reflejo Group at Galería Proyecto\n1970 — Galería de Arte André's, Santo Domingo\n1967 — E. León Jiménez Art Competition, Centro de la Cultura de Santiago`,
        recognition: `AWARDS\n1993 — First Drawing Prize, XIX National Visual Arts Biennial, Museum of Modern Art\n1992 — Honorable Mention, II National Drawing Salon, Arawak Foundation, Museum of Modern Art\n1989 — Third Painting Prize, XVII National Visual Arts Biennial, Museum of Modern Art\n1983 — First Painting Prize, Cocoa Competition, Secretariat of Agriculture, Santo Domingo\n1969 — First Drawing Prize, Student Competition, Friordano Group, Universidad Católica Madre y Maestra, Santiago\n\nPUBLIC & PRIVATE COLLECTIONS\nMuseum of Graphic Arts, Ciudad Bolívar, Venezuela\nUniversidad Católica Madre y Maestra, Santiago, Dominican Republic\nUniversidad Simón Rodríguez, Caracas, Venezuela\nBanco Popular Dominicano\nPrivate collections of Juan José Ceballos, Gregorio Hernández, Doña Chana Vda. Díaz, Doña Miguelina Contrera del Rosario, and Doña Margarita de Lluberes\n\nFEATURED IN PUBLICATIONS\n"Tesoros de Artes del Banco Popular Dominicano"\n"La Pintura en la Sociedad Dominicana" by Danilo De Los Santos\n"Enciclopedia de las Artes Plásticas Dominicanas" by Cándido Gerón\n"Antología de la Pintura Dominicana" by Cándido Gerón\n"Enciclopedia Dominicana"\n"Memoria de un Cortesano" by Joaquín Balaguer\nDominican press supplements: "Qué Pasa" (El Nacional), "La Tarde Alegre" (Ultima Hora), "Isla Abierta" (El Hoy), "Aquí" (La Noticia)`,
        similar: ['juan-b-nina', 'pablo-palasso', 'sofia-martens'],
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
        studio: '/artists/juan-b-nina/studio.jpg',
        bioShort: 'Dominican painter, poet, and essayist born in San Cristóbal — a multidisciplinary artist who fuses Caribbean symbolism with a profound literary voice.',
        about: `Born June 24, 1959, in San Cristóbal, Dominican Republic. Juan B. Nina is a poet, painter, and essayist belonging to the last generation of Dominican artists.\n\nHe has participated in more than thirty collective exhibitions and major fine arts biennials in the Dominican Republic, and has held three individual painting exhibitions — with his most recent in Santiago de Cuba.\n\nHe was invited to exhibit at Bluffton College, United States in 1997 and at the Patterson Museum in New Jersey in 2002. He was honored twice by the Universidad Autónoma de Santo Domingo (UASD) for his artistic contributions in 1994.\n\nNina has traveled to more than ten countries for political, cultural, and research activities. He is a member of the Dominican College of Visual Artists and the Dominican Association of Journalists and Writers, and co-founded the Cultural Group Cacibajagua and Peoti Club at the Casa de Teatro in Santo Domingo in 1992.\n\nHe also shares his artistic career with his profession as a Chef, having worked in restaurants and hotels across the Dominican Republic and taught culinary arts at the School of Hotel Management and Tourism in Santo Domingo (1991).`,
        education: `School of Hotel Management and Tourism, Santo Domingo — Culinary Arts Professor (1991)\nCo-founder, Cultural Group Cacibajagua, Casa de Teatro, Santo Domingo (1992)\nMember, Dominican College of Visual Artists\nMember, Dominican Association of Journalists and Writers`,
        exhibitions: `SOLO EXHIBITIONS\n1992 — "Birds and Symbols," Galería-Café Mundo Europeo, Santo Domingo, Dominican Republic\n1994 — "Metamorphosis of Fire," Hostal Nicolás de Ovando, Santo Domingo, Dominican Republic\n1995 — "Magic of the Circles," Casa del Caribe, Santiago de Cuba\n2003 — "Memory of the Signs," Peterson Museum, New Jersey, United States\n2004 — "Mythology of Dreams," Metarte International Gallery (MIG), Santo Domingo, D.R.\n2005 — "Musical Journey," Kasa Flavia, Dorado, Puerto Rico\n\nSELECTED COLLECTIVE EXHIBITIONS\n1983 — Provincial Government of San Cristóbal\n1987 — APEC University, Santo Domingo, Dominican Republic\n1991 — "From Here, 500 Years," Chambers of Commerce of Santo Domingo\n1991 — Urgent Exhibition for Peace, Nicolás de Ovando Art Center\n1991 — Mural Painting, Plaza Maria de Toledo\n1991 — Light and Color towards the V Centenary, Dominican Republic Library\n1992 — Carnival 92, February 22–23, Plaza Padre Billini\n1992 — First Magistral Biennial, Santo Domingo, D.R.\n1992 — Mural Painting, Restaurant La Atarazana\n1992 — Artists with UASD, Arts Hall, Faculty of Humanities, D.R.\n1993 — Collective, Hotel Playa Dorada, Puerto Plata, D.R.\n1993 — Collective Policromía 93, Casa del Periodista\n1993 — Collective Tribute to the Masters of Dominican Art\n1993 — Academy of Dominican Science\n1993 — Justina Corbacho Gallery, Madrid, Spain\n1993 — Art Santander, Santander, Spain\n1993 — Arfilia Gallery, Madrid, Spain\n1994 — XV Visual Arts Biennial E. León Jiménez, Santiago, Dominican Republic\n1994 — Art +Sur, Granada, Spain\n1994 — Orfilia Spacio Gallery, Madrid, Spain\n1995 — Gallery of Obligatory Art, Bogarra, Spain\n1996 — XVI Visual Arts Biennial E. León Jiménez, Santiago, D.R.\n1996 — Salon de Octubre, Casa de Bastidas, Santo Domingo, D.R.\n1997 — Gallery Durís De Samos, Madrid, Spain\n1999 — UNESCO Salon, Santo Domingo, D.R.\n1999 — UNESCO Salon, Havana, Cuba\n2002 — Art Workshop, Juan B. Nina, Santo Domingo, D.R.\n2002 — Metarte International Gallery, Santo Domingo–New York`,
        recognition: `PUBLISHED WORKS\n"Voices of Time" (1989)\n"Manja... and Other Love Poems" (1990)\n"Evocation of the Times at the End of the Century" (1992)\n"Another Look at the Horizon" (1993)\n"In Praise of Fire" (1994)\n"Andromeda" (1994) — staged at the Teatro de Santiago de Cuba (1995)\n"Biographical Notes from San Cristóbal" (1998)\n"The Origin of Dominican Cuisine" (1999)\n"Notes on the History of Food" (1999)\n"The Kitchen of the Americas" (2000)\n"Anthology of San Cristóbal Writers, 1900–2001" (2001)\n"Secrets of the Mirror" (2002)\n\nFEATURED IN ANTHOLOGIES\n"Poets at the End of the Century in Santo Domingo"\n"Games of Images"\n"The City of Santo Domingo in Literature"\n"At the Edge of Water: 20 Years of Poetry in Santo Domingo"\n"Poets of the Caribbean" (published in Cuba)\n\nINSTITUTIONAL HONORS\nHonored twice by the Universidad Autónoma de Santo Domingo (UASD) for artistic participation (1994)\nInvited to exhibit at Bluffton College, United States (1997)\nInvited to exhibit at Patterson Museum, New Jersey (2002)`,
        similar: ['freddy-javier', 'pablo-palasso', 'sofia-martens'],
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
        studio: '/artists/pablo-palasso/studio.jpg',
        bioShort: 'Renowned Dominican painter and self-taught minimalist — UNESCO Gold Medal laureate, Christie\'s featured artist, and the first Dominican to exhibit at the Villa-Museum Palazzo Pisani in Venice.',
        about: `Born in 1954 in Santo Domingo, Dominican Republic, Pablo Palasso is a renowned Dominican painter with international recognition. A self-taught artist and cultural researcher, his work is characterized by a sophisticated language that invites viewers into an intimate and sometimes cathartic visual monologue.\n\nBetween 1991 and 1992, Palasso traveled through Haiti, Puerto Rico, Jamaica, Guatemala, Honduras, Uruguay, and the United States — experiences that enriched his artistic perspective and contributed to the development of his distinctive minimalist technique.\n\nHe has participated in more than 30 solo exhibitions and over 60 group exhibitions across multiple continents. His work reflects a deep connection to Dominican and Caribbean culture, addressing ancestral myths and legends from a contemporary perspective that highlights the vitality and richness of his cultural heritage.\n\nIn 2015, Palasso became the first Dominican painter to hold a solo exhibition at the Villa-Museum Palazzo Pisani in Venice, Italy, with the show "Caribbean Transparencies/Between Myths and Legends," featuring 15 acrylic paintings on canvas created between 2014 and 2015.`,
        education: `Self-taught artist and cultural researcher\nParticipant, São Paulo Biennial — Brazil (1984)\nExtensive Caribbean and Latin American travels enriching minimalist technique (1991–1992)`,
        exhibitions: `SELECTED SOLO EXHIBITIONS\n2015 — "Caribbean Transparencies/Between Myths and Legends," Villa-Museum Palazzo Pisani, Venice, Italy (first Dominican painter to exhibit there; 15 acrylic paintings on canvas, 2014–2015)\n2009 — Sala de Arte UNESCO, Santo Domingo\n2004 — Works auctioned at Christie's, France\n30+ solo exhibitions across Europe, the Americas, and the Caribbean\n\nSELECTED GROUP EXHIBITIONS\n1984 — São Paulo Biennial, Brazil\n60+ group exhibitions across multiple continents throughout career`,
        recognition: `AWARDS & HONORS\n2013 — Recognition from New York City Hall for dedication to valuing Dominican identity in his paintings\n2006 — UNESCO Gold Medal, recognized as "Excellent Painter of the Dominican Republic"\n1997–2000 — Golden Palette Award, Essex Art Center, Museum of Contemporary Art, Boston (awarded four consecutive times)\n1984 — Participation in the São Paulo Biennial, Brazil\n\nAUCTION HOUSES\nChristie's, France (2004)\n\nNOTABLE ACHIEVEMENTS\nFirst Dominican painter to hold a solo exhibition at the Villa-Museum Palazzo Pisani, Venice, Italy (2015)\nWork represented in private and institutional collections across Europe, the Americas, and the Caribbean`,
        similar: ['freddy-javier', 'juan-b-nina'],
    },
]

const TABS = ['About', 'Education', 'Exhibitions', 'Recognition']

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const artist = artists.find(a => a.slug === slug)
    if (!artist) notFound()

    const [activeTab, setActiveTab] = useState(0)
    const [products, setProducts]   = useState<ShopifyProduct[]>([])
    const [loading,  setLoading]    = useState(true)

    // Fetch this artist's products from Shopify by tag
    useEffect(() => {
        setLoading(true)
        fetch(`/api/artist-products?artist_slug=${slug}`)
            .then(r => r.json())
            .then(data => setProducts(data.products ?? []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [slug])

    const tabContent     = [artist.about, artist.education, artist.exhibitions, artist.recognition]
    const similarArtists = artists.filter(a => artist.similar.includes(a.slug))

    return (
        <>
            <Navbar />
            <main style={{ background: '#FAF7F2', minHeight: '100vh' }}>

                <div style={{ width: '100%', height: 280, overflow: 'hidden' }}>
                    <img src={artist.cover} alt={artist.name}
                         style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>

                    <div style={{
                        background: '#fff', padding: '32px 40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 24, marginTop: -72, position: 'relative', zIndex: 2,
                        boxShadow: '0 4px 32px rgba(0,0,0,0.10)', flexWrap: 'wrap',
                        borderBottom: '3px solid #B85C38',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                            <div style={{
                                width: 96, height: 96, borderRadius: '50%', overflow: 'hidden',
                                border: '4px solid #fff', boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                                flexShrink: 0, background: '#F0EDE8',
                            }}>
                                <img src={artist.photo} alt={artist.name}
                                     style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: artist.photoPosition ?? 'center top', display: 'block' }}
                                />
                            </div>
                            <div>
                                <p style={{ fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 6 }}>{artist.specialty}</p>
                                <p style={{ fontSize: 26, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 4, lineHeight: 1.2 }}>{artist.name}</p>
                                <p style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>{artist.location}</p>
                                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Georgia, serif', maxWidth: 520 }}>
                                    {artist.bioShort}
                                </p>
                            </div>
                        </div>

                        <div style={{ flexShrink: 0, alignSelf: 'center' }}>
                            <FollowButton artistSlug={artist.slug} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 48, padding: '48px 0 0', alignItems: 'start' }}>

                        <div>
                            <img src={artist.studio} alt={`${artist.name} studio`}
                                 style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                                 loading="lazy"
                            />
                            <div style={{ display: 'flex', borderTop: '1px solid #e8e8e8' }}>
                                {[
                                    { label: 'Works',        value: loading ? '—' : products.length },
                                    { label: 'Member since', value: artist.joined },
                                ].map(s => (
                                    <div key={s.label} style={{ flex: 1, padding: '16px 0', textAlign: 'center', borderRight: '1px solid #e8e8e8', background: '#fff' }}>
                                        <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>{s.value}</p>
                                        <p style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.label}</p>
                                    </div>
                                ))}
                                <div style={{ flex: 1, padding: '16px 0', textAlign: 'center', background: '#fff' }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: '#B85C38' }}>{artist.specialty}</p>
                                    <p style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Specialty</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#B85C38', marginBottom: 8 }}>
                                About the artist
                            </p>
                            <h1 style={{ fontSize: 22, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 4 }}>
                                {artist.name}
                            </h1>
                            <p style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: 28 }}>
                                Member since {artist.joined}
                            </p>

                            <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: 28 }}>
                                {TABS.map((tab, i) => (
                                    <button key={tab} onClick={() => setActiveTab(i)} style={{
                                        padding: '10px 20px', fontSize: 12, textTransform: 'uppercase',
                                        letterSpacing: '0.5px', background: 'transparent', border: 'none',
                                        borderBottom: activeTab === i ? '2px solid #111' : '2px solid transparent',
                                        color: activeTab === i ? '#111' : '#aaa',
                                        cursor: 'pointer', marginBottom: -1,
                                        transition: 'color 0.2s, border-color 0.2s', fontFamily: 'inherit',
                                    }}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div key={activeTab} style={{
                                fontSize: 14, color: '#555', lineHeight: 1.9, whiteSpace: 'pre-line',
                                fontFamily: activeTab === 0 ? 'Georgia, serif' : 'inherit',
                                animation: 'tabFade 0.3s ease',
                            }}>
                                {tabContent[activeTab]}
                            </div>
                        </div>
                    </div>

                    {/* ── ARTWORKS FROM SHOPIFY ── */}
                    <section style={{ paddingTop: 56, paddingBottom: 48, borderTop: '1px solid #e8e8e8', marginTop: 48 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 400, fontFamily: 'Georgia, serif' }}>
                                All Artworks{!loading && ` (${products.length})`}
                            </h2>
                            <Link href="/gallery" style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                                View all
                            </Link>
                        </div>

                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                                {[0,1,2,3].map(i => (
                                    <div key={i} style={{
                                        aspectRatio: '3/4',
                                        background: 'linear-gradient(90deg, #f0ede8 25%, #e8e4de 50%, #f0ede8 75%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 1.4s infinite',
                                    }} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid #e8e8e8', padding: '64px 32px', textAlign: 'center' }}>
                                <p style={{ fontSize: 16, fontFamily: 'Georgia, serif', color: '#888', marginBottom: 8 }}>No artworks listed yet</p>
                                <p style={{ fontSize: 13, color: '#bbb' }}>
                                    Tag products with <code style={{ background: '#f5f5f5', padding: '2px 6px', fontSize: 11 }}>artist:{slug}</code> in Shopify to display them here.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                                {products.map(p => {
                                    const img   = p.images?.edges?.[0]?.node?.url ?? ''
                                    const price = parseFloat(p.priceRange.minVariantPrice.amount)
                                    const tagMap: Record<string, string> = {}
                                    p.tags.forEach(t => {
                                        const [k, ...rest] = t.split(':')
                                        if (rest.length) tagMap[k.trim()] = rest.join(':').trim()
                                    })
                                    return (
                                        <Link key={p.handle} href={`/artwork/${p.handle}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                            <div
                                                style={{ position: 'relative', overflow: 'hidden', background: '#f0ede8', marginBottom: 10, aspectRatio: '3/4' }}
                                                onMouseEnter={e => {
                                                    const i = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement
                                                    if (i) i.style.transform = 'scale(1.05)'
                                                }}
                                                onMouseLeave={e => {
                                                    const i = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement
                                                    if (i) i.style.transform = 'scale(1)'
                                                }}
                                            >
                                                {img && <img src={img} alt={p.title} loading="lazy"
                                                             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />}
                                            </div>
                                            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>${price.toLocaleString()}</p>
                                            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{p.title}</p>
                                            <p style={{ fontSize: 12, color: '#888', marginBottom: 1 }}>{artist.name}</p>
                                            <p style={{ fontSize: 11, color: '#bbb' }}>
                                                {tagMap.medium || p.productType}{tagMap.size ? ` · ${tagMap.size}` : ''}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </section>

                    <div style={{ border: '1px solid #e8e8e8', padding: '48px 40px', textAlign: 'center', marginBottom: 64, background: '#fff' }}>
                        <h3 style={{ fontSize: 20, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 12 }}>
                            Commission {artist.name}
                        </h3>
                        <p style={{ fontSize: 14, color: '#888', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7 }}>
                            Interested in a custom artwork by {artist.name.split(' ')[0]}? Inquire here and our curators will connect you directly with the artist.
                        </p>
                        <Link href="/contact" style={{
                            display: 'inline-block', border: '1px solid #111', padding: '12px 32px',
                            fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'inherit',
                            transition: 'all 0.25s ease',
                        }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#111'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#111' }}
                        >
                            Contact our curators
                        </Link>
                    </div>

                    <section style={{ paddingBottom: 80 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 400, fontFamily: 'Georgia, serif' }}>Similar Artists You May Like</h2>
                            <Link href="/artists" style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                                View all artists
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                            {similarArtists.map(sim => (
                                <Link key={sim.slug} href={`/artist/${sim.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ position: 'relative', marginBottom: 12, overflow: 'hidden', height: 180, background: '#f0ede8' }}>
                                        <img src={sim.cover} alt={sim.name} loading="lazy"
                                             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                        <img src={sim.photo} alt={sim.name} loading="lazy"
                                             style={{ position: 'absolute', bottom: 8, left: 8, width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', objectPosition: sim.photoPosition ?? 'center top', border: '2px solid #fff' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{sim.name}</p>
                                    <p style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{sim.specialty}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <Footer />

            <style>{`
        @keyframes tabFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1.8fr"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
        </>
    )
}