'use client'
import Link from 'next/link'
import { useLang } from '../context/LanguageContext'

const SendIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>

export default function Footer() {
    const { t } = useLang()

    return (
        <footer className="footer">
            <div className="footer-top-bar">
                <span>{t('footer.cats')}</span>
                <Link href="/gallery?category=Paintings">{t('nav.paintings')}</Link>
                <Link href="/gallery?category=Prints">{t('nav.prints')}</Link>
                <Link href="/artists">{t('nav.artists')}</Link>
                <Link href="/gallery">{t('nav.all')}</Link>
            </div>
            <div className="footer-grid">
                <div>
                    <div className="footer-logo">
                        <div className="footer-logo-ring"><div className="footer-logo-dot" /></div>
                        Van Robert Art Gallery
                    </div>
                    <p className="footer-tagline">{t('footer.tagline')}</p>
                    <div className="footer-email-wrap">
                        <input className="footer-email-input" placeholder={t('footer.email')} type="email" />
                        <button className="footer-email-btn"><SendIcon /></button>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>{t('footer.shop')}</h4>
                    <Link href="/gallery?category=Paintings">{t('nav.paintings')}</Link>
                    <Link href="/gallery?category=Prints">{t('nav.prints')}</Link>
                    <Link href="/gallery">{t('footer.allWorks')}</Link>
                    <Link href="/gallery?price=Under $500">{t('footer.under500')}</Link>
                </div>
                <div className="footer-col">
                    <h4>{t('footer.artists')}</h4>
                    <Link href="/artists">{t('footer.allArtists')}</Link>
                    <Link href="/artists?featured=true">{t('footer.featuredArtists')}</Link>
                </div>
                <div className="footer-col">
                    <h4>{t('footer.info')}</h4>
                    <Link href="/about">{t('footer.about')}</Link>
                    <Link href="/shipping">{t('footer.shipping')}</Link>
                    <Link href="/returns">{t('footer.returns')}</Link>
                    <Link href="/contact">{t('footer.contact')}</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <span>{t('footer.bottom')}</span>
                <span>{t('footer.stripe')}</span>
            </div>
        </footer>
    )
}