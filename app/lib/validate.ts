export function isValidSlug(slug: unknown): slug is string {
    return typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug) && slug.length >= 1 && slug.length <= 100
}
