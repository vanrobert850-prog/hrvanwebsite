import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabase'
import { COMMISSION_RATE } from '../../lib/constants'
import { isValidSlug } from '../../lib/validate'

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const artistSlug = searchParams.get('artist_slug')

    if (!isValidSlug(artistSlug)) {
        return NextResponse.json({ error: 'Invalid artist_slug' }, { status: 400 })
    }

    // Verify this user owns this artist profile
    const { data: profile } = await supabaseAdmin
        .from('artist_profiles')
        .select('clerk_user_id, display_name')
        .eq('artist_slug', artistSlug)
        .eq('clerk_user_id', userId)
        .single()

    if (!profile) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: sales, error: salesError } = await supabaseAdmin
        .from('artist_sales')
        .select('*')
        .eq('artist_slug', artistSlug)
        .order('created_at', { ascending: false })

    if (salesError) {
        console.error('[artist-stats] Sales query error:', salesError)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    try {
        const shopifyRes = await fetch(
            `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2026-01/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                },
                body: JSON.stringify({
                    query: `
                        query getArtistProducts($query: String!) {
                            products(first: 50, query: $query) {
                                edges {
                                    node {
                                        id title handle tags
                                        priceRange { minVariantPrice { amount currencyCode } }
                                        images(first: 1) { edges { node { url } } }
                                        totalInventory
                                        variants(first: 5) {
                                            edges { node { id quantityAvailable price { amount } } }
                                        }
                                    }
                                }
                            }
                        }
                    `,
                    variables: { query: `tag:"artist:${artistSlug}"` },
                }),
                next: { revalidate: 60 },
            }
        )

        const shopifyData = await shopifyRes.json()
        const products = shopifyData?.data?.products?.edges?.map((e: any) => e.node) ?? []

        const totalUnitsSold      = sales?.reduce((sum, s) => sum + s.quantity, 0) ?? 0
        const totalRevenue        = sales?.reduce((sum, s) => sum + Number(s.sale_price), 0) ?? 0
        const totalArtistEarnings = totalRevenue * COMMISSION_RATE

        const salesByProduct: Record<string, { units: number; revenue: number; artistRevenue: number }> = {}
        sales?.forEach(s => {
            if (!salesByProduct[s.product_handle]) {
                salesByProduct[s.product_handle] = { units: 0, revenue: 0, artistRevenue: 0 }
            }
            salesByProduct[s.product_handle].units         += s.quantity
            salesByProduct[s.product_handle].revenue       += Number(s.sale_price)
            salesByProduct[s.product_handle].artistRevenue += Number(s.artist_revenue)
        })

        return NextResponse.json({
            profile,
            stats: {
                totalUnitsSold,
                totalRevenue,
                totalArtistEarnings,
                commissionRate: COMMISSION_RATE,
                totalProducts: products.length,
            },
            products: products.map((p: any) => ({
                ...p,
                salesData: salesByProduct[p.handle] ?? { units: 0, revenue: 0, artistRevenue: 0 },
            })),
            recentSales: sales?.slice(0, 10) ?? [],
        })
    } catch {
        console.error('[artist-stats] Shopify fetch failed')
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
