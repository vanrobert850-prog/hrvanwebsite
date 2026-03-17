'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '../context/LanguageContext'

const megaMenus = {
    paintings: {
        cols: [
            { titleKey: 'gallery.style',   links: ['Figurative', 'Abstract', 'Contemporary', 'Street Art', 'Pop Art'],              paramKey: 'style'   },
            { titleKey: 'gallery.subject', links: ['People', 'Landscape', 'Still life', 'Nature', 'Architecture'],                  paramKey: 'subject' },
            { titleKey: 'gallery.medium',  links: ['Oil on canvas', 'Acrylic on canvas', 'Mixed media', 'Oil on linen'],            paramKey: 'medium'  },
        ],
        featured: [
            { label: 'Featured Paintings', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&q=80' },
            { label: 'Best of Abstracts',  img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80' },
        ]
    },
    prints: {
        cols: [
            { titleKey: 'gallery.style',   links: ['Contemporary', 'Modernism', 'Pop Art', 'Street Art'],                           paramKey: 'style'   },
            { titleKey: 'gallery.subject', links: ['Landscape', 'Nature', 'Architecture', 'Abstract'],                              paramKey: 'subject' },
            { titleKey: 'gallery.medium',  links: ['Fine art print', 'Etching', 'Lithograph', 'Screen print'],                     paramKey: 'medium'  },
        ],
        featured: [
            { label: 'Featured Prints', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80' },
            { label: 'Photography',     img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80' },
        ]
    }
}

const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
const UserIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const CartIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>

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
            <div className="mega-col" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
            <button className="flag-btn" onClick={() => setOpen(o => !o)} title="Language" aria-label="Select language">
                <img src={flags[lang]} alt={labels[lang]} />
            </button>
            {open && (
                <div className="flag-dropdown" style={{ animation: 'flagDrop 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
                    <style>{`@keyframes flagDrop { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
                    {(['en', 'es'] as const).map(l => (
                        <div
                            key={l}
                            className={`flag-option${lang === l ? ' active' : ''}`}
                            onClick={() => { setLang(l); setOpen(false) }}
                            style={{ transition: 'background 0.2s ease' }}
                        >
                            <img src={flags[l]} alt={labels[l]} />
                            <span>{labels[l]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Navbar() {
    const { t } = useLang()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
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
                    <div className="navbar-search">
                        <SearchIcon />
                        <input placeholder={t('nav.search')} />
                    </div>
                    <button className="navbar-icon-btn" aria-label="Account"><UserIcon /></button>
                    <FlagSwitcher />
                    <Link href="/cart" className="navbar-icon-btn" style={{ position: 'relative' }} aria-label="Cart">
                        <CartIcon /><span className="cart-badge" />
                    </Link>
                </div>

                <button
                    className={`mobile-menu-btn${mobileOpen ? ' open' : ''}`}
                    onClick={() => setMobileOpen(o => !o)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    <span /><span /><span />
                </button>
            </nav>

            <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
                <Link href="/gallery?category=Paintings" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.paintings')}</Link>
                <Link href="/gallery?category=Prints"    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.prints')}</Link>
                <Link href="/artists"                    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.artists')}</Link>
                <Link href="/gallery"                    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav.all')}</Link>
                <div style={{ padding: '24px 0' }}>
                    <FlagSwitcher />
                </div>
            </div>
        </>
    )
}