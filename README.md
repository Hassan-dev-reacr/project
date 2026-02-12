# EcomStore - Product Dashboard

A modern, full-featured ecommerce store application built with Next.js 15+, React, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed on your machine
- **npm** or **yarn** package manager

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

The application should now be running without any build errors!

## ✨ Features

### Product Listing
- ✅ **Pagination**: 10 products per page with page number navigation
- ✅ **Search with Debouncing**: Real-time search with 300ms debounce for performance
- ✅ **Category Filter**: Dropdown to filter by product category
- ✅ **Date Range Filter**: Interactive calendar for filtering by date
- ✅ **URL Query Parameters**: All filter states persist in URL for sharing
- ✅ **Loading States**: Skeleton screens during data fetching
- ✅ **Error Handling**: Graceful error messages
- ✅ **Edge Cases**: Handles empty states, no matches, and invalid filters

### Date Range Calendar Filter
- 📅 **Interactive Calendar**: Custom-styled date picker with dual month view
- 🎨 **Indigo Theme**: Selected dates highlighted with indigo background (#6366f1)
- 💡 **Hover Preview**: Shows formatted date when hovering over calendar dates
- 🌓 **Theme Support**: Works seamlessly in both light and dark modes
- ✨ **Smooth Animations**: Polished transitions for interactions

### Bonus Features Implemented
- ⚡ **Debounced Search**: 300ms delay prevents excessive filtering
- 🔗 **URL State Persistence**: Share filtered results via URL
- 🎬 **Enhanced Animations**: Staggered fade-ins, hover effects, smooth transitions

### Product Details
- 🖼️ **Image Gallery**: Multiple product images with thumbnail navigation
- 📊 **Complete Info**: Price, rating, stock, brand, category, and date added
- ❤️ **Favorites Toggle**: Add/remove from favorites on detail page

### Favorites System
- ❤️ **Persistent Storage**: Favorites saved in localStorage
- 🔢 **Counter Badge**: Shows favorite count in header
- 👁️ **Visual Indicators**: Heart icon filled for favorited products

### Theme Toggle
- 🌓 **Light/Dark Mode**: Smooth theme switching
- 💾 **Persistence**: Theme preference saved to localStorage
- 🔄 **System Sync**: Respects system theme preference

## 🛠️ Technologies & Libraries

### Core Framework
- **Next.js 15+** (App Router) - React framework with server/client components
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, consistent icon set

### State & Data
- **React Hooks** - useState, useEffect for local state management
- **localStorage** - Client-side persistence for favorites and theme

### Date Handling
- **date-fns** - Modern date utility library
- **react-day-picker** - Flexible date picker component

### API
- **DummyJSON API** - Mock ecommerce data (https://dummyjson.com)

## 📁 Project Structure

```
project/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Product listing page (client component)
│   ├── globals.css             # Global styles and CSS variables
│   └── products/
│       └── [id]/
│           └── page.tsx        # Dynamic product detail page
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── calendar.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   ├── date-range-picker.tsx   # Custom calendar date range component
│   ├── header.tsx              # App header with logo and nav
│   ├── product-card.tsx        # Product card component
│   ├── theme-provider.tsx      # Theme context provider
│   └── theme-toggle.tsx        # Theme switcher button
├── lib/
│   ├── api.ts                  # API functions and date generation
│   ├── favorites.ts            # Favorites management utilities
│   └── utils.ts                # Utility functions (cn helper)
├── types/
│   └── product.ts              # TypeScript type definitions
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── components.json             # shadcn/ui configuration
└── README.md                   # This file
```

## 🎯 Key Implementation Details

### 1. Date Filtering Feature

**Challenge:** The DummyJSON API doesn't provide date fields for products.

**Solution:**
- **Deterministic Date Generation**: Each product gets a date based on its ID using a seeded algorithm
  ```typescript
  export function generateProductDate(productId: number): string {
    const now = new Date('2026-02-12');
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const timeRange = now.getTime() - sixMonthsAgo.getTime();
    const seed = productId * 123456789 % 100;
    const randomTime = (seed / 100) * timeRange;
    
    return new Date(sixMonthsAgo.getTime() + randomTime).toISOString();
  }
  ```
- **Consistency**: Same product ID always generates the same date across page refreshes
- **Distribution**: Dates spread evenly across the last 6 months
- **Client-side Filtering**: After fetching all products, filter by date range in browser

**Calendar Implementation:**
- Built custom `DateRangePicker` component using shadcn/ui Calendar
- Uses `react-day-picker` with custom styling via Tailwind classes
- Hover state shows formatted date preview using `date-fns` format function
- Selected dates styled with indigo background for consistency with brand

### 2. Filtering Strategy & Performance

**Approach:** Fetch all products once, filter client-side with optimizations

**Reasons:**
- API doesn't support date filtering
- Better UX - instant filter updates without network requests
- Pagination works correctly with filtered results
- Total product count accurately reflects filters

**Performance Optimizations:**
- **Caching**: Products fetched once and stored in state (acts as cache)
- **Debounced Search**: 300ms delay prevents excessive re-filtering while typing
- **Efficient Filtering**: Single-pass filtering for all criteria
- **Memoization**: Filter logic only runs when dependencies change

**Implementation:**
```typescript
// Products cached in state after initial fetch
const [allProducts, setAllProducts] = useState<Product[]>([]);

// Debounced search for performance
const debouncedSearch = useDebounce(searchQuery, 300);

// Efficient client-side filtering
useEffect(() => {
  let filtered = [...allProducts];
  
  if (debouncedSearch) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }
  
  if (dateRange?.from) {
    filtered = filtered.filter(product => {
      const productDate = new Date(product.dateAdded);
      return productDate >= dateRange.from && productDate <= dateRange.to;
    });
  }
  
  setFilteredProducts(filtered);
}, [debouncedSearch, selectedCategory, dateRange, allProducts]);
```

### 3. Pagination Logic

- **10 products per page** (configurable via `PRODUCTS_PER_PAGE` constant)
- Works on filtered results, not total dataset
- Page numbers dynamically adjust based on total filtered products
- Active page highlighted with indigo background
- Smart page number display (shows max 5 page buttons)

### 4. Favorites System

**Implementation:**
- Uses browser's `localStorage` for persistence
- Custom event system (`favorites-changed`) for cross-component updates
- Functions: `getFavorites()`, `addFavorite()`, `removeFavorite()`, `toggleFavorite()`
- Counter badge in header updates in real-time
- Visual heart icon on product cards shows favorite status

### 5. Theme System

**Technology:** `next-themes` package

**Features:**
- No flash of unstyled content (FOUC)
- Respects system preferences
- Manual toggle between light/dark modes
- Persists selection to localStorage
- Applied via `ThemeProvider` in root layout

## 🎨 Design Decisions & Assumptions

### Assumptions Made

1. **Date Field Requirement**: Since DummyJSON doesn't provide dates, I assumed generating consistent client-side dates was acceptable
2. **Pagination Count**: Assumed 10 products per page was a good UX balance
3. **Indigo Theme**: Used indigo (#6366f1) as the primary accent color per requirements
4. **All Products Loading**: Assumed total product count (~200) is small enough to fetch all at once
5. **Image Hosting**: Configured Next.js to accept images from `cdn.dummyjson.com`

### Design Decisions

1. **Client-side Filtering**: Chose client-side over server-side for instant feedback and better UX
2. **Component Library**: Selected shadcn/ui for high-quality, customizable components
3. **Type Safety**: Full TypeScript implementation for better DX and fewer runtime errors
4. **Responsive Grid**: 1-2-3-4 column grid (mobile to desktop) for optimal viewing
5. **Loading States**: Skeleton screens instead of spinners for perceived performance
6. **Error Handling**: Graceful error messages with retry options
7. **Debounced Search**: 300ms delay for optimal balance between responsiveness and performance
8. **URL State Management**: Router.replace() used to avoid polluting browser history

### Edge Cases Handled

1. **No Search Results**: Displays "No products found" message with suggestion to adjust filters
2. **Empty Date Range**: Calendar allows clearing date filter to show all products
3. **Invalid Category**: Falls back to "All Categories" if URL parameter is invalid
4. **Multiple Simultaneous Filters**: All filters work together seamlessly with proper state management
5. **Page Beyond Results**: Automatically resets to page 1 when filters reduce total products
6. **Network Errors**: Shows error state with clear message and maintains UI stability
7. **Loading States**: Skeleton screens prevent layout shift during data fetch

### shadcn/ui Component Usage

The project leverages shadcn/ui extensively for consistent, accessible components:

- **Calendar**: Core date picker component from shadcn/ui registry
- **Popover**: Used to display calendar in a floating panel
- **Button**: All interactive buttons with variants (default, outline, ghost)
- **Card**: Product card structure with Header, Content, Footer sections
- **Input**: Search input with consistent styling
- **Select**: Category dropdown with proper accessibility
- **Badge**: Category tags and discount labels
- **Skeleton**: Loading state placeholders
- **Switch**: Used in theme toggle component

Each component was carefully selected from the shadcn/ui documentation and customized with:
- Indigo accent color for selected states
- Smooth transitions and hover effects
- Dark mode support via CSS variables
- Accessible ARIA labels and keyboard navigation

## 📦 Available Scripts

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Create optimized production build
npm start        # Start production server (requires build first)
npm run lint     # Run ESLint for code quality checks
```

## 🌐 API Reference

This project uses the [DummyJSON API](https://dummyjson.com/docs/products):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products?limit=0` | GET | Fetch all products |
| `/products/{id}` | GET | Fetch single product |
| `/products/categories` | GET | Get all categories |
| `/products/category/{category}` | GET | Filter by category |
| `/products/search?q={query}` | GET | Search products |

## ⚡ Performance Optimizations

- **Next.js Image**: Automatic image optimization with `next/image`
- **Client Components**: Strategic use of 'use client' for interactivity
- **CSS-in-JS**: Zero runtime CSS with Tailwind
- **Lazy Loading**: Images load on-demand
- **Memoization**: Expensive calculations cached
- **Efficient Re-renders**: Proper React hooks usage to minimize updates

## 📱 Responsive Design

The application is fully responsive across all devices:

- **Mobile** (< 640px): Single column layout, stacked filters
- **Tablet** (640px - 1024px): 2-3 column grid, side-by-side filters
- **Desktop** (> 1024px): 4 column grid, horizontal filter layout

## ♿ Accessibility Features

- ✅ Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`)
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support (Tab, Enter, Arrow keys)
- ✅ Focus indicators on all interactive elements
- ✅ Color contrast ratios meet WCAG AA standards
- ✅ Screen reader friendly (tested with NVDA)

## � Deployment

### Deploy to Vercel (Recommended - One Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ecomstore)

### Manual Deployment

**Prerequisites:**
1. Push code to GitHub repository
2. Create account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

**Steps for Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Steps for Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

**Live Demo:** 
-https://project-eqwazksd5-hassans-projects-55b38d59.vercel.app

## �🐛 Troubleshooting

### Common Issues

**Issue: Images not loading**
- Solution: Ensure `next.config.ts` includes `cdn.dummyjson.com` in image domains

**Issue: CSP errors in console**
- Solution: Development mode requires `unsafe-eval` for hot reloading (already configured)

**Issue: Favorites not persisting**
- Solution: Check browser localStorage is enabled and not in incognito mode

**Issue: Build errors**
- Solution: Delete `.next` folder and `node_modules`, then reinstall: `npm install`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy (auto-detects Next.js)

### Other Platforms

```bash
npm run build
npm start
```

Ensure Node.js 18+ is available on the server.

## 📝 License

MIT

## 👨‍💻 Author

Hassan Raza Jamil

---

**Note:** This project uses mock data from DummyJSON API. In a production environment, you would connect to a real backend API with proper authentication, error handling, and data validation.
