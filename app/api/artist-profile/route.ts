import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabase'

// GET /api/artist-profile?artist_slug=maria-ruiz
// Returns { isOwner: true/false } — safe for any authenticated user to call
export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ isOwner: false })

    const { searchParams } = new URL(req.url)
    const artist_slug = searchParams.get('artist_slug')
    if (!artist_slug) return NextResponse.json({ isOwner: false })

    const { data } = await supabaseAdmin
        .from('artist_profiles')
        .select('clerk_user_id')
        .eq('artist_slug', artist_slug)
        .eq('clerk_user_id', userId)
        .single()

    return NextResponse.json({ isOwner: !!data })
}