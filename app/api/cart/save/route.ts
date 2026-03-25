import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// POST — saves cartId to the signed-in user's metadata
export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { cartId } = await req.json()
    if (!cartId) return NextResponse.json({ error: 'Missing cartId' }, { status: 400 })

    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
        privateMetadata: { shopifyCartId: cartId },
    })

    return NextResponse.json({ ok: true })
}

// GET — retrieves the cartId from the signed-in user's metadata
export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ cartId: null })

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const cartId = (user.privateMetadata?.shopifyCartId as string) ?? null

    return NextResponse.json({ cartId })
}

// DELETE — clears the cartId from the signed-in user's metadata
export async function DELETE() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
        privateMetadata: { shopifyCartId: null },
    })

    return NextResponse.json({ ok: true })
}