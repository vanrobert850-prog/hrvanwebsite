import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Our Curators — Van Robert Art Gallery',
    description: 'Get in touch with our curatorial team to commission an artwork, inquire about pricing, or connect directly with one of our artists.',
    robots: { index: true, follow: false },
}

export default function InquireLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
