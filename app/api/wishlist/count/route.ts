import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

// GET — public endpoint: how many users have this product in their wishlist
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const handle = searchParams.get('handle')

    if (!handle || typeof handle !== 'string' || handle.length > 200) {
        return NextResponse.json({ count: 0 })
    }

    const { count, error } = await supabaseAdmin
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('product_handle', handle)

    if (error) {
        console.error('[wishlist/count] error:', error)
        return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: count ?? 0 }, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
}
