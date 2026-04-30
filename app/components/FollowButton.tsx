'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
    artistSlug: string
}

export default function FollowButton({ artistSlug }: FollowButtonProps) {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const [isFollowing,   setIsFollowing]   = useState(false)
    const [followerCount, setFollowerCount] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [acting,        setActing]        = useState(false)
    const [isOwnProfile,  setIsOwnProfile]  = useState(false)

    // Step 1 — always fetch follow status + count (works for guests too)
    useEffect(() => {
        fetch(`/api/follow?artist_slug=${artistSlug}`)
            .then(r => r.json())
            .then(data => {
                setIsFollowing(data.isFollowing ?? false)
                setFollowerCount(data.followerCount ?? 0)
            })
            .catch(() => {})
            .finally(() => setLoadingStatus(false))
    }, [artistSlug])

    // Step 2 — separately check if this is the artist's own profile
    // Uses a dedicated lightweight endpoint so it doesn't block rendering
    useEffect(() => {
        if (!isLoaded || !user) return

        fetch(`/api/artist-profile?artist_slug=${artistSlug}`)
            .then(r => r.json())
            .then(data => { setIsOwnProfile(data.isOwner === true) })
            .catch(() => {})
    }, [artistSlug, user, isLoaded])

    const handleFollow = async () => {
        if (!user) {
            router.push('/sign-in')
            return
        }
        setActing(true)
        const method = isFollowing ? 'DELETE' : 'POST'
        const res  = await fetch('/api/follow', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artist_slug: artistSlug }),
        })
        const data = await res.json()
        if (data.ok) {
            setIsFollowing(!isFollowing)
            setFollowerCount(c => isFollowing ? c - 1 : c + 1)
        }
        setActing(false)
    }

    // Show artist's own dashboard link
    if (isLoaded && user && isOwnProfile) {
        return (
            <a href={`/artist-dashboard/${artistSlug}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '1px solid #B85C38', color: '#B85C38',
                padding: '10px 24px', fontSize: 11, letterSpacing: '2px',
                textTransform: 'uppercase', textDecoration: 'none',
                transition: 'all 0.25s ease',
            }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                My Studio
            </a>
        )
    }

    // Always show follow button — even while loading (shows skeleton state)
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
                onClick={handleFollow}
                disabled={acting || loadingStatus}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid #111',
                    background: isFollowing ? '#111' : 'transparent',
                    color: isFollowing ? '#fff' : '#111',
                    padding: '10px 24px', fontSize: 11, letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: acting || loadingStatus ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.25s ease',
                    opacity: loadingStatus ? 0.5 : 1,
                    flexShrink: 0, alignSelf: 'center',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                {acting ? '...' : isFollowing ? 'Following' : 'Follow'}
            </button>

            {!loadingStatus && (
                <span style={{ fontSize: 13, color: '#888' }}>
                    {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                </span>
            )}
        </div>
    )
}