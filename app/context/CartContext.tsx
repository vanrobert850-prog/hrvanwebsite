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

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [cart,     setCart]     = useState<ShopifyCart | null>(null)
    const [cartOpen, setCartOpen] = useState(false)
    const [loading,  setLoading]  = useState(false)

    // ── Save cartId to Clerk user metadata ────────────────────────
    const saveCartIdToAccount = async (cartId: string) => {
        try {
            await fetch('/api/cart/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId }),
            })
        } catch (e) {
            console.error('Failed to save cart to account:', e)
        }
    }

    // ── Load cartId from Clerk user metadata ──────────────────────
    const loadCartIdFromAccount = async (): Promise<string | null> => {
        try {
            const res = await fetch('/api/cart/save')
            const data = await res.json()
            return data.cartId ?? null
        } catch {
            return null
        }
    }

    // ── Clear cartId from Clerk user metadata ─────────────────────
    const clearCartFromAccount = async () => {
        try {
            await fetch('/api/cart/save', { method: 'DELETE' })
        } catch (e) {
            console.error('Failed to clear cart from account:', e)
        }
    }

    // ── Bootstrap cart on mount / user change ─────────────────────
    useEffect(() => {
        if (!isLoaded) return

        const initCart = async () => {
            setLoading(true)

            if (user) {
                // Signed in: try to load cart from account first
                const accountCartId = await loadCartIdFromAccount()

                if (accountCartId) {
                    const existingCart = await getCart(accountCartId)
                    if (existingCart) {
                        setCart(existingCart)
                        // Also keep localStorage in sync
                        localStorage.setItem('hr_cart_id', accountCartId)
                        setLoading(false)
                        return
                    }
                }

                // No account cart — check if there's a guest cart in localStorage to migrate
                const guestCartId = localStorage.getItem('hr_cart_id')
                if (guestCartId) {
                    const guestCart = await getCart(guestCartId)
                    if (guestCart) {
                        // Migrate guest cart to account
                        setCart(guestCart)
                        await saveCartIdToAccount(guestCartId)
                        setLoading(false)
                        return
                    }
                }

                // No cart at all — will be created on first addItem
            } else {
                // Signed out: use localStorage cart only
                const savedCartId = localStorage.getItem('hr_cart_id')
                if (savedCartId) {
                    const existingCart = await getCart(savedCartId)
                    if (existingCart) {
                        setCart(existingCart)
                    }
                }
            }

            setLoading(false)
        }

        initCart()
    }, [user, isLoaded])

    // ── Get or create a cart ──────────────────────────────────────
    const getOrCreateCart = async () => {
        if (cart) return cart

        const newCart = await createCart()
        localStorage.setItem('hr_cart_id', newCart.id)

        // If signed in, save to account too
        if (user) {
            await saveCartIdToAccount(newCart.id)
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