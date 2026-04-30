import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!

// For Server Component pages — redirects silently if not admin
export async function requireAdmin() {
    const { userId } = await auth()
    if (!userId || userId !== ADMIN_USER_ID) redirect('/')
    return userId
}

// For API routes — returns 403 if not admin
export async function verifyAdminApi(): Promise<NextResponse | null> {
    const { userId } = await auth()
    if (!userId || userId !== ADMIN_USER_ID) {
        console.warn(`[SECURITY] Unauthorized API attempt — userId: ${userId ?? 'none'}`)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return null
}