import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabase'
import { isValidSlug } from '../../lib/validate'

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { artist_slug } = await req.json()
    if (!isValidSlug(artist_slug)) {
        return NextResponse.json({ error: 'Invalid artist_slug' }, { status: 400 })
    }

    const { data: artistProfile } = await supabaseAdmin
        .from('artist_profiles')
        .select('clerk_user_id')
        .eq('artist_slug', artist_slug)
        .single()

    if (artistProfile?.clerk_user_id === userId) {
        return NextResponse.json({ error: 'Artists cannot follow themselves' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('follows')
        .insert({ follower_id: userId, artist_slug })

    if (error) {
        if (error.code === '23505') return NextResponse.json({ error: 'Already following' }, { status: 400 })
        console.error('[follow] Insert error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    await supabaseAdmin.from('notifications').insert({
        artist_slug,
        follower_id: userId,
        message: 'You have a new follower!',
    })

    return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { artist_slug } = await req.json()
    if (!isValidSlug(artist_slug)) {
        return NextResponse.json({ error: 'Invalid artist_slug' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('follows')
        .delete()
        .eq('follower_id', userId)
        .eq('artist_slug', artist_slug)

    if (error) {
        console.error('[follow] Delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
    const { userId } = await auth()
    const { searchParams } = new URL(req.url)
    const artist_slug = searchParams.get('artist_slug')

    if (!isValidSlug(artist_slug)) {
        return NextResponse.json({ error: 'Invalid artist_slug' }, { status: 400 })
    }

    const [{ count }, { data: userFollow }] = await Promise.all([
        supabaseAdmin
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('artist_slug', artist_slug),
        userId
            ? supabaseAdmin
                .from('follows')
                .select('id')
                .eq('follower_id', userId)
                .eq('artist_slug', artist_slug)
                .single()
            : Promise.resolve({ data: null }),
    ])

    return NextResponse.json({
        followerCount: count ?? 0,
        isFollowing: !!userFollow,
    })
}
