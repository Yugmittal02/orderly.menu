Analyze the entire codebase against this checklist and answer every question below. Be specific — show file contents or code snippets where asked. Do not summarize vaguely, I need exact answers.

--- CATEGORY ARCHITECTURE ---

### 1. Does /backend/models/Category.js exist? If yes, show full file contents.

**✅ EXISTS**

```js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    icon: { type: String, default: '📦' },
    colorFrom: { type: String, default: '#F97316' },
    colorTo: { type: String, default: '#FB923C' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isQuickPick: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

categorySchema.pre('validate', function () {
    if (this.name && (!this.slug || this.isModified('name'))) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
});

module.exports = mongoose.model('Category', categorySchema);
```

---

### 2. Does /backend/routes/categories.js exist? If yes, list every endpoint defined.

**✅ EXISTS** — 5 endpoints:

| Method | Path | Auth | Handler |
|---|---|---|---|
| `GET` | `/` | Public | `getAllCategories` |
| `GET` | `/:slug` | Public | `getCategoryBySlug` |
| `POST` | `/` | Admin | `createCategory` |
| `PUT` | `/:id` | Admin | `updateCategory` |
| `DELETE` | `/:id` | Admin | `deleteCategory` |

---

### 3. Is /api/categories mounted in server.js? Show the relevant line.

