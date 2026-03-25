'use client'
import { useEffect, useState } from 'react'

export default function TestPage() {
    const [result, setResult] = useState<string>('Loading...')

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import('../lib/shopify').then(({ getProductByHandle }: any) => {
            getProductByHandle('golden-horizon')
                .then((product: { title: string; priceRange: { minVariantPrice: { amount: string } } } | null) => {
                    if (product) {
                        setResult(`✅ SUCCESS! Found: ${product.title} — $${product.priceRange.minVariantPrice.amount}`)
                    } else {
                        setResult('❌ Product not found — handle does not match any product in Shopify')
                    }
                })
                .catch((err: Error) => setResult(`❌ API Error: ${err.message}`))
        }).catch((err: Error) => setResult(`❌ Import Error: ${err.message}`))
    }, [])

    return (
        <div style={{ padding: 48, fontFamily: 'monospace', fontSize: 16, background: '#fff', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: 24, fontSize: 24 }}>Shopify Connection Test</h1>

            <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5' }}>
                <p style={{ marginBottom: 8 }}>
                    Store domain:{' '}
                    <strong>{process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '❌ NOT SET'}</strong>
                </p>
                <p>
                    Access token:{' '}
                    <strong>
                        {process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
                            ? `✅ Set (starts with: ${process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.slice(0, 6)}...)`
                            : '❌ NOT SET — .env.local is missing or not loaded'}
                    </strong>
                </p>
            </div>

            <div style={{
                padding: 24,
                background: result.startsWith('✅') ? '#e8f5e9' : '#ffebee',
                borderRadius: 4,
                fontSize: 15,
            }}>
                {result}
            </div>

            <div style={{ marginTop: 24, fontSize: 13, color: '#888' }}>
                <p>If token says NOT SET → your .env.local file is missing or the server needs restart</p>
                <p>If API Error → your token is wrong or Storefront API scopes are not enabled</p>
                <p>If Product not found → the handle in Shopify doesn&#39;t match &#34;golden-horizon&#34;</p>
            </div>
        </div>
    )
}