import { createStorefrontApiClient } from '@shopify/storefront-api-client'

export const shopifyClient = createStorefrontApiClient({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
    apiVersion:  '2026-01',
    publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})

// ── TYPES ─────────────────────────────────────────────────────────
export type ShopifyProduct = {
    id:          string
    title:       string
    handle:      string
    description: string
    priceRange: {
        minVariantPrice: { amount: string; currencyCode: string }
    }
    images: {
        edges: { node: { url: string; altText: string; width: number; height: number } }[]
    }
    variants: {
        edges: { node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean } }[]
    }
    tags:        string[]
    vendor:      string
    productType: string
}

export type ShopifyCart = {
    id:    string
    checkoutUrl: string
    lines: {
        edges: {
            node: {
                id:       string
                quantity: number
                merchandise: {
                    id:    string
                    title: string
                    product: { title: string; handle: string }
                    image: { url: string }
                    price: { amount: string; currencyCode: string }
                }
            }
        }[]
    }
    cost: {
        totalAmount:    { amount: string; currencyCode: string }
        subtotalAmount: { amount: string; currencyCode: string }
    }
}

// ── FRAGMENTS ─────────────────────────────────────────────────────
const PRODUCT_FRAGMENT = `
  id title handle description vendor productType tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 10) { edges { node { url altText width height } } }
  variants(first: 10) {
    edges {
      node {
        id title availableForSale
        price { amount currencyCode }
      }
    }
  }
`

const CART_FRAGMENT = `
  id checkoutUrl
  lines(first: 100) {
    edges {
      node {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title
            product { title handle }
            image { url }
            price { amount currencyCode }
          }
        }
      }
    }
  }
  cost {
    totalAmount    { amount currencyCode }
    subtotalAmount { amount currencyCode }
  }
`

// ── PRODUCT FUNCTIONS ─────────────────────────────────────────────

export async function getAllProducts(): Promise<ShopifyProduct[]> {
    const { data, errors } = await shopifyClient.request(`
    query getAllProducts {
      products(first: 100, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FRAGMENT} } }
      }
    }
  `)
    if (errors) { console.error('getAllProducts errors:', errors); return [] }
    return data?.products?.edges?.map((e: { node: ShopifyProduct }) => e.node) ?? []
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const { data, errors } = await shopifyClient.request(`
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FRAGMENT}
      }
    }
  `, { variables: { handle } })
    if (errors) { console.error('getProductByHandle errors:', JSON.stringify(errors)); return null }
    return data?.product ?? null
}

export async function getProductsByType(type: string): Promise<ShopifyProduct[]> {
    const { data, errors } = await shopifyClient.request(`
    query getByType($query: String!) {
      products(first: 100, query: $query) {
        edges { node { ${PRODUCT_FRAGMENT} } }
      }
    }
  `, { variables: { query: `product_type:${type}` } })
    if (errors) { console.error('getProductsByType errors:', errors); return [] }
    return data?.products?.edges?.map((e: { node: ShopifyProduct }) => e.node) ?? []
}

export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
    const { data, errors } = await shopifyClient.request(`
    query search($query: String!) {
      products(first: 20, query: $query) {
        edges { node { ${PRODUCT_FRAGMENT} } }
      }
    }
  `, { variables: { query } })
    if (errors) { console.error('searchProducts errors:', errors); return [] }
    return data?.products?.edges?.map((e: { node: ShopifyProduct }) => e.node) ?? []
}

// ── CART FUNCTIONS ────────────────────────────────────────────────

export async function createCart(): Promise<ShopifyCart> {
    const { data, errors } = await shopifyClient.request(`
    mutation createCart {
      cartCreate { cart { ${CART_FRAGMENT} } }
    }
  `)
    if (errors) console.error('createCart errors:', errors)
    return data?.cartCreate?.cart
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
    const { data, errors } = await shopifyClient.request(`
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
      }
    }
  `, { variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] } })
    if (errors) console.error('addToCart errors:', errors)
    return data?.cartLinesAdd?.cart
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
    const { data, errors } = await shopifyClient.request(`
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FRAGMENT} }
      }
    }
  `, { variables: { cartId, lineIds: [lineId] } })
    if (errors) console.error('removeFromCart errors:', errors)
    return data?.cartLinesRemove?.cart
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
    const { data, errors } = await shopifyClient.request(`
    mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
      }
    }
  `, { variables: { cartId, lines: [{ id: lineId, quantity }] } })
    if (errors) console.error('updateCartLine errors:', errors)
    return data?.cartLinesUpdate?.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
    const { data, errors } = await shopifyClient.request(`
    query getCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FRAGMENT} }
    }
  `, { variables: { cartId } })
    if (errors) console.error('getCart errors:', errors)
    return data?.cart ?? null
}

// ── HELPERS ───────────────────────────────────────────────────────
export function formatPrice(amount: string, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency', currency,
    }).format(parseFloat(amount))
}

export function getProductImage(product: ShopifyProduct, index = 0): string {
    return product.images?.edges?.[index]?.node?.url ?? ''
}

export function getFirstVariantId(product: ShopifyProduct): string {
    return product.variants?.edges?.[0]?.node?.id ?? ''
}