**✅ DONE** — [server.js L173](file:///x:/SevaShubham/wow/backend/server.js#L173):

```js
app.use("/api/categories", require("./routes/categories"));
```

---

### 4. In ProductFormModal.jsx — is the Category dropdown hardcoded or fetched from /api/categories?

**✅ DONE — Fetched from API**

```js
import { updateProduct, createProduct, fetchCategories as fetchCategoriesAPI } from '../../services/api';

// ...
useEffect(() => {
    const loadCategories = async () => {
        try {
            const { data } = await fetchCategoriesAPI();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };
    loadCategories();
}, []);
```

Dropdown shows `cat.icon + cat.name` and stores `cat._id` (ObjectId):

```jsx
<span>{cat.icon || '📦'} {cat.name}</span>
```

---

### 5. In MainCategoryCards.jsx — is the categories array hardcoded or fetched from backend?

**✅ DONE — Fetched from API**

```js
import { fetchCategories } from '../services/api';

useEffect(() => {
    const load = async () => {
        try {
            const { data } = await fetchCategories();
            setCategories(data.filter(c => c.isActive));
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
        setLoading(false);
    };
    load();
}, []);
```

Includes skeleton loading while fetching.

---

### 6. In CategoryPage.jsx — does it fetch category details from API, or just filter products by string?

**✅ DONE — Fetches from API by slug**

```js
import { fetchProducts, fetchCategoryBySlug } from '../services/api';

useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        try {
            const catRes = await fetchCategoryBySlug(categoryId);
            setCategory(catRes.data);
            const prodRes = await fetchProducts(categoryId);
            setAllProducts(prodRes.data || []);
        } catch (error) { /* fallback */ }
        setLoading(false);
    };
    loadData();
}, [categoryId]);
```

Theme colors, icon, name, description all come from the API response. No hardcoded `CATEGORY_CONFIG` anymore.

---

--- ADMIN PANEL ---

### 7. Does AdminDashboard or AdminLayout have a "Categories" tab?

**✅ DONE** — [AdminLayout.jsx L14-22](file:///x:/SevaShubham/wow/frontend/src/components/admin/AdminLayout.jsx#L14-L22):

```js
const tabs = [
    { id: "orders", label: "Orders", icon: FaClipboardList },
    { id: "menu", label: "Menu", icon: FaUtensils },
    { id: "categories", label: "Categories", icon: FaLayerGroup },
    { id: "offers", label: "Offers", icon: FaTag },
    { id: "customers", label: "Users", icon: FaUsers },
    { id: "revenue", label: "Stats", icon: FaChartLine },
    { id: "settings", label: "Settings", icon: FaCog },
];
```

And in [AdminDashboard.jsx](file:///x:/SevaShubham/wow/frontend/src/pages/AdminDashboard.jsx):

```jsx
{activeTab === 'categories' && (
    <AdminCategories />
)}
```

---

### 8. Does /frontend/src/components/admin/AdminCategories.jsx exist?

**✅ EXISTS** — Full CRUD component with:
- Cards showing image, name, icon, product count, active/quickpick badges
- Add/Edit modal with: name, description, image upload (Cloudinary), icon emoji, colorFrom/colorTo color pickers, sortOrder, isActive, isQuickPick toggles
- Live gradient preview
- Delete with confirmation (blocked if products assigned)

---

### 9. In AdminOrders.jsx — are orders shown as a table or mobile cards? Do Accept/Reject buttons exist?

**✅ DONE — Mobile cards with Accept + Reject buttons**

Orders render as vertical cards (`rounded-3xl p-5`). For Pending orders:

```jsx
<div className="flex gap-2">
    <button onClick={() => onAcceptOrder(order._id)}
        className="flex-1 py-3.5 text-white font-bold rounded-xl"
        style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}>
        <FaCheckCircle /> Accept
    </button>
    <button onClick={() => onUpdateStatus(order._id, 'Cancelled')}
        className="py-3.5 px-5 font-bold rounded-xl"
        style={{ background: '#FEE2E2', color: '#DC2626' }}>
        <FaTimesCircle /> Reject
    </button>
</div>
```

Also includes:
- Clickable phone number (`<a href="tel:...">`)
- Visual status stepper with colored connecting lines (Pending → Prep → Ready → Done)

---

### 10. In AdminMenu.jsx — is there a category filter bar to view products by category?

**❌ NOT DONE** — No category filter bar exists in `AdminMenu.jsx`. Products are listed flat without category filtering. This would be a future enhancement.

---

--- HOMEPAGE DYNAMIC SECTIONS ---

### 11. How is the "100% Eggless" banner text set?

**PARTIAL — Hardcoded in JSX** — In `Home.jsx`, the `DeliveryStrip` component:

```jsx
const DeliveryStrip = () => (
    <div style={{ padding: '0 16px', marginTop: '4px' }}>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {[
                { icon: '⚡', title: 'Express Delivery', sub: 'Within 2 hours' },
                { icon: '🌿', title: '100% Eggless', sub: 'Pure Vegetarian' },
                { icon: '🎁', title: 'Free Delivery', sub: 'Above ₹500' },
            ].map(/* ... */)}
        </div>
    </div>
);
```

Not from Settings API — all hardcoded.

---

### 12. How are Express Delivery / Free Delivery / 100% Fresh badges rendered?

**PARTIAL — Hardcoded** — Same `DeliveryStrip` component above. Not fetched from Settings API.

---

### 13. How is the Quick Picks section built?

**PARTIAL — From DB but filtering is client-side.** Home.jsx fetches all products from `fetchProducts()` then filters for `isBestseller` in a `useMemo`:

```js
const bestsellerProducts = useMemo(() => {
    return filteredProducts.filter(p => p.isBestseller);
}, [filteredProducts]);
```

The `SubCategoryRow` component (rendered inside `MainCategoryCards`) provides quick sub-category links, but these are hardcoded in that component's source.

---

### 14. Is there a live search feature on the homepage?

**✅ DONE** — [Home.jsx L137-170](file:///x:/SevaShubham/wow/frontend/src/pages/Home.jsx#L137-L170):

```jsx
<input
    type="text"
    placeholder="Search for cakes, pastries…"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    // ... styled with border highlight on focus
/>
```

With debounced filtering (150ms):

```js
const filteredProducts = useMemo(() => {
    return products.filter(p =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
}, [products, debouncedSearch]);
```

---

--- CUSTOMER FLOW ---

### 15. In CategoryPage.jsx — are there subcategory filter chips?

**✅ DONE — Dynamically generated from product data**

```js
const subcategories = useMemo(() => {
    const subs = new Set();
    allProducts.forEach(p => {
        if (Array.isArray(p.subcategories)) {
            p.subcategories.forEach(s => subs.add(s));
        }
    });
    return ['All', ...Array.from(subs).sort()];
}, [allProducts]);
```

Rendered as pill chips with category-themed gradient:

```jsx
{subcategories.length > 1 && (
    <div className="flex overflow-x-auto pb-3 gap-2 hide-scrollbar">
        {subcategories.map((sub) => (
            <button key={sub} onClick={() => setActiveSubcategory(sub)}
                className="flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold"
                style={{ background: activeSubcategory === sub ? gradient : '#FFFFFF' }}>
                {sub}
            </button>
        ))}
    </div>
)}
```

---

### 16. Is there a sort option on CategoryPage?

**❌ NOT DONE** — No sort by Price, Popularity, etc. Products are displayed in the order returned by the API (`createdAt: -1`).

---

### 17. In BottomNav.jsx — does the Orders tab show an active order count badge?

**❌ NOT DONE** — No badge on the Orders tab. It's a static icon/label:

```js
const navItems = [
    { path: '/menu', icon: FaHome, label: 'Home' },
    { path: '/categories', icon: FaThLarge, label: 'Categories' },
    { path: '/dashboard', icon: FaClipboardList, label: 'Orders' },
    { path: '/dashboard', icon: FaUser, label: 'Profile' },
];
```

No active order count fetching or badge rendering.

---

### 18. In Header.jsx — does the cart icon show a live item count badge from CartContext?

**✅ DONE** — [Header.jsx L74-89](file:///x:/SevaShubham/wow/frontend/src/components/Header.jsx#L74-L89):

```jsx
const { getItemCount } = useCart();
const itemCount = getItemCount();

// In JSX:
<button onClick={() => navigate('/cart')} className="relative w-9 h-9 rounded-full"
    style={{ background: '#E8956A' }}>
    <FaShoppingCart size={14} color="#FFFFFF" />
    {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold rounded-full"
            style={{ background: '#E53935', minWidth: '18px', height: '18px' }}>
            {itemCount}
        </span>
    )}
</button>
```

---

--- DATA & MIGRATION ---

### 19. Does /backend/scripts/migrateCategories.js exist?

**✅ EXISTS** — File is at [migrateToCategories.js](file:///x:/SevaShubham/wow/backend/scripts/migrateToCategories.js) (named slightly differently). Contains:
- Reads all unique category strings from products collection (raw MongoDB)
- Seeds 8 categories with icon/color data from the plan
- Updates every product's category field from string → ObjectId
- Idempotent (safe to run twice)
- **Already ran successfully** — 8 categories seeded, 6 products migrated

---

### 20. In Product.js — what is the exact type definition of the category field?

**✅ DONE** — [Product.js L7](file:///x:/SevaShubham/wow/backend/models/Product.js#L7):

```js
category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
```

Changed from `String` → `ObjectId ref 'Category'`.

---

### 21. Are there existing Category documents in MongoDB?

**✅ DONE** — Migration ran successfully. 8 categories exist:

| Name | Icon | ID |
|---|---|---|
| Cake | 🎂 | `69a876352076988f1bbfcdd6` |
| Fastfood | 🍔 | `69a876352076988f1bbfcdd9` |
| Cakes | 📦 | `69a876362076988f1bbfcddc` |
| Bakery | 🍞 | `69a876362076988f1bbfcddf` |
| Beverages | ☕ | `69a876362076988f1bbfcde2` |
| Flowers | 🌸 | `69a876362076988f1bbfcde5` |
| Sweets | 🍬 | `69a876362076988f1bbfcde8` |
| Namkeen | 🥨 | `69a876362076988f1bbfcdeb` |
| Pizza | 🍕 | `69a876362076988f1bbfcdee` |

(Note: "Cakes" was an existing product category string separate from "Cake".)

---

--- DEPLOYMENT READINESS ---

### 22. Is Razorpay in test mode or live mode?

**✅ DONE — Via environment variables.** Razorpay keys are loaded from `process.env`:
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are configured via `.env` file
- No hardcoded keys in source code
- Whether test or live depends on the `.env` values (`rzp_test_*` vs `rzp_live_*`)
- Frontend fetches the key from `GET /api/payments/key`

To switch to live: change `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env` to live keys.

---

### 23. Search for hardcoded secrets in source files.

**✅ CLEAN — No hardcoded secrets found.**

Searched for:
- `mongodb+srv://` — ❌ Not found in any `.js`/`.jsx` source
- `cloudinary.*api` — ❌ Not found
- `rzp_live_` / `rzp_test_` — ❌ Not found

All secrets are in `.env` (which should be `.gitignore`d):
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

---

### 24. In vite.config.js — what is the API base URL set to?

**PARTIAL** — [vite.config.js](file:///x:/SevaShubham/wow/frontend/vite.config.js) does NOT configure a proxy or API base URL. The API base URL is set in `api.js`:

```js
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
```

For production, set `VITE_API_URL` environment variable during build. Fallback is `http://localhost:5000/api`.

---

### 25. Is there any error boundary, loading state, or fallback UI when API is unreachable?

**PARTIAL**

| Feature | Status |
|---|---|
| `ErrorBoundary` component | ❌ None |
| `try/catch` in fetch calls | ✅ All API calls have try/catch |
| Loading skeletons | ✅ Home, MainCategoryCards, CategoryPage have skeleton loaders |
| Offline/error state UI | ❌ No visual feedback on API failure — just `console.error` |

Key pages:
- **Home.jsx**: try/catch in `loadProducts()`, skeleton during loading, but no error UI
- **CategoryPage.jsx**: try/catch with fallback fetch, skeleton loading, "No items found" empty state
- **AdminCategories.jsx**: skeleton loading, try/catch on all CRUD

**Missing**: A global `ErrorBoundary` component and user-visible error messages when API fails.

---

## Summary Table

| # | Question | Status |
|---|---|---|
| 1 | Category.js model exists | ✅ EXISTS |
| 2 | categories.js routes exist | ✅ EXISTS (5 endpoints) |
| 3 | /api/categories mounted | ✅ DONE |
| 4 | ProductFormModal category from API | ✅ DONE |
| 5 | MainCategoryCards from API | ✅ DONE |
| 6 | CategoryPage fetches from API | ✅ DONE |
| 7 | Admin Categories tab | ✅ DONE |
| 8 | AdminCategories.jsx exists | ✅ EXISTS |
| 9 | AdminOrders cards + Accept/Reject | ✅ DONE |
| 10 | AdminMenu category filter | ❌ NOT DONE |
| 11 | "100% Eggless" banner | PARTIAL (hardcoded) |
| 12 | Delivery badges | PARTIAL (hardcoded) |
| 13 | Quick Picks section | PARTIAL (from DB but SubCategoryRow hardcoded) |
| 14 | Live search on homepage | ✅ DONE |
| 15 | Subcategory filter chips | ✅ DONE (dynamic) |
| 16 | Sort option on CategoryPage | ❌ NOT DONE |
| 17 | Orders badge on BottomNav | ❌ NOT DONE |
| 18 | Cart count badge in Header | ✅ DONE |
| 19 | Migration script exists | ✅ EXISTS (ran successfully) |
| 20 | Product.category = ObjectId ref | ✅ DONE |
| 21 | Category documents in MongoDB | ✅ DONE (9 docs) |
| 22 | Razorpay mode | ✅ Via env vars |
| 23 | Hardcoded secrets | ✅ CLEAN |
| 24 | API base URL config | PARTIAL (in api.js, not vite proxy) |
| 25 | Error boundaries / fallback UI | PARTIAL (try/catch yes, ErrorBoundary no) |

**Score: 16 ✅ DONE / 5 PARTIAL / 4 ❌ NOT DONE**