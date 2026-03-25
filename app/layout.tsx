import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import CookieBannerWrapper from './components/CookieBannerWrapper'
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        default: 'HR FineArt — Buy Original Art Online | Paintings & Fine Art Prints',
        template: '%s | HR FineArt',
    },
    description: 'Discover and buy original paintings and fine art prints from independent artists worldwide. Unique, one-of-a-kind artworks delivered to your door.',
    keywords: ['original art', 'buy paintings online', 'fine art prints', 'independent artists', 'art marketplace', 'oil paintings', 'contemporary art', 'art collector'],
    authors: [{ name: 'HR FineArt' }],
    creator: 'HR FineArt',
    publisher: 'HR FineArt',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
        type: 'website', locale: 'en_US', alternateLocale: ['es_DO'],
        url: 'https://hrfineart.com', siteName: 'HR FineArt',
        title: 'HR FineArt — Buy Original Art Online',
        description: 'Discover and buy original paintings and fine art prints from independent artists worldwide.',
        images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80', width: 1200, height: 630, alt: 'HR FineArt' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HR FineArt — Buy Original Art Online',
        description: 'Discover and buy original paintings and fine art prints from independent artists worldwide.',
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80'],
    },
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
    alternates: {
        canonical: 'https://hrfineart.com',
        languages: { 'en-US': 'https://hrfineart.com', 'es-DO': 'https://hrfineart.com/es' },
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#B85C38',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
            <head>
                <link rel="preconnect" href="https://images.unsplash.com" />
                <link rel="preconnect" href="https://flagcdn.com" />
                <link rel="dns-prefetch" href="https://images.unsplash.com" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        'name': 'HR FineArt',
                        'url': 'https://hrfineart.com',
                        'description': 'A curated marketplace connecting art collectors with independent artists worldwide.',
                        'sameAs': ['https://instagram.com/hrfineart', 'https://facebook.com/hrfineart'],
                        'contactPoint': { '@type': 'ContactPoint', 'contactType': 'customer service', 'email': 'hello@hrfineart.com', 'availableLanguage': ['English', 'Spanish'] }
                    })}} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        'name': 'HR FineArt',
                        'url': 'https://hrfineart.com',
                        'potentialAction': { '@type': 'SearchAction', 'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://hrfineart.com/gallery?q={search_term_string}' }, 'query-input': 'required name=search_term_string' }
                    })}} />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <LanguageProvider>
                <CartProvider>
                    <CookieBannerWrapper />
                    {children}
                </CartProvider>
            </LanguageProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}