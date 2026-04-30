'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLang } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { SignInButton, UserButton, Show, useUser } from '@clerk/nextjs'

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID

const searchData = {
    artists: [
        { slug: 'maria-ruiz',    name: 'Maria Ruiz',    specialty: 'Oil Paintings',         location: 'Barcelona, Spain',        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
        { slug: 'james-lee',     name: 'James Lee',     specialty: 'Fine Art Prints',       location: 'New York, United States', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
        { slug: 'sofia-martens', name: 'Sofia Martens', specialty: 'Abstract Paintings',    location: 'Brussels, Belgium',       photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
        { slug: 'carlos-vega',   name: 'Carlos Vega',   specialty: 'Prints & Illustration', location: 'Mexico City, Mexico',     photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
        { slug: 'layla-hassan',  name: 'Layla Hassan',  specialty: 'Oil Paintings',         location: 'Cairo, Egypt',            photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
        { slug: 'nina-storm',    name: 'Nina Storm',    specialty: 'Fine Art Prints',       location: 'Copenhagen, Denmark',     photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80' },
    ],
    artworks: [
        { id: 1,  title: 'Golden horizon',      artist: 'Maria Ruiz',    price: 1200, category: 'Paintings', style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200&q=80' },
        { id: 2,  title: 'Silent garden',       artist: 'James Lee',     price: 850,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=200&q=80' },
        { id: 3,  title: 'Urban dusk',          artist: 'Sofia Martens', price: 2100, category: 'Paintings', style: 'Abstract',               img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=80' },
        { id: 4,  title: 'Morning bloom',       artist: 'Carlos Vega',   price: 650,  category: 'Prints',    style: 'Pop Art',                img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&q=80' },
        { id: 5,  title: 'Desert wind',         artist: 'Layla Hassan',  price: 1750, category: 'Paintings', style: 'Figurative',             img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&q=80' },
        { id: 6,  title: 'Ocean whisper',       artist: 'Nina Storm',    price: 980,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=80' },
        { id: 7,  title: 'Crimson fields',      artist: 'Andres Mora',   price: 3200, category: 'Paintings', style: 'Abstract Expressionism', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=200&q=80' },
        { id: 8,  title: 'Quiet forest',        artist: 'Yuki Tanaka',   price: 720,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=200&q=80' },
        { id: 9,  title: 'Amber fields',        artist: 'Maria Ruiz',    price: 950,  category: 'Paintings', style: 'Figurative',             img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&q=80' },
        { id: 10, title: 'Warm light',          artist: 'Maria Ruiz',    price: 1450, category: 'Paintings', style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=200&q=80' },
        { id: 11, title: 'Dusk in Catalonia',   artist: 'Maria Ruiz',    price: 2200, category: 'Paintings', style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=80' },
        { id: 12, title: 'Morning fog',         artist: 'James Lee',     price: 720,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&q=80' },
        { id: 13, title: 'Brooklyn bridge',     artist: 'James Lee',     price: 980,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=80' },
        { id: 14, title: 'City at rest',        artist: 'James Lee',     price: 1100, category: 'Prints',    style: 'Modernism',              img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=200&q=80' },
        { id: 15, title: 'Kinetic blue',        artist: 'Sofia Martens', price: 1800, category: 'Paintings', style: 'Abstract',               img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=200&q=80' },
        { id: 16, title: 'Fracture lines',      artist: 'Sofia Martens', price: 2600, category: 'Paintings', style: 'Abstract Expressionism', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200&q=80' },
        { id: 17, title: 'Inner storm',         artist: 'Sofia Martens', price: 1950, category: 'Paintings', style: 'Abstract',               img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&q=80' },
        { id: 18, title: 'Serpent sun',         artist: 'Carlos Vega',   price: 580,  category: 'Prints',    style: 'Pop Art',                img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=80' },
        { id: 19, title: 'Maize goddess',       artist: 'Carlos Vega',   price: 890,  category: 'Prints',    style: 'Pop Art',                img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=200&q=80' },
        { id: 20, title: 'Night market',        artist: 'Carlos Vega',   price: 720,  category: 'Prints',    style: 'Street Art',             img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=200&q=80' },
        { id: 21, title: 'Nile at dusk',        artist: 'Layla Hassan',  price: 1900, category: 'Paintings', style: 'Figurative',             img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=200&q=80' },
        { id: 22, title: 'Old Cairo',           artist: 'Layla Hassan',  price: 2400, category: 'Paintings', style: 'Figurative',             img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200&q=80' },
        { id: 23, title: 'Sahara morning',      artist: 'Layla Hassan',  price: 1600, category: 'Paintings', style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=80' },
        { id: 24, title: 'Nordic white',        artist: 'Nina Storm',    price: 850,  category: 'Prints',    style: 'Modernism',              img: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=200&q=80' },
        { id: 25, title: 'Helsingør shore',     artist: 'Nina Storm',    price: 1200, category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=200&q=80' },
        { id: 26, title: 'Winter light',        artist: 'Nina Storm',    price: 760,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&q=80' },
        { id: 27, title: 'The blue hour',       artist: 'Andres Mora',   price: 2800, category: 'Paintings', style: 'Abstract Expressionism', img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&q=80' },
        { id: 28, title: 'Street echo',         artist: 'Andres Mora',   price: 1400, category: 'Paintings', style: 'Street Art',             img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=200&q=80' },
        { id: 29, title: 'Mountain stillness',  artist: 'Yuki Tanaka',   price: 680,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200&q=80' },
        { id: 30, title: 'Cherry blossom rain', artist: 'Yuki Tanaka',   price: 890,  category: 'Prints',    style: 'Contemporary',           img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=80' },
    ],
    categories: [
        { label: 'Paintings',       href: '/gallery?category=Paintings'   },
        { label: 'Fine Art Prints', href: '/gallery?category=Prints'      },
        { label: 'Abstract',        href: '/gallery?style=Abstract'       },
        { label: 'Figurative',      href: '/gallery?style=Figurative'     },
        { label: 'Contemporary',    href: '/gallery?style=Contemporary'   },
        { label: 'Landscape',       href: '/gallery?subject=Landscape'    },
        { label: 'Street Art',      href: '/gallery?style=Street+Art'     },
        { label: 'Pop Art',         href: '/gallery?style=Pop+Art'        },
        { label: 'Oil paintings',   href: '/gallery?medium=Oil+on+canvas' },
        { label: 'Modernism',       href: '/gallery?style=Modernism'      },
    ],
}

type ArtistResult   = typeof searchData.artists[0]
type ArtworkResult  = typeof searchData.artworks[0]
type CategoryResult = typeof searchData.categories[0]
type SearchResult   =
    | { type: 'artist';   data: ArtistResult   }
    | { type: 'artwork';  data: ArtworkResult  }
    | { type: 'category'; data: CategoryResult }

function getResults(query: string): SearchResult[] {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const results: SearchResult[] = []
    searchData.artists.forEach(a => {
        if (a.name.toLowerCase().includes(q) || a.specialty.toLowerCase().includes(q) || a.location.toLowerCase().includes(q))
            results.push({ type: 'artist', data: a })
    })
    searchData.artworks.forEach(a => {
        if (a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q) || a.style.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
            results.push({ type: 'artwork', data: a })
    })
    searchData.categories.forEach(c => {
        if (c.label.toLowerCase().includes(q))
            results.push({ type: 'category', data: c })
    })
    return results.slice(0, 14)
}

const megaMenus = {
    paintings: {
        cols: [
            { titleKey: 'gallery.style',   links: ['Figurative', 'Abstract', 'Contemporary', 'Street Art', 'Pop Art'],   paramKey: 'style'   },
            { titleKey: 'gallery.subject', links: ['People', 'Landscape', 'Still life', 'Nature', 'Architecture'],       paramKey: 'subject' },
            { titleKey: 'gallery.medium',  links: ['Oil on canvas', 'Acrylic on canvas', 'Mixed media', 'Oil on linen'], paramKey: 'medium'  },
        ],
        featured: [
            { label: 'Featured Paintings', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&q=80' },
            { label: 'Best of Abstracts',  img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80' },
        ]
    },
    prints: {
        cols: [
            { titleKey: 'gallery.style',   links: ['Contemporary', 'Modernism', 'Pop Art', 'Street Art'],       paramKey: 'style'   },
            { titleKey: 'gallery.subject', links: ['Landscape', 'Nature', 'Architecture', 'Abstract'],          paramKey: 'subject' },
            { titleKey: 'gallery.medium',  links: ['Fine art print', 'Etching', 'Lithograph', 'Screen print'], paramKey: 'medium'  },
        ],
        featured: [
            { label: 'Featured Prints', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80' },
            { label: 'Photography',     img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80' },
        ]
    }
}

// ── ICONS ─────────────────────────────────────────────────────────
const UserIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const CartIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const AdminIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const ArtIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>

// ── ROLE BADGE — shown in navbar when signed in ───────────────────
function RoleBadge() {
    const { user, isLoaded } = useUser()
    const [artistSlug, setArtistSlug] = useState<string | null>(null)
    const [checking,   setChecking]   = useState(true)

    const isAdmin = isLoaded && user?.id === ADMIN_USER_ID

    useEffect(() => {
        if (!isLoaded || !user || isAdmin) { setChecking(false); return }

        // Check if this user is a linked artist
        fetch('/api/admin/artists')
            .then(r => r.json())
            .then(data => {
                const profile = data.profiles?.find(
                    (p: { clerk_user_id: string; artist_slug: string }) => p.clerk_user_id === user.id
                )
                setArtistSlug(profile?.artist_slug ?? null)
            })
            .catch(() => {})
            .finally(() => setChecking(false))
    }, [user, isLoaded, isAdmin])

    if (!isLoaded || checking || !user) return null

    if (isAdmin) {
        return (
            <Link href="/admin" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#111', color: '#fff',
                padding: '6px 12px', fontSize: 10,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                textDecoration: 'none', border: '1px solid #333',
                transition: 'background 0.2s',
            }}>
                <AdminIcon />
                Admin
            </Link>
        )
    }

    if (artistSlug) {
        return (
            <Link href={`/artist-dashboard/${artistSlug}`} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#B85C38', color: '#fff',
                padding: '6px 12px', fontSize: 10,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s',
            }}>
                <ArtIcon />
                My Studio
            </Link>
        )
    }

    return null
}

// ── MEGA MENU ─────────────────────────────────────────────────────
function MegaMenu({ type }: { type: 'paintings' | 'prints' }) {
    const { t } = useLang()
    const menu = megaMenus[type]
    return (
        <div className="mega-menu">
            {menu.cols.map((col, i) => (
                <div key={i} className="mega-col">
                    <p className="mega-col-title">{t(col.titleKey)}</p>
                    {col.links.map((link, j) => (
                        <Link key={j} href={`/gallery?${col.paramKey}=${encodeURIComponent(link)}`} className="mega-link">
                            {link}
                        </Link>
                    ))}
                </div>
            ))}
            <div className="mega-col" style={{ display: 'flex', flexDirection: 'column' }}>
                {menu.featured.map((feat, i) => (
                    <Link key={i} href="/gallery" style={{ flex: 1, display: 'block' }}>
                        <div className="mega-feat-img"><img src={feat.img} alt={feat.label} loading="lazy" /></div>
                        <p className="mega-feat-label">{feat.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// ── FLAG SWITCHER ─────────────────────────────────────────────────
function FlagSwitcher() {
    const { lang, setLang } = useLang()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const flags  = { en: 'https://flagcdn.com/w40/us.png', es: 'https://flagcdn.com/w40/do.png' }
    const labels = { en: 'English', es: 'Español' }

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button className="flag-btn" onClick={() => setOpen(o => !o)} aria-label="Select language">
                <img src={flags[lang]} alt={labels[lang]} />
            </button>
            {open && (
                <div className="flag-dropdown">
                    {(['en', 'es'] as const).map(l => (
                        <div key={l} className={`flag-option${lang === l ? ' active' : ''}`}
                             onClick={() => { setLang(l); setOpen(false) }}>
                            <img src={flags[l]} alt={labels[l]} /><span>{labels[l]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── SEARCH BAR ────────────────────────────────────────────────────
function SearchBar() {
    const { t } = useLang()
    const router = useRouter()
    const [query,     setQuery]     = useState('')
    const [results,   setResults]   = useState<SearchResult[]>([])
    const [open,      setOpen]      = useState(false)
    const [focused,   setFocused]   = useState(false)
    const [activeIdx, setActiveIdx] = useState(-1)
    const wrapRef  = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpen(false); setFocused(false)
            }
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val); setActiveIdx(-1)
        if (val.trim().length >= 1) { setResults(getResults(val)); setOpen(true) }
        else { setResults([]); setOpen(false) }
    }

    const navigateTo = useCallback((r: SearchResult) => {
        setOpen(false); setQuery(''); setFocused(false)
        if (r.type === 'artist')   router.push(`/artist/${(r.data as ArtistResult).slug}`)
        if (r.type === 'artwork')  router.push(`/artwork/${(r.data as ArtworkResult).id}`)
        if (r.type === 'category') router.push((r.data as CategoryResult).href)
    }, [router])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
        if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
        if (e.key === 'Escape')    { setOpen(false); setQuery(''); inputRef.current?.blur() }
        if (e.key === 'Enter') {
            if (activeIdx >= 0 && results[activeIdx]) navigateTo(results[activeIdx])
            else { router.push(`/gallery?q=${encodeURIComponent(query)}`); setOpen(false) }
        }
    }

    const artistResults   = results.filter(r => r.type === 'artist')
    const artworkResults  = results.filter(r => r.type === 'artwork').slice(0, 5)
    const categoryResults = results.filter(r => r.type === 'category')
    const flatResults     = [...artistResults, ...artworkResults, ...categoryResults]

    return (
        <>
            <style>{`
        .hr-search-wrap { position: relative; z-index: 600; }
        .hr-search-input-row {
          display: flex; align-items: center; gap: 8px;
          background: #fff; padding: 8px 12px;
          border: 1px solid #ddd; width: 220px;
          transition: border-color 0.3s ease, width 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .hr-search-input-row.focused { border-color: #111; width: 300px; }
        .hr-search-input-row input {
          border: none; outline: none; font-size: 13px;
          font-family: inherit; color: #111; background: transparent; width: 100%;
        }
        .hr-search-input-row input::placeholder { color: #bbb; }
        .hr-search-clear {
          background: none; border: none; cursor: pointer; padding: 0;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          opacity: 0.5; transition: opacity 0.2s;
        }
        .hr-search-clear:hover { opacity: 1; }
        .hr-search-dropdown {
          position: fixed; background: #fff;
          border: 1px solid #e8e8e8;
          box-shadow: 0 20px 60px rgba(0,0,0,0.16);
          width: 420px; max-height: 540px; overflow-y: auto;
          z-index: 9999; border-radius: 2px;
          animation: hrSearchIn 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes hrSearchIn {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hr-search-label {
          font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
          color: #B85C38; padding: 14px 16px 8px; font-weight: 600;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          display: block;
        }
        .hr-search-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; cursor: pointer;
          transition: background 0.15s ease;
          border: none; background: #fff; width: 100%; text-align: left;
        }
        .hr-search-row:hover, .hr-search-row.active { background: #FAF7F2; }
        .hr-search-divider { border: none; border-top: 1px solid #f4f4f4; margin: 0; }
        .hr-search-all {
          padding: 13px 16px; border-top: 1px solid #efefef;
          font-size: 12px; color: #B85C38; cursor: pointer; text-align: center;
          letter-spacing: 0.5px; font-weight: 500; transition: background 0.15s ease;
          display: block; width: 100%; background: none;
          border-left: none; border-right: none; border-bottom: none;
          font-family: inherit;
        }
        .hr-search-all:hover { background: #FAF7F2; }
        .hr-search-empty { padding: 36px 24px; text-align: center; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

            <div ref={wrapRef} className="hr-search-wrap">
                <div className={`hr-search-input-row${focused ? ' focused' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { setFocused(true); if (query.trim().length >= 1) setOpen(true) }}
                        placeholder={t('nav.search')}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {query && (
                        <button className="hr-search-clear"
                                onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </div>

                {open && query.trim().length >= 1 && (() => {
                    const rect  = wrapRef.current?.getBoundingClientRect()
                    const top   = rect ? rect.bottom + 8 : 80
                    const right = rect ? window.innerWidth - rect.right : 48

                    return (
                        <div className="hr-search-dropdown" style={{ top, right }}>
                            {results.length === 0 ? (
                                <div className="hr-search-empty">
                                    <p style={{ fontSize: 15, fontFamily: 'Georgia, serif', color: '#888', fontStyle: 'italic', marginBottom: 6 }}>
                                        No results for "{query}"
                                    </p>
                                    <p style={{ fontSize: 12, color: '#bbb' }}>Try searching for an artist, artwork, or style</p>
                                </div>
                            ) : (
                                <>
                                    {artistResults.length > 0 && (
                                        <>
                                            <span className="hr-search-label">Artists</span>
                                            {artistResults.map(r => {
                                                const a   = r.data as ArtistResult
                                                const idx = flatResults.indexOf(r)
                                                return (
                                                    <button key={a.slug}
                                                            className={`hr-search-row${activeIdx === idx ? ' active' : ''}`}
                                                            onClick={() => navigateTo(r)}
                                                            onMouseEnter={() => setActiveIdx(idx)}
                                                    >
                                                        <img src={a.photo} alt={a.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e8e8e8', flexShrink: 0 }} />
                                                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                                            <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 2 }}>{a.name}</p>
                                                            <p style={{ fontSize: 11, color: '#888' }}>{a.specialty} · {a.location}</p>
                                                        </div>
                                                        <span style={{ fontSize: 9, color: '#B85C38', letterSpacing: '1.5px', textTransform: 'uppercase', border: '1px solid #B85C38', padding: '2px 6px', flexShrink: 0 }}>Artist</span>
                                                    </button>
                                                )
                                            })}
                                        </>
                                    )}
                                    {artworkResults.length > 0 && (
                                        <>
                                            {artistResults.length > 0 && <hr className="hr-search-divider" />}
                                            <span className="hr-search-label">Artworks</span>
                                            {artworkResults.map(r => {
                                                const a   = r.data as ArtworkResult
                                                const idx = flatResults.indexOf(r)
                                                return (
                                                    <button key={a.id}
                                                            className={`hr-search-row${activeIdx === idx ? ' active' : ''}`}
                                                            onClick={() => navigateTo(r)}
                                                            onMouseEnter={() => setActiveIdx(idx)}
                                                    >
                                                        <img src={a.img} alt={a.title} style={{ width: 44, height: 44, objectFit: 'cover', border: '1px solid #e8e8e8', flexShrink: 0 }} />
                                                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                                            <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                                                            <p style={{ fontSize: 11, color: '#888' }}>{a.artist} · <span style={{ color: '#111', fontWeight: 500 }}>${a.price.toLocaleString()}</span></p>
                                                        </div>
                                                        <span style={{ fontSize: 9, color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', border: '1px solid #ddd', padding: '2px 6px', flexShrink: 0 }}>{a.category}</span>
                                                    </button>
                                                )
                                            })}
                                        </>
                                    )}
                                    {categoryResults.length > 0 && (
                                        <>
                                            {(artistResults.length > 0 || artworkResults.length > 0) && <hr className="hr-search-divider" />}
                                            <span className="hr-search-label">Browse</span>
                                            {categoryResults.map(r => {
                                                const c   = r.data as CategoryResult
                                                const idx = flatResults.indexOf(r)
                                                return (
                                                    <button key={c.href}
                                                            className={`hr-search-row${activeIdx === idx ? ' active' : ''}`}
                                                            onClick={() => navigateTo(r)}
                                                            onMouseEnter={() => setActiveIdx(idx)}
                                                    >
                                                        <div style={{ width: 44, height: 44, background: '#F7F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e8e8e8' }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5">
                                                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                                                                <circle cx="7" cy="7" r="1" fill="#B85C38"/>
                                                            </svg>
                                                        </div>
                                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                                            <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 2 }}>{c.label}</p>
                                                            <p style={{ fontSize: 11, color: '#888' }}>Browse all {c.label.toLowerCase()}</p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </>
                                    )}
                                    <button className="hr-search-all" onClick={() => { router.push(`/gallery?q=${encodeURIComponent(query)}`); setOpen(false) }}>
                                        View all results for "<strong>{query}</strong>" →
                                    </button>
                                </>
                            )}
                        </div>
                    )
                })()}
            </div>
        </>
    )
}

// ── CART DRAWER ───────────────────────────────────────────────────
function CartDrawer() {
    const { cart, cartOpen, setCartOpen, removeItem, updateItem, checkout, loading } = useCart()
    const { lang } = useLang()

    const lines    = cart?.lines?.edges ?? []
    const total    = cart?.cost?.totalAmount?.amount ?? '0'
    const currency = cart?.cost?.totalAmount?.currencyCode ?? 'USD'

    const L = {
        en: { title: 'Your Cart', empty: 'Your cart is empty', browse: 'Browse artworks', checkout: 'Proceed to checkout', total: 'Total', remove: 'Remove', secure: 'Secure checkout powered by Shopify' },
        es: { title: 'Tu Carrito', empty: 'Tu carrito está vacío', browse: 'Explorar obras', checkout: 'Proceder al pago', total: 'Total', remove: 'Eliminar', secure: 'Pago seguro impulsado por Shopify' },
    }[lang]

    return (
        <>
            {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998, animation: 'fadeIn 0.25s ease' }} />}
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: '#fff', zIndex: 999, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', transform: cartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 20px', borderBottom: '1px solid #e8e8e8' }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>{L.title}</h2>
                    <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 22, padding: 4 }}>×</button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                    {lines.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 0' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" style={{ margin: '0 auto 16px' }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                            <p style={{ fontSize: 15, fontFamily: 'Georgia, serif', color: '#888', fontStyle: 'italic', marginBottom: 24 }}>{L.empty}</p>
                            <Link href="/gallery" onClick={() => setCartOpen(false)} style={{ display: 'inline-block', border: '1px solid #111', padding: '10px 24px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#111' }}>{L.browse}</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {lines.map(({ node }) => (
                                <div key={node.id} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid #f4f4f4' }}>
                                    <img src={node.merchandise.image?.url} alt={node.merchandise.product.title} style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #e8e8e8', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.merchandise.product.title}</p>
                                        <p style={{ fontSize: 13, color: '#B85C38', fontWeight: 600, marginBottom: 10 }}>${parseFloat(node.merchandise.price.amount).toLocaleString()} {node.merchandise.price.currencyCode}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8' }}>
                                                <button onClick={() => updateItem(node.id, Math.max(0, node.quantity - 1))} style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                                <span style={{ width: 28, textAlign: 'center', fontSize: 13, userSelect: 'none' }}>{node.quantity}</span>
                                                <button onClick={() => updateItem(node.id, node.quantity + 1)} style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                            </div>
                                            <button onClick={() => removeItem(node.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#B85C38', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>{L.remove}</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {lines.length > 0 && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid #e8e8e8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ fontSize: 13, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{L.total}</span>
                            <span style={{ fontSize: 20, fontWeight: 600 }}>${parseFloat(total).toLocaleString()} {currency}</span>
                        </div>
                        <button onClick={checkout} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#555' : '#111', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: 'inherit' }}>
                            {loading ? '...' : L.checkout}
                        </button>
                        <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 10 }}>{L.secure}</p>
                    </div>
                )}
            </div>
        </>
    )
}

// ── MAIN NAVBAR ───────────────────────────────────────────────────
export default function Navbar() {
    const { t, lang } = useLang()
    const { cartCount, setCartOpen } = useCart()
    const [mobileOpen,  setMobileOpen]  = useState(false)
    const [mobileQuery, setMobileQuery] = useState('')
    const router = useRouter()

    return (
        <>
            <CartDrawer />

            <div className="top-banner">
                {t('banner.text')}
                <Link href="/gallery">{t('banner.link')}</Link>
            </div>

            <nav className="navbar">
                <Link href="/" className="navbar-logo">
                    <div className="logo-ring"><div className="logo-dot" /></div>
                    HR FineArt
                </Link>

                <div className="navbar-links">
                    <div className="navbar-item">
                        <Link href="/gallery?category=Paintings">{t('nav.paintings')}</Link>
                        <MegaMenu type="paintings" />
                    </div>
                    <div className="navbar-item">
                        <Link href="/gallery?category=Prints">{t('nav.prints')}</Link>
                        <MegaMenu type="prints" />
                    </div>
                    <div className="navbar-item">
                        <Link href="/artists">{t('nav.artists')}</Link>
                    </div>
                    <div className="navbar-item">
                        <Link href="/gallery">{t('nav.all')}</Link>
                    </div>
                </div>

                <div className="navbar-right">
                    <SearchBar />

                    {/* ── ROLE BADGE — Admin panel or Artist studio ── */}
                    <Show when="signed-in">
                        <RoleBadge />
                    </Show>

                    {/* ── AUTH ── */}
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className="navbar-icon-btn" aria-label="Sign in">
                                <UserIcon />
                            </button>
                        </SignInButton>
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                    </Show>

                    <FlagSwitcher />

                    {/* CART */}
                    <button onClick={() => setCartOpen(true)} className="navbar-icon-btn" style={{ position: 'relative' }} aria-label="Cart">
                        <CartIcon />
                        {cartCount > 0 && (
                            <span style={{ position: 'absolute', top: 5, right: 5, width: 17, height: 17, borderRadius: '50%', background: '#B85C38', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff', animation: 'fadeIn 0.2s ease' }}>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </button>
                </div>

                <button className={`mobile-menu-btn${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(o => !o)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
                    <span /><span /><span />
                </button>
            </nav>

            {/* MOBILE NAV */}
            <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e8e8e8', padding: '10px 14px', marginBottom: 8, background: '#fff' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    <input type="text" value={mobileQuery} placeholder={t('nav.search')} onChange={e => setMobileQuery(e.target.value)}
                           onKeyDown={e => { if (e.key === 'Enter' && mobileQuery.trim()) { router.push(`/gallery?q=${encodeURIComponent(mobileQuery)}`); setMobileOpen(false); setMobileQuery('') } }}
                           style={{ border: 'none', outline: 'none', fontSize: 15, fontFamily: 'inherit', width: '100%', background: 'transparent' }}
                    />
                </div>

                <Link href="/gallery?category=Paintings" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.paintings')}</Link>
                <Link href="/gallery?category=Prints"    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.prints')}</Link>
                <Link href="/artists"                    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.artists')}</Link>
                <Link href="/gallery"                    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.all')}</Link>

                {/* Mobile role links */}
                <Show when="signed-in">
                    <div style={{ padding: '16px 0', borderBottom: '1px solid #e8e8e8' }}>
                        <RoleBadge />
                    </div>
                </Show>

                <div style={{ padding: '24px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <FlagSwitcher />
                    <button onClick={() => { setCartOpen(true); setMobileOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', padding: '8px 16px', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: '#555' }}>
                        <CartIcon />
                        {cartCount > 0 && <span style={{ background: '#B85C38', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>}
                        {lang === 'en' ? 'Cart' : 'Carrito'}
                    </button>
                </div>
            </div>
        </>
    )
}