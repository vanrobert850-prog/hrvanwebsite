import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute     = createRouteMatcher(['/admin(.*)', '/api/admin(.*)'])
const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)', '/artist-dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const { userId } = await auth()

        // Layer 1 — not signed in → silent redirect to home, reveal nothing
        if (!userId) {
            console.warn(`[SECURITY] Unauthenticated attempt: ${req.nextUrl.pathname}`)
            return NextResponse.redirect(new URL('/', req.url))
        }

        // Layer 2 — admin routes → exact hardcoded user ID required
        if (isAdminRoute(req)) {
            const adminId = process.env.ADMIN_USER_ID
            if (!adminId || userId !== adminId) {
                console.warn(`[SECURITY] Unauthorized admin attempt — userId: ${userId}`)
                return NextResponse.redirect(new URL('/', req.url))
            }
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}