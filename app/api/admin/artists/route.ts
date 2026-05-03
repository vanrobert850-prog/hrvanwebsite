import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'
import { isValidSlug } from '@/app/lib/validate'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!

async function verifyAdmin() {
    const { userId } = await auth()
    return userId === ADMIN_USER_ID
}

export async function GET() {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: profiles, error } = await supabaseAdmin
        .from('artist_profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[admin/artists] GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ profiles })
}

export async function POST(req: Request) {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { artist_slug, clerk_user_id, display_name } = await req.json()

    if (!artist_slug || !clerk_user_id || !display_name) {
        return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    if (!isValidSlug(artist_slug)) {
        return NextResponse.json({ error: 'Invalid artist_slug format' }, { status: 400 })
    }
    if (typeof clerk_user_id !== 'string' || clerk_user_id.length > 64) {
        return NextResponse.json({ error: 'Invalid clerk_user_id' }, { status: 400 })
    }
    if (typeof display_name !== 'string' || display_name.length > 200) {
        return NextResponse.json({ error: 'Invalid display_name' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('artist_profiles')
        .upsert({ artist_slug, clerk_user_id, display_name }, { onConflict: 'artist_slug' })

    if (error) {
        console.error('[admin/artists] POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id || typeof id !== 'string' || id.length > 64) {
        return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('artist_profiles').delete().eq('id', id)
    if (error) {
        console.error('[admin/artists] DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}
