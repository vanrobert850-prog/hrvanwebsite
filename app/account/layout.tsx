import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Account — Van Robert Art Gallery',
    description: 'View your saved artworks, wishlist, and account settings at Van Robert Art Gallery.',
    robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
