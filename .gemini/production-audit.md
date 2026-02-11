# Production Audit & Enhancement Plan

## 🔴 CRITICAL Security Issues
1. **No middleware.ts** — Admin routes have NO server-side auth guard. Protection is only client-side. A user can bypass ProtectedRoute.
2. **No CSRF protection** — All mutations happen via Supabase SDK (mitigated by RLS), but no additional CSRF headers.
3. **Anon Key exposed freely** — Standard for Supabase, but ALL write ops rely on RLS being configured correctly.
4. **useAdmin hook creates Supabase client on every render** (line 10 of use-admin.ts: `const supabase = createClient();`)
5. **No rate limiting on login** — Brute force is only mitigated by Supabase's built-in rate limiting.

## 🟡 Code Quality Issues
1. **Dead code: `components/shop/`** — Duplicate of `components/products/`, zero imports.
2. **Duplicate `formatPrice`** — Defined in `lib/format.ts`, `components/shop/product-card.tsx`, `components/shop/product-detail.tsx`, and `components/products/product-card.tsx`.
3. **`as any` casts** in authService.ts (line 24), use-admin.ts (line 45).
4. **Inconsistent Supabase client creation** — authService creates its own client; AuthContext creates its own; use-admin creates its own every render.
5. **`imageOptimizer.ts`** — Utility for client-side image compression, needs review.
6. **Cart persists full Product objects** — localStorage could get huge if products have many images.

## 🟢 UI/UX Enhancements Needed
1. **Loading screen** — Basic spinner, should use brand logo.
2. **Toast container** — No dark mode support for toasts.
3. **Modal** — Missing body scroll lock.
4. **404 page** — Plain styling, no animations.
5. **Admin mobile nav** — Too many items for mobile bar (8 items).
6. **Product card** — No staggered reveal animation.
7. **No page transitions** — Abrupt content switches between admin tabs.
8. **Footer** — Minimal, could be more premium.

## Action Plan (In Order)
1. ✅ Create `middleware.ts` for auth protection
2. ✅ Delete dead `components/shop/` folder
3. ✅ Enhance `globals.css` with keyframe animations
4. ✅ Polish all UI components (loading, toast, modal, 404)
5. ✅ Add subtle animations to all pages
6. ✅ Fix all `as any` casts
7. ✅ Deduplicate Supabase client creation
8. ✅ Build & test
