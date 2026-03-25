'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { createCart, addToCart, removeFromCart, updateCartLine, getCart, ShopifyCart } from '../lib/shopify'

interface CartContextType {
    cart:          ShopifyCart | null
    cartCount:     number
    cartOpen:      boolean
    setCartOpen:   (open: boolean) => void
    addItem:       (variantId: string, quantity?: number) => Promise<void>
    removeItem:    (lineId: string) => Promise<void>
    updateItem:    (lineId: string, quantity: number) => Promise<void>
    checkout:      () => void
    loading:       boolean
}

const CartContext = createContext<CartContextType>({
    cart: null, cartCount: 0, cartOpen: false,
    setCartOpen: () => {}, addItem: async () => {},
    removeItem: async () => {}, updateItem: async () => {},
    checkout: () => {}, loading: false,
})

// ── API helpers (Clerk account) ───────────────────────────────────
const saveCartToAccount = (cartId: string) =>
    fetch('/api/cart/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId }),
    }).catch(console.error)

const loadCartFromAccount = async (): Promise<string | null> => {
    try {
        const r = await fetch('/api/cart/save')
        const d = await r.json()
        return d.cartId ?? null
    } catch { return null }
}

const clearCartFromAccount = () =>
    fetch('/api/cart/save', { method: 'DELETE' }).catch(console.error)

// ── localStorage helpers (guest only) ────────────────────────────
const GUEST_KEY = 'hr_guest_cart_id'
const getGuestCartId = ()           => localStorage.getItem(GUEST_KEY)
const setGuestCartId = (id: string) => localStorage.setItem(GUEST_KEY, id)
const clearGuestCart = ()           => localStorage.removeItem(GUEST_KEY)

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [cart,     setCart]     = useState<ShopifyCart | null>(null)
    const [cartOpen, setCartOpen] = useState(false)
    const [loading,  setLoading]  = useState(false)
    const [prevUserId, setPrevUserId] = useState<string | null | undefined>(undefined)

    useEffect(() => {
        if (!isLoaded) return

        const initCart = async () => {
            setLoading(true)

            const currentUserId = user?.id ?? null
            const justLoggedOut = prevUserId !== undefined && prevUserId !== null && currentUserId === null
            const justLoggedIn  = (prevUserId === undefined || prevUserId === null) && currentUserId !== null

            // ── SIGNED OUT ────────────────────────────────────────
            if (!currentUserId) {
                if (justLoggedOut) {
                    // Wipe everything so account cart is NOT visible as guest
                    clearGuestCart()
                    setCart(null)
                    setPrevUserId(null)
                    setLoading(false)
                    return
                }

                // Normal guest session — localStorage only
                const guestCartId = getGuestCartId()
                if (guestCartId) {
                    const guestCart = await getCart(guestCartId)
                    if (guestCart) {
                        setCart(guestCart)
                        setPrevUserId(null)
                        setLoading(false)
                        return
                    }
                    clearGuestCart() // expired in Shopify
                }

                setCart(null)
                setPrevUserId(null)
                setLoading(false)
                return
            }

            // ── SIGNED IN ─────────────────────────────────────────
            // Load cart from Clerk account
            const accountCartId = await loadCartFromAccount()

            if (accountCartId) {
                const accountCart = await getCart(accountCartId)
                if (accountCart) {
                    setCart(accountCart)
                    // Clean up any leftover guest cart now that we have account cart
                    if (justLoggedIn) clearGuestCart()
                    setPrevUserId(currentUserId)
                    setLoading(false)
                    return
                }
                // Cart expired in Shopify — clear it from account
                await clearCartFromAccount()
            }

            // Just logged in with a guest cart → migrate it to account
            if (justLoggedIn) {
                const guestCartId = getGuestCartId()
                if (guestCartId) {
                    const guestCart = await getCart(guestCartId)
                    if (guestCart) {
                        setCart(guestCart)
                        await saveCartToAccount(guestCartId)
                        clearGuestCart() // no longer needed in localStorage
                        setPrevUserId(currentUserId)
                        setLoading(false)
                        return
                    }
                    clearGuestCart() // expired
                }
            }

            // No cart anywhere — created on first addItem
            setCart(null)
            setPrevUserId(currentUserId)
            setLoading(false)
        }

        initCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, isLoaded])

    // ── Get or create a cart ──────────────────────────────────────
    const getOrCreateCart = async () => {
        if (cart) return cart

        const newCart = await createCart()

        if (user) {
            // Signed in → account only, never localStorage
            await saveCartToAccount(newCart.id)
        } else {
            // Guest → localStorage only, never account
            setGuestCartId(newCart.id)
        }

        setCart(newCart)
        return newCart
    }

    const cartCount = cart?.lines?.edges?.reduce((sum, e) => sum + e.node.quantity, 0) ?? 0

    const addItem = async (variantId: string, quantity = 1) => {
        setLoading(true)
        try {
            const c = await getOrCreateCart()
            const updated = await addToCart(c.id, variantId, quantity)
            setCart(updated)
            setCartOpen(true)
        } finally {
            setLoading(false)
        }
    }

    const removeItem = async (lineId: string) => {
        if (!cart) return
        setLoading(true)
        try {
            const updated = await removeFromCart(cart.id, lineId)
            setCart(updated)
        } finally {
            setLoading(false)
        }
    }

    const updateItem = async (lineId: string, quantity: number) => {
        if (!cart) return
        setLoading(true)
        try {
            const updated = await updateCartLine(cart.id, lineId, quantity)
            setCart(updated)
        } finally {
            setLoading(false)
        }
    }

    const checkout = () => {
        if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl
    }

    return (
        <CartContext.Provider value={{ cart, cartCount, cartOpen, setCartOpen, addItem, removeItem, updateItem, checkout, loading }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}