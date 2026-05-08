# Duplicate directory — safe to delete

This directory (`app/api/weebhooks/`) is a typo of `app/api/webhooks/`.

The file `app/api/weebhooks/shopify/route.ts` is a duplicate of (or stale copy of) the intended Shopify webhook handler.

**Action required:** Confirm whether `app/api/webhooks/shopify/route.ts` is the canonical version, then delete this entire `weebhooks` directory to avoid confusion and dead routes.
