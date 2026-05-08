import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabase'

function sanitize(val: unknown, max: number): string {
    if (typeof val !== 'string') return ''
    return val.trim().slice(0, max)
}

export async function POST(req: Request) {
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 8000) {
        return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    let body: unknown
    try { body = await req.json() } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const b = body as Record<string, unknown>

    const full_name    = sanitize(b.full_name,   120)
    const email        = sanitize(b.email,        200)
    const phone        = sanitize(b.phone,         30)
    const artist_name  = sanitize(b.artist_name,  120)
    const inquiry_type = sanitize(b.inquiry_type,  80)
    const budget       = sanitize(b.budget,         60)
    const timeline     = sanitize(b.timeline,       80)
    const message      = sanitize(b.message,      2000)

    if (!full_name || !email || !message) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('curator_inquiries')
        .insert({
            full_name,
            email,
            phone:        phone        || null,
            artist_name:  artist_name  || null,
            inquiry_type: inquiry_type || null,
            budget:       budget       || null,
            timeline:     timeline     || null,
            message,
            status: 'new',
        })

    if (error) {
        console.error('[inquire] Supabase insert error:', error.code)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, {
        headers: { 'X-Robots-Tag': 'noindex' }
    })
}
