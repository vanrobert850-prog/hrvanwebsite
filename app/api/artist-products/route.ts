import { NextResponse } from 'next/server'
import { isValidSlug } from '../../lib/validate'

// Map site lang codes → Shopify LanguageCode enum values
const LANG_MAP: Record<string, string> = { en: 'EN', es: 'ES' }

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const artistSlug = searchParams.get('artist_slug')
    const rawLang    = searchParams.get('lang') ?? 'en'
    const language   = LANG_MAP[rawLang] ?? 'EN'

    if (artistSlug !== null && !isValidSlug(artistSlug)) {
        return NextResponse.json({ error: 'Invalid artist_slug' }, { status: 400 })
    }

    // @inContext(language: ...) tells Shopify to return translated title/description
    const productFields = `id title handle description vendor productType tags priceRange { minVariantPrice { amount currencyCode } } images(first: 5) { edges { node { url altText width height } } } variants(first: 5) { edges { node { id title availableForSale price { amount currencyCode } } } }`

    const gqlQuery = artistSlug
        ? { query: `query getProducts($q: String!, $lang: LanguageCode!) @inContext(language: $lang) { products(first: 50, query: $q) { edges { node { ${productFields} } } } }`, variables: { q: `tag:artist:${artistSlug}`, lang: language } }
        : { query: `query getProducts($lang: LanguageCode!) @inContext(language: $lang) { products(first: 50) { edges { node { ${productFields} } } } }`, variables: { lang: language } }

    try {
        const shopifyRes = await fetch(
            `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2026-01/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                },
                body: JSON.stringify(gqlQuery),
                next: { revalidate: 60 },
            }
        )

        if (!shopifyRes.ok) {
            console.error('[artist-products] Shopify error:', shopifyRes.status)
            return NextResponse.json({ products: [] })
        }

        const data = await shopifyRes.json()
        const products = data?.data?.products?.edges?.map((e: any) => e.node) ?? []
        return NextResponse.json({ products })
    } catch {
        console.error('[artist-products] Fetch failed')
        return NextResponse.json({ products: [] })
    }
}
