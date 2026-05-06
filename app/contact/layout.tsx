import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Apply as an Artist',
    description: 'Apply to join Van Robert Art Gallery. We help independent artists sell their original art, fine art prints, and merchandise to collectors worldwide.',
    openGraph: {
        title: 'Apply as an Artist — Van Robert Art Gallery',
        description: 'Join our gallery. We represent independent artists and give them the tools to reach a global audience.',
        url: 'https://hrfineart.com/contact',
    },
    alternates: { canonical: 'https://hrfineart.com/contact' },
    robots: { index: true, follow: false },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
