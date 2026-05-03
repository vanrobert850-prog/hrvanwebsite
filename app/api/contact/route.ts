import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabase'

function sanitize(val: unknown, max: number): string {
    if (typeof val !== 'string') return ''
    return val.trim().slice(0, max)
}

export async function POST(req: Request) {
    let body: unknown
    try { body = await req.json() } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const b = body as Record<string, unknown>

    const full_name   = sanitize(b.full_name,   120)
    const email       = sanitize(b.email,        200)
    const artist_name = sanitize(b.artist_name,  120)
    const instagram   = sanitize(b.instagram,    100)
    const website     = sanitize(b.website,      300)
    const medium      = sanitize(b.medium,        80)
    const experience  = sanitize(b.experience,    10)
    const portfolio   = sanitize(b.portfolio,    300)
    const message     = sanitize(b.message,     2000)

    // Basic required-field validation
    if (!full_name || !email || !artist_name || !portfolio || !message) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('artist_applications')
        .insert({
            full_name,
            email,
            artist_name,
            instagram:  instagram  || null,
            website:    website    || null,
            medium:     medium     || null,
            experience: experience || null,
            portfolio,
            message,
            status: 'pending',
        })

    if (error) {
        console.error('[contact] Supabase insert error:', error.code)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}
