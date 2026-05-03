import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '../../../lib/supabase'
import { COMMISSION_RATE } from '../../../lib/constants'
import { isValidSlug } from '../../../lib/validate'

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!

function verifyWebhook(body: string, hmacHeader: string): boolean {
    if (!hmacHeader) return false
    const hash = createHmac('sha256', WEBHOOK_SECRET)
        .update(body, 'utf8')
        .digest('base64')
    try {
        return timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader))
    } catch {
        return false
    }
}

export async function POST(req: Request) {
    const rawBody = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''

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
    const inserts: any[] = []

    for (const item of order.line_items ?? []) {
        const tags: string[] = item.properties
            ?.map((p: any) => p.value)
            .filter(Boolean) ?? []

        const vendor = (item.vendor ?? '').toLowerCase().replace(/\s+/g, '-')
        const orderTags: string[] = (order.tags ?? '').split(',').map((t: string) => t.trim())
        const allTags = [...orderTags, ...tags]

        const artistTag = allTags.find((t: string) => t.startsWith('artist:'))
        let artistSlug = artistTag ? artistTag.replace('artist:', '').trim() : null

        if (!artistSlug && vendor) artistSlug = vendor
        if (!isValidSlug(artistSlug)) continue

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
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }

        console.log(`[WEBHOOK] Stored ${inserts.length} sale(s) from order ${orderId}`)
    }

    return NextResponse.json({ ok: true })
}
