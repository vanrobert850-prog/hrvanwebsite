import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

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

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ profiles })
}

export async function POST(req: Request) {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { artist_slug, clerk_user_id, display_name } = await req.json()

    if (!artist_slug || !clerk_user_id || !display_name) {
        return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('artist_profiles')
        .upsert({ artist_slug, clerk_user_id, display_name }, { onConflict: 'artist_slug' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabaseAdmin.from('artist_profiles').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}