import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { supabaseAdmin } from '../../../lib/supabase'

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!
const COMMISSION_RATE = 0.10

// Verify the request is genuinely from Shopify
function verifyWebhook(body: string, hmacHeader: string): boolean {
    const hash = createHmac('sha256', WEBHOOK_SECRET)
        .update(body, 'utf8')
        .digest('base64')
    return hash === hmacHeader
}

export async function POST(req: Request) {
    const rawBody = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''

    // Security: reject anything not from Shopify
    if (!verifyWebhook(rawBody, hmacHeader)) {
        console.warn('[WEBHOOK] Invalid HMAC — rejected')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let order: any
    try {
        order = JSON.parse(rawBody)
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const orderId = String(order.id)

    // Process each line item in the order
    const inserts: any[] = []

    for (const item of order.line_items ?? []) {
        const tags: string[] = item.properties
            ?.map((p: any) => p.value)
            .filter(Boolean) ?? []

        // Also check product tags via vendor field or tags array
        // We look for artist slug in vendor or tags
        const vendor = (item.vendor ?? '').toLowerCase().replace(/\s+/g, '-')

        // Try to find artist tag like "artist:maria-ruiz" in the order tags
        const orderTags: string[] = (order.tags ?? '').split(',').map((t: string) => t.trim())
        const allTags = [...orderTags, ...tags]

        const artistTag = allTags.find((t: string) => t.startsWith('artist:'))
        let artistSlug = artistTag ? artistTag.replace('artist:', '').trim() : null

        // Fallback: use vendor as slug if no explicit tag
        if (!artistSlug && vendor) {
            artistSlug = vendor
        }

        if (!artistSlug) continue

        const salePrice = parseFloat(item.price) * item.quantity
        const artistRevenue = salePrice * COMMISSION_RATE

        inserts.push({
            artist_slug:      artistSlug,
            shopify_order_id: orderId,
            product_title:    item.title,
            product_handle:   item.handle ?? item.title.toLowerCase().replace(/\s+/g, '-'),
            quantity:         item.quantity,
            sale_price:       salePrice,
            artist_revenue:   artistRevenue,
        })
    }

    if (inserts.length > 0) {
        const { error } = await supabaseAdmin
            .from('artist_sales')
            .upsert(inserts, { onConflict: 'shopify_order_id,product_handle' })

        if (error) {
            console.error('[WEBHOOK] Supabase insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`[WEBHOOK] Stored ${inserts.length} sale(s) from order ${orderId}`)
    }

    return NextResponse.json({ ok: true })
}