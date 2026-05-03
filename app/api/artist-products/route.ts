import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const artistSlug = searchParams.get('artist_slug')

    const gqlQuery = artistSlug
        ? { query: `query getProducts($q: String!) { products(first: 50, query: $q) { edges { node { id title handle description vendor productType tags priceRange { minVariantPrice { amount currencyCode } } images(first: 5) { edges { node { url altText width height } } } variants(first: 5) { edges { node { id title availableForSale price { amount currencyCode } } } } } } } }`, variables: { q: `tag:artist:${artistSlug}` } }
        : { query: `{ products(first: 50) { edges { node { id title handle description vendor productType tags priceRange { minVariantPrice { amount currencyCode } } images(first: 5) { edges { node { url altText width height } } } variants(first: 5) { edges { node { id title availableForSale price { amount currencyCode } } } } } } } }` }

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

    const data = await shopifyRes.json()
    const products = data?.data?.products?.edges?.map((e: any) => e.node) ?? []

    return NextResponse.json({ products })
}