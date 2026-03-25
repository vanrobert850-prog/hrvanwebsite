'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
    const [cart,      setCart]      = useState<ShopifyCart | null>(null)
    const [cartOpen,  setCartOpen]  = useState(false)
    const [loading,   setLoading]   = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCartId = localStorage.getItem('hr_cart_id')
        if (savedCartId) {
            getCart(savedCartId).then(c => { if (c) setCart(c) })
        }
    }, [])

    const getOrCreateCart = async () => {
        if (cart) return cart
        const newCart = await createCart()
        localStorage.setItem('hr_cart_id', newCart.id)
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