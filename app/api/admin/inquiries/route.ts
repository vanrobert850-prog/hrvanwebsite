import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!
async function verifyAdmin() {
    const { userId } = await auth()
    return userId === ADMIN_USER_ID
}

// GET — list all curator inquiries
export async function GET() {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabaseAdmin
        .from('curator_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[admin/inquiries] GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ items: data ?? [] })
}

// PATCH — update status of an inquiry
export async function PATCH(req: Request) {
    if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, status } = await req.json()
    if (!id || !['new', 'contacted', 'closed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('curator_inquiries')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('[admin/inquiries] PATCH error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}
