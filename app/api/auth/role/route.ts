import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!

export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ isAdmin: false, artistSlug: null })

    if (userId === ADMIN_USER_ID) {
        return NextResponse.json({ isAdmin: true, artistSlug: null })
    }

    const { data: profile } = await supabaseAdmin
        .from('artist_profiles')
        .select('artist_slug')
        .eq('clerk_user_id', userId)
        .single()

    return NextResponse.json({ isAdmin: false, artistSlug: profile?.artist_slug ?? null })
}
