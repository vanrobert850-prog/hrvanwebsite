'use client'
import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

const CookieIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/></svg>

export default function CookieBannerWrapper() {
    const { t } = useLang()
    const [visible, setVisible] = useState(false)
    const [animOut, setAnimOut] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('hr_cookie_consent')
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1200)
            return () => clearTimeout(timer)
        }
    }, [])

    const dismiss = (choice: 'accepted' | 'declined') => {
        localStorage.setItem('hr_cookie_consent', choice)
        setAnimOut(true)
        setTimeout(() => setVisible(false), 400)
    }

    if (!visible) return null

    return (
        <div role="dialog" aria-label="Cookie consent" style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
            transform: animOut ? 'translateY(100%)' : 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            animation: !animOut ? 'slideUpCookie 0.5s cubic-bezier(0.4,0,0.2,1) forwards' : undefined,
        }}>
            <style>{`@keyframes slideUpCookie { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
            <div style={{
                background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)',
                padding: '20px 48px', display: 'flex', alignItems: 'center',
                gap: '24px', flexWrap: 'wrap', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
                    <div style={{ color: '#B85C38', flexShrink: 0 }}><CookieIcon /></div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
                        {t('cookie.msg')}{' '}
                        <a href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', fontSize: '12px' }}>
                            {t('cookie.learn')}
                        </a>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <button
                        onClick={() => dismiss('declined')}
                        style={{
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.6)', padding: '9px 20px', fontSize: '12px',
                            letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                            fontFamily: 'inherit', transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget).style.color = 'rgba(255,255,255,0.9)' }}
                        onMouseLeave={e => { (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget).style.color = 'rgba(255,255,255,0.6)' }}
                    >
                        {t('cookie.decline')}
                    </button>
                    <button
                        onClick={() => dismiss('accepted')}
                        style={{
                            background: '#B85C38', border: '1px solid #B85C38', color: 'white',
                            padding: '9px 24px', fontSize: '12px', letterSpacing: '1px',
                            textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget).style.background = '#9A4A2E' }}
                        onMouseLeave={e => { (e.currentTarget).style.background = '#B85C38' }}
                    >
                        {t('cookie.accept')}
                    </button>
                </div>
            </div>
        </div>
    )
}