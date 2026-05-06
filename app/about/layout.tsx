import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Van Robert Art Gallery helps independent artists promote and sell their original paintings, fine art prints, and merchandise to collectors worldwide.',
    openGraph: {
        title: 'About Us — Van Robert Art Gallery',
        description: 'A curated gallery platform helping Caribbean and Latin American artists reach global collectors. Original paintings, fine art prints, and merchandise.',
        url: 'https://hrfineart.com/about',
        images: [{ url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80', width: 1200, height: 630, alt: 'Van Robert Art Gallery — About Us' }],
    },
    alternates: { canonical: 'https://hrfineart.com/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
