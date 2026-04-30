'use client'
import { useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FollowButton from '../../components/FollowButton'

const artists = [
    {
        slug: 'maria-ruiz',
        name: 'Maria Ruiz',
        location: 'Barcelona, Spain',
        specialty: 'Oil Paintings',
        joined: '2018',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&q=80',
        studio: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        bioShort: 'Spanish painter exploring the relationship between light, color, and emotion through luminous oil paintings.',
        works: 24,
        about: `Maria's work has been exhibited across Europe and South America. She works primarily in oil on canvas, exploring landscapes and the human form through a warm, earthy palette that has become her trademark.\n\nHer paintings have been described as "meditations on light" — each piece built up through dozens of thin glazes that give the surface a luminous depth impossible to photograph accurately.\n\nMaria works from a large studio overlooking the Mediterranean in Barcelona's Barceloneta neighbourhood, where the quality of coastal light has been the defining influence on her practice.`,
        education: `Escola de la Llotja, Barcelona (2010–2014)\nÉcole des Beaux-Arts, Paris — Exchange Program (2013)\nResidency at Centro de Arte y Naturaleza, Huesca (2015)\nMaster Class with Antonio López García, Madrid (2016)`,
        exhibitions: `2024 — Galería Marlborough, Madrid\n2023 — Art Basel Hong Kong, Booth 3C\n2022 — Sala Parés, Barcelona (Solo)\n2021 — Collective Show, Galerie Templon, Paris\n2020 — Solo Exhibition, Galería Cayón, Madrid`,
        recognition: `Featured in Artsy's Top 50 Emerging Artists 2023\nWinner, Premio de Pintura Cataluña 2022\nArtwork acquired by Fundació Joan Miró collection`,
        artworks: [
            { id: 1,  handle: 'golden-horizon',    title: 'Golden horizon',    price: 1200, medium: 'Oil on canvas', size: '24 × 36 in', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
            { id: 9,  handle: 'amber-fields',      title: 'Amber fields',      price: 950,  medium: 'Oil on canvas', size: '20 × 28 in', img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
            { id: 10, handle: 'warm-light',        title: 'Warm light',        price: 1450, medium: 'Oil on canvas', size: '30 × 40 in', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
            { id: 11, handle: 'dusk-in-catalonia', title: 'Dusk in Catalonia', price: 2200, medium: 'Oil on linen',  size: '36 × 48 in', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
        ],
        similar: ['sofia-martens', 'layla-hassan', 'james-lee'],
    },
    {
        slug: 'james-lee',
        name: 'James Lee',
        location: 'New York, NY, United States',
        specialty: 'Fine Art Prints',
        joined: '2019',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1600&q=80',
        studio: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        bioShort: 'New York printmaker merging traditional etching techniques with digital processes to explore urban solitude.',
        works: 18,
        about: `James Lee is a New York-based printmaker whose work merges traditional etching techniques with digital processes. His prints explore themes of urban solitude and the quiet moments found within bustling city life.\n\nWorking from his studio in Brooklyn, James combines traditional printmaking methods with contemporary digital tools. Each print is hand-finished and comes with a certificate of authenticity.\n\nHis work has been collected across the United States, Europe, and Asia, with several pieces entering museum collections.`,
        education: `MFA Printmaking, Pratt Institute, Brooklyn (2014–2016)\nBFA, School of Visual Arts, New York (2010–2014)\nResidency at the Robert Blackburn Printmaking Workshop (2017)`,
        exhibitions: `2024 — NADA Art Fair, New York\n2023 — Printed Matter Art Book Fair, MoMA PS1\n2022 — Solo Show, Print Center, Philadelphia\n2021 — Group Exhibition, Tamarind Institute, Albuquerque`,
        recognition: `New York Foundation for the Arts Fellowship 2023\nPrint featured in MoMA permanent collection\nNamed one of Artforum's artists to watch 2022`,
        artworks: [
            { id: 2,  handle: 'silent-garden',   title: 'Silent garden',   price: 850,  medium: 'Fine art print', size: '18 × 24 in', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
            { id: 12, handle: 'morning-fog',     title: 'Morning fog',     price: 720,  medium: 'Etching',        size: '16 × 20 in', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
            { id: 13, handle: 'brooklyn-bridge', title: 'Brooklyn bridge', price: 980,  medium: 'Fine art print', size: '20 × 30 in', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
            { id: 14, handle: 'city-at-rest',    title: 'City at rest',    price: 1100, medium: 'Lithograph',     size: '24 × 32 in', img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
        ],
        similar: ['maria-ruiz', 'nina-storm', 'carlos-vega'],
    },
    {
        slug: 'sofia-martens',
        name: 'Sofia Martens',
        location: 'Brussels, Belgium',
        specialty: 'Abstract Paintings',
        joined: '2017',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1600&q=80',
        studio: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        bioShort: 'Brussels-based abstract painter building layers of texture and color that pulsate with energy and movement.',
        works: 31,
        about: `Sofia Martens creates large-scale abstract paintings that pulsate with energy and movement. Working from her studio in Brussels, she uses acrylic and mixed media to build layers of texture and color that seem to breathe.\n\nSofia's paintings have been acquired by private collectors across 18 countries. Her process involves building up dozens of layers over weeks, creating depth and movement that rewards extended viewing.\n\nHer work is characterized by a bold use of color and gestural marks that suggest landscape, emotion, and natural forces.`,
        education: `La Cambre, École Nationale Supérieure des Arts Visuels, Brussels (2009–2013)\nResidency at Cité Internationale des Arts, Paris (2014)\nWorkshop with Gerhard Richter Foundation, Cologne (2016)`,
        exhibitions: `2024 — Art Brussels, Gallery Rodolphe Janssen\n2023 — FIAC Paris · Solo Show, Galerie Nathalie Obadia\n2022 — Frieze London, Booth B12\n2021 — Group Show, SMAK, Ghent`,
        recognition: `Prix de la Jeune Peinture Belge 2022\nFeatured in Wallpaper* Magazine's New Contemporaries\nWork acquired by the Musée d'Art Moderne de Paris`,
        artworks: [
            { id: 3,  handle: 'urban-dusk',     title: 'Urban dusk',     price: 2100, medium: 'Acrylic on canvas', size: '40 × 50 in', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
            { id: 15, handle: 'kinetic-blue',   title: 'Kinetic blue',   price: 1800, medium: 'Acrylic on canvas', size: '36 × 48 in', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
            { id: 16, handle: 'fracture-lines', title: 'Fracture lines', price: 2600, medium: 'Mixed media',       size: '48 × 60 in', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
            { id: 17, handle: 'inner-storm',    title: 'Inner storm',    price: 1950, medium: 'Acrylic on canvas', size: '32 × 40 in', img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
        ],
        similar: ['maria-ruiz', 'layla-hassan', 'james-lee'],
    },
    {
        slug: 'carlos-vega',
        name: 'Carlos Vega',
        location: 'Mexico City, Mexico',
        specialty: 'Prints & Illustration',
        joined: '2020',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1600&q=80',
        studio: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
        bioShort: 'Mexican artist blending pre-Columbian mythology with contemporary street culture in vibrant limited edition prints.',
        works: 15,
        about: `Carlos Vega is a Mexican artist and illustrator whose work draws deeply from pre-Columbian mythology and contemporary street culture. His prints blend ancient symbolism with vibrant color and graphic precision.\n\nCarlos divides his time between Mexico City and Oaxaca, drawing inspiration from both urban energy and ancient indigenous traditions. Each print is hand-pulled in limited editions of 25.\n\nHis work has been featured in publications across Latin America and Europe, and acquired by major cultural institutions in Mexico.`,
        education: `UNAM Escuela Nacional de Artes Plásticas, Mexico City (2012–2016)\nSlade School of Fine Art, London — Exchange (2015)\nMaster Printmaking Workshop, Oaxaca (2017)`,
        exhibitions: `2024 — ZONA MACO, Mexico City\n2023 — Latin American Art Fair, London\n2022 — Solo Show, Instituto de Artes Gráficas, Oaxaca\n2021 — Group Show, Kurimanzutto Gallery, Mexico City`,
        recognition: `Premio Jóvenes Creadores, FONCA 2023\nWork acquired by the Museo de Arte Moderno, Mexico City\nFeatured in Juxtapoz Magazine Issue 228`,
        artworks: [
            { id: 4,  handle: 'morning-bloom', title: 'Morning bloom', price: 650, medium: 'Fine art print',  size: '16 × 20 in', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
            { id: 18, handle: 'serpent-sun',   title: 'Serpent sun',   price: 580, medium: 'Screen print',    size: '14 × 18 in', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
            { id: 19, handle: 'maize-goddess', title: 'Maize goddess', price: 890, medium: 'Fine art print',  size: '20 × 28 in', img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
            { id: 20, handle: 'night-market',  title: 'Night market',  price: 720, medium: 'Risograph print', size: '18 × 24 in', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
        ],
        similar: ['nina-storm', 'james-lee', 'maria-ruiz'],
    },
    {
        slug: 'layla-hassan',
        name: 'Layla Hassan',
        location: 'Cairo, Egypt',
        specialty: 'Oil Paintings',
        joined: '2016',
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1600&q=80',
        studio: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        bioShort: 'Egyptian painter capturing the quiet dignity of everyday life in North Africa through luminous oil paintings.',
        works: 22,
        about: `Layla Hassan paints the quiet dignity of everyday life in North Africa and the Middle East. Her oil paintings capture light falling on ancient walls, the rhythm of desert landscapes, and the complex humanity of her subjects.\n\nLayla studied in Cairo and Florence, and her work is a bridge between two worlds. She uses traditional oil techniques learned in Italy to paint distinctly Egyptian subjects and light.\n\nHer work has been described as timeless — rooted in a specific place and culture, yet speaking to universal human experience.`,
        education: `Faculty of Fine Arts, Cairo University (2008–2012)\nAccademia di Belle Arti, Florence (2012–2014)\nResidency at Townhouse Gallery, Cairo (2015)`,
        exhibitions: `2024 — Cairo Art Fair · Solo Show, Mashrabia Gallery\n2023 — 1-54 African Art Fair, London\n2022 — Group Show, Kalfayan Galleries, Athens\n2021 — Solo Show, Galerie Imane Farès, Paris`,
        recognition: `Cairo Biennial Prize for Painting 2023\nNominated for the Sovereign African Art Prize 2022\nWork in the collection of the Museum of Egyptian Modern Art`,
        artworks: [
            { id: 5,  handle: 'desert-wind',    title: 'Desert wind',    price: 1750, medium: 'Oil on canvas', size: '30 × 40 in', img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80' },
            { id: 21, handle: 'nile-at-dusk',   title: 'Nile at dusk',   price: 1900, medium: 'Oil on canvas', size: '32 × 44 in', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80' },
            { id: 22, handle: 'old-cairo',      title: 'Old Cairo',      price: 2400, medium: 'Oil on linen',  size: '40 × 52 in', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80' },
            { id: 23, handle: 'sahara-morning', title: 'Sahara morning', price: 1600, medium: 'Oil on canvas', size: '28 × 36 in', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80' },
        ],
        similar: ['maria-ruiz', 'sofia-martens', 'nina-storm'],
    },
    {
        slug: 'nina-storm',
        name: 'Nina Storm',
        location: 'Copenhagen, Denmark',
        specialty: 'Fine Art Prints',
        joined: '2019',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&q=80',
        studio: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        bioShort: 'Copenhagen photographer capturing Nordic light in timeless fine art prints — fjords, forests, and coastlines.',
        works: 19,
        about: `Nina Storm creates photographic fine art prints that blur the boundary between documentation and painting. Her lens captures Nordic light in a way that feels ancient and timeless — fjords, forests, and coastlines rendered in silver and blue.\n\nNina prints all her work using archival pigment inks on museum-quality paper, with each print personally signed and numbered. Editions are strictly limited to 10.\n\nShe travels extensively throughout Scandinavia and Iceland to find locations that most people will never see, then renders them with a quiet stillness that invites long, meditative looking.`,
        education: `The Royal Danish Academy of Fine Arts, Copenhagen (2011–2015)\nICP International Center of Photography, New York (2016)\nResidency at Fotografisk Center, Copenhagen (2017)`,
        exhibitions: `2024 — Photokina, Cologne · Solo Show, Galleri Christoffer Egelund\n2023 — Unseen Photo Fair, Amsterdam\n2022 — Paris Photo, Grand Palais\n2021 — Solo Show, V1 Gallery, Copenhagen`,
        recognition: `Danish Arts Foundation Grant 2023\nWork acquired by the National Museum of Photography, Denmark\nFeatured in British Journal of Photography`,
        artworks: [
            { id: 6,  handle: 'ocean-whisper',  title: 'Ocean whisper',   price: 980,  medium: 'Fine art print', size: '20 × 28 in', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
            { id: 24, handle: 'nordic-white',   title: 'Nordic white',    price: 850,  medium: 'Fine art print', size: '16 × 24 in', img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80' },
            { id: 25, handle: 'helsingr-shore', title: 'Helsingør shore', price: 1200, medium: 'C-type print',   size: '24 × 36 in', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80' },
            { id: 26, handle: 'winter-light',   title: 'Winter light',    price: 760,  medium: 'Fine art print', size: '14 × 20 in', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
        ],
        similar: ['james-lee', 'carlos-vega', 'layla-hassan'],
    },
]

const TABS = ['About', 'Education', 'Exhibitions', 'Recognition']

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const artist = artists.find(a => a.slug === slug)
    if (!artist) notFound()

    const [activeTab, setActiveTab] = useState(0)

    const tabContent     = [artist.about, artist.education, artist.exhibitions, artist.recognition]
    const similarArtists = artists.filter(a => artist.similar.includes(a.slug))

    return (
        <>
            <Navbar />
            <main style={{ background: '#FAF7F2', minHeight: '100vh' }}>

                {/* COVER */}
                <div style={{ width: '100%', height: 280, overflow: 'hidden' }}>
                    <img src={artist.cover} alt={artist.name}
                         style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>

                    {/* PROFILE HEADER */}
                    <div style={{
                        background: '#fff', padding: '28px 36px',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                        gap: 24, marginTop: -60, position: 'relative', zIndex: 2,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', flexWrap: 'wrap',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <img src={artist.photo} alt={artist.name}
                                 style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #F0EDE8', flexShrink: 0 }}
                            />
                            <div>
                                <p style={{ fontSize: 24, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{artist.name}</p>
                                <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{artist.location}</p>
                                <p style={{ fontSize: 11, color: '#B85C38', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>{artist.specialty}</p>
                                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Georgia, serif', maxWidth: 480 }}>
                                    {artist.bioShort}
                                </p>
                            </div>
                        </div>

                        {/* ✅ Replaced hardcoded follow button with live FollowButton */}
                        <div style={{ flexShrink: 0, alignSelf: 'center' }}>
                            <FollowButton artistSlug={artist.slug} />
                        </div>
                    </div>

                    {/* TWO COL */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 48, padding: '48px 0 0', alignItems: 'start' }}>

                        {/* LEFT */}
                        <div>
                            <img src={artist.studio} alt={`${artist.name} studio`}
                                 style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                                 loading="lazy"
                            />
                            <div style={{ display: 'flex', borderTop: '1px solid #e8e8e8' }}>
                                {[
                                    { label: 'Works',        value: artist.works    },
                                    { label: 'Member since', value: artist.joined   },
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

                        {/* RIGHT */}
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

                            {/* Tabs */}
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

                            {/* Tab content */}
                            <div key={activeTab} style={{
                                fontSize: 14, color: '#555', lineHeight: 1.9, whiteSpace: 'pre-line',
                                fontFamily: activeTab === 0 ? 'Georgia, serif' : 'inherit',
                                animation: 'tabFade 0.3s ease',
                            }}>
                                {tabContent[activeTab]}
                            </div>
                        </div>
                    </div>

                    {/* ── ARTWORKS ── */}
                    <section style={{ paddingTop: 56, paddingBottom: 48, borderTop: '1px solid #e8e8e8', marginTop: 48 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 400, fontFamily: 'Georgia, serif' }}>
                                All Artworks ({artist.works})
                            </h2>
                            <Link href="/gallery" style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                                View all
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                            {artist.artworks.map(art => (
                                <Link key={art.handle} href={`/artwork/${art.handle}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                    <div
                                        style={{ position: 'relative', overflow: 'hidden', background: '#f0ede8', marginBottom: 10, aspectRatio: '3/4' }}
                                        onMouseEnter={e => {
                                            const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement
                                            if (img) img.style.transform = 'scale(1.05)'
                                        }}
                                        onMouseLeave={e => {
                                            const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement
                                            if (img) img.style.transform = 'scale(1)'
                                        }}
                                    >
                                        <img src={art.img} alt={art.title} loading="lazy"
                                             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>${art.price.toLocaleString()}</p>
                                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{art.title}</p>
                                    <p style={{ fontSize: 12, color: '#888', marginBottom: 1 }}>{artist.name}</p>
                                    <p style={{ fontSize: 11, color: '#bbb' }}>{art.medium} &nbsp;·&nbsp; {art.size}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* COMMISSION */}
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

                    {/* SIMILAR ARTISTS */}
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
                                    <div style={{ position: 'relative', marginBottom: 12, overflow: 'hidden' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                            {sim.artworks.slice(0, 4).map(art => (
                                                <img key={art.handle} src={art.img} alt={art.title} loading="lazy"
                                                     style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                                                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                                />
                                            ))}
                                        </div>
                                        <img src={sim.photo} alt={sim.name} loading="lazy"
                                             style={{ position: 'absolute', bottom: 8, left: 8, width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
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
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1.8fr"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
        </>
    )
}