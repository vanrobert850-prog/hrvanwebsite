import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabase'
import { isValidSlug } from '../../lib/validate'

function sanitize(val: unknown, max: number): string {
    if (typeof val !== 'string') return ''
    return val.trim().slice(0, max)
}

// GET — return the signed-in user's wishlist
export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabaseAdmin
        .from('wishlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[wishlist] GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ items: data ?? [] })
}

// POST — add a product to the signed-in user's wishlist
export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 4000) {
        return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    let body: unknown
    try { body = await req.json() } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const b = body as Record<string, unknown>

    const product_handle = sanitize(b.product_handle, 200)
    const product_title  = sanitize(b.product_title,  200)
    const product_image  = sanitize(b.product_image,  500)
    const product_price  = sanitize(b.product_price,   50)

    if (!product_handle) {
        return NextResponse.json({ error: 'Missing product_handle' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('wishlists')
        .upsert(
            { user_id: userId, product_handle, product_title, product_image, product_price },
            { onConflict: 'user_id,product_handle' }
        )

    if (error) {
        console.error('[wishlist] POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}

// DELETE — remove a product from the signed-in user's wishlist
export async function DELETE(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const handle = searchParams.get('handle')
    if (!handle || typeof handle !== 'string' || handle.length > 200) {
        return NextResponse.json({ error: 'Missing or invalid handle' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_handle', handle)

    if (error) {
        console.error('[wishlist] DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}
