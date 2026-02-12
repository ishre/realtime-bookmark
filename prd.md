# Smart Bookmark Manager - Product Requirements Document (PRD)

## Project Overview

A modern, elegant bookmark management application that allows users to save, organize, and search their favorite web resources. The app features real-time synchronization across devices, Google OAuth authentication, and a sophisticated dark-themed interface.

---

## 1. Core Requirements

### 1.1 Authentication
- **Google OAuth Only**: No email/password authentication
- Single Sign-On (SSO) flow using Supabase Auth
- Persistent login sessions with automatic token refresh
- Secure logout functionality
- User profile display (name, avatar from Google)

### 1.2 Bookmark Management
- **Add Bookmark**: 
  - URL (required, with validation)
  - Title (required)
  - Description (optional, auto-generated from URL metadata)
  - Automatic favicon fetching
  - Tags for categorization
  - Created timestamp (auto-generated)
  
- **Delete Bookmark**:
  - Soft delete with confirmation dialog
  - Optimistic UI updates
  - Undo functionality (5-second window)

- **View Bookmarks**:
  - Card-based grid layout (responsive)
  - Rich preview cards with favicon, title, description, tags
  - View count tracking
  - Last accessed timestamp
  - Date added indicator

### 1.3 Privacy & Security
- **Row Level Security (RLS)**: User A cannot access User B's bookmarks
- Supabase RLS policies enforcing user_id filtering
- Secure API routes with session validation
- HTTPS-only in production

### 1.4 Real-Time Synchronization
- **Supabase Realtime** for instant updates across tabs/devices
- Live updates when:
  - New bookmark added
  - Bookmark deleted
  - Bookmark updated
- WebSocket connection management with auto-reconnect
- Optimistic UI updates with rollback on failure

---

## 2. Advanced Features

### 2.1 Search & Filter System
**Multi-dimensional search** supporting:
- **Title search**: Fuzzy matching, case-insensitive
- **URL search**: Domain and path matching
- **Description search**: Full-text search
- **Tag search**: Click tag to filter, multiple tag support (AND/OR logic)
- **Date range search**: Added this week/month/year, custom date range
- **Sort options**:
  - Recently added (default)
  - Alphabetical (A-Z, Z-A)
  - Most visited
  - Oldest first
  - By domain

**Search Implementation**:
```typescript
// Client-side instant search (debounced 300ms)
// Server-side for complex queries using Supabase full-text search
```

### 2.2 Tag System
- **Auto-suggestion**: Tags based on URL domain and content
- **Tag management**: Create, rename, delete tags
- **Tag colors**: Auto-assigned from predefined palette
- **Tag filtering**: Sidebar with tag counts
- **Popular tags**: Show most-used tags

### 2.3 Collections/Categories
- **Archived bookmarks**: Separate view for archived items
- **Favorites**: Star important bookmarks
- **Collections**: Group bookmarks into custom collections

---

## 3. Technical Stack

### 3.1 Frontend
- **Next.js 14+** (App Router)
  - React Server Components for initial data fetching
  - Client Components for interactivity
  - Server Actions for mutations
- **TypeScript** (strict mode)
- **Tailwind CSS** for utility styling
- **shadcn/ui** for component library
- **Aceternity UI** for premium animations and effects
- **Framer Motion** for advanced animations

### 3.2 Backend & Database
- **Supabase**:
  - PostgreSQL database
  - Auth (Google OAuth)
  - Realtime subscriptions
  - Row Level Security
  - Edge Functions (if needed)

### 3.3 Deployment
- **Vercel** (production deployment)
- **Environment variables** managed via Vercel dashboard
- **Domain**: Custom or Vercel subdomain

---

## 4. Design System & UI/UX

### 4.1 Design Philosophy
**Aesthetic Direction**: **Modern Luxury Dark** with elegant sophistication

**Key Characteristics**:
- **Dark theme by default** with theme toggle (dark/light)
- Rich, deep backgrounds (not pure black)
- Sophisticated color palette with metallic accents
- Fluid animations and micro-interactions
- Generous spacing and breathing room
- Typography-first approach

### 4.2 Typography
**Font Choices** (distinctive, avoiding generic):
- **Display/Headings**: `Inter Tight` or `Geist` (geometric, modern)
- **Body Text**: `Inter` with optimized line-height
- **Monospace** (for URLs): `JetBrains Mono` or `Fira Code`

**Font Hierarchy**:
```css
h1: 2.5rem (40px), font-weight: 700, letter-spacing: -0.02em
h2: 2rem (32px), font-weight: 600
h3: 1.5rem (24px), font-weight: 600
body: 1rem (16px), font-weight: 400, line-height: 1.6
small: 0.875rem (14px), font-weight: 400
```

### 4.3 Color Palette

**Dark Theme** (Primary):
```css
--background: 0 0% 3.9%          /* #0a0a0a - Deep charcoal */
--foreground: 0 0% 98%           /* #fafafa - Off-white */
--card: 0 0% 8%                  /* #141414 - Elevated surface */
--card-hover: 0 0% 12%           /* #1f1f1f - Hover state */
--primary: 210 100% 60%          /* #3b82f6 - Vibrant blue */
--primary-foreground: 0 0% 100%  /* White text on primary */
--accent: 280 70% 60%            /* #a855f7 - Purple accent */
--muted: 0 0% 20%                /* #333333 - Muted elements */
--border: 0 0% 15%               /* #262626 - Subtle borders */
--destructive: 0 84% 60%         /* #ef4444 - Red for delete */
--success: 142 76% 36%           /* #10b981 - Green for success */
```

**Light Theme** (Secondary):
```css
--background: 0 0% 100%          /* White */
--foreground: 0 0% 3.9%          /* Dark text */
--card: 0 0% 98%                 /* Light gray cards */
--card-hover: 0 0% 96%           /* Hover state */
--primary: 210 100% 50%          /* Blue */
--accent: 280 70% 55%            /* Purple */
--muted: 0 0% 85%                /* Light muted */
--border: 0 0% 90%               /* Light borders */
```

### 4.4 Component Design

#### Bookmark Card
```
┌─────────────────────────────────────┐
│ [Favicon]  Title of Bookmark    [⋮] │
│           domain.com                │
│                                     │
│ Short description of the bookmark  │
│ that provides context about...     │
│                                     │
│ [Tag1] [Tag2] [Tag3]               │
│                                     │
│ 👁 23 views  •  📅 2 days ago      │
└─────────────────────────────────────┘
```

**Design Specs**:
- Card background: `--card` with subtle gradient overlay
- Border: 1px solid `--border` with glow on hover
- Border radius: 12px (rounded-xl)
- Padding: 20px
- Hover: Lift effect with shadow (translateY(-2px))
- Transition: 200ms ease-out

#### Search Bar
```
┌──────────────────────────────────────────────┐
│ 🔍  Search by title, URL, tags...       [×]  │
└──────────────────────────────────────────────┘
```

**Design Specs**:
- Full-width on mobile, max-w-2xl on desktop
- Height: 48px
- Background: `--card` with subtle inner shadow
- Focus: Ring effect with primary color
- Icons: 20px, muted color
- Real-time search (debounced 300ms)

#### Navigation Sidebar
```
┌─────────────────┐
│ 📚 Bookmark Mgr │
│                 │
│ 🏠 Home         │
│ 📦 Archived     │
│                 │
│ TAGS            │
│ ☐ AI          1 │
│ ☐ Community   5 │
│ ☐ CSS         6 │
│ ☐ Design      1 │
│ ...             │
└─────────────────┘
```

**Design Specs**:
- Width: 260px on desktop, collapsible drawer on mobile
- Background: `--background` with border-right
- Active state: Primary color accent + background highlight
- Scrollable tags section with custom scrollbar

### 4.5 Animations & Micro-interactions

**Using Aceternity UI Components**:
1. **Background Beams**: Subtle animated beams in header/hero section
2. **Spotlight Effect**: Mouse-follow spotlight on bookmark cards
3. **3D Card Effect**: Tilt effect on bookmark cards on hover
4. **Particles**: Floating particles in background (subtle, dark mode)
5. **Text Generate Effect**: Animate in headings on page load
6. **Meteors**: Decorative meteors in empty states

**Framer Motion Animations**:
```typescript
// Stagger children animation for bookmark grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

**Key Interactions**:
- **Add bookmark**: Slide-in modal with backdrop blur
- **Delete**: Shake animation → fade out → slide up remaining cards
- **Tag click**: Pulse animation + filter apply
- **Search**: Loading skeleton while fetching
- **Empty state**: Gentle bounce animation for CTA

### 4.6 Responsive Design

**Breakpoints**:
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl, 2xl)

**Layout Adjustments**:
- Mobile: Single column, bottom nav, search slides in
- Tablet: 2 columns, sidebar collapsible
- Desktop: 3 columns, persistent sidebar

---

## 5. Database Schema

### 5.1 Tables

#### `bookmarks`
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  favicon_url TEXT,
  domain TEXT GENERATED ALWAYS AS (
    regexp_replace(url, '^https?://([^/]+).*', '\1')
  ) STORED,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX idx_bookmarks_tags ON bookmarks USING GIN(tags);
CREATE INDEX idx_bookmarks_search ON bookmarks USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookmarks_updated_at
  BEFORE UPDATE ON bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### `user_preferences`
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(10) DEFAULT 'dark', -- 'dark' or 'light'
  default_view VARCHAR(20) DEFAULT 'grid', -- 'grid' or 'list'
  sort_by VARCHAR(20) DEFAULT 'created_at_desc',
  tags_sidebar_expanded BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
```

---

## 6. File Structure

```
smart-bookmark-manager/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # Login page with Google OAuth
│   │   └── callback/
│   │       └── route.ts               # OAuth callback handler
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Dashboard layout with sidebar
│   │   ├── page.tsx                   # Home page (all bookmarks)
│   │   ├── archived/
│   │   │   └── page.tsx               # Archived bookmarks
│   │   └── favorites/
│   │       └── page.tsx               # Favorite bookmarks
│   ├── api/
│   │   ├── bookmarks/
│   │   │   ├── route.ts               # GET, POST bookmarks
│   │   │   └── [id]/
│   │   │       └── route.ts           # PATCH, DELETE bookmark
│   │   └── metadata/
│   │       └── route.ts               # Fetch URL metadata
│   ├── layout.tsx                     # Root layout
│   ├── globals.css                    # Global styles + Tailwind
│   └── providers.tsx                  # Theme provider, etc.
├── components/
│   ├── ui/                            # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── aceternity/                    # Aceternity UI components
│   │   ├── background-beams.tsx
│   │   ├── 3d-card.tsx
│   │   ├── spotlight.tsx
│   │   └── ...
│   ├── bookmark-card.tsx              # Main bookmark card component
│   ├── bookmark-grid.tsx              # Grid layout with animations
│   ├── add-bookmark-dialog.tsx        # Add bookmark modal
│   ├── delete-confirmation.tsx        # Delete confirmation dialog
│   ├── search-bar.tsx                 # Advanced search component
│   ├── sidebar.tsx                    # Navigation sidebar
│   ├── tag-filter.tsx                 # Tag filtering sidebar
│   ├── theme-toggle.tsx               # Dark/light mode toggle
│   ├── empty-state.tsx                # Empty state illustrations
│   └── user-menu.tsx                  # User profile dropdown
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Supabase client (browser)
│   │   ├── server.ts                  # Supabase client (server)
│   │   └── middleware.ts              # Auth middleware
│   ├── hooks/
│   │   ├── use-bookmarks.ts           # Bookmark CRUD + realtime
│   │   ├── use-search.ts              # Search logic
│   │   ├── use-theme.ts               # Theme management
│   │   └── use-tags.ts                # Tag management
│   ├── utils/
│   │   ├── cn.ts                      # Tailwind class merge
│   │   ├── metadata-fetcher.ts        # Fetch URL metadata
│   │   ├── url-validator.ts           # URL validation
│   │   └── date-formatter.ts          # Date formatting utilities
│   └── types/
│       └── database.types.ts          # TypeScript types from Supabase
├── public/
│   ├── fonts/                         # Custom fonts
│   └── icons/                         # Icons and assets
├── .env.local                         # Environment variables
├── .env.example                       # Example env file
├── middleware.ts                      # Next.js middleware for auth
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
├── next.config.js                     # Next.js configuration
├── package.json
└── README.md                          # Project documentation
```

---

## 7. Implementation Guide

### 7.1 Phase 1: Setup & Authentication (Day 1)
1. Initialize Next.js project with TypeScript and Tailwind
2. Install dependencies: Supabase, shadcn/ui, Framer Motion
3. Set up Supabase project and Google OAuth
4. Implement login/logout flow
5. Set up middleware for protected routes
6. Create basic layout with theme toggle

### 7.2 Phase 2: Core Features (Day 2-3)
1. Create database schema with RLS policies
2. Implement bookmark CRUD operations
3. Build bookmark card component with animations
4. Add bookmark form with URL validation and metadata fetching
5. Implement delete with confirmation
6. Set up Supabase Realtime subscriptions

### 7.3 Phase 3: Advanced Features (Day 4)
1. Build advanced search with multiple filters
2. Implement tag system with auto-suggestions
3. Create sidebar with tag filtering
4. Add sort functionality
5. Build empty states and loading skeletons

### 7.4 Phase 4: Polish & Deploy (Day 5)
1. Integrate Aceternity UI components
2. Refine animations and micro-interactions
3. Optimize performance (lazy loading, debouncing)
4. Test across devices and browsers
5. Deploy to Vercel
6. Set up environment variables in Vercel
7. Test production build
8. Write comprehensive README

---

## 8. Key Implementation Details

### 8.1 Realtime Subscription Hook
```typescript
// lib/hooks/use-bookmarks.ts
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/types/database.types';

type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    // Fetch initial bookmarks
    async function fetchBookmarks() {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setBookmarks(data);
      setLoading(false);
    }

    fetchBookmarks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          }
          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => 
              prev.filter((b) => b.id !== payload.old.id)
            );
          }
          if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => 
                b.id === payload.new.id ? (payload.new as Bookmark) : b
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bookmarks, loading };
}
```

### 8.2 Advanced Search Implementation
```typescript
// lib/hooks/use-search.ts
import { useMemo, useState } from 'react';
import { debounce } from 'lodash';

export function useSearch(bookmarks: Bookmark[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('created_at_desc');

  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  const filteredBookmarks = useMemo(() => {
    let results = bookmarks;

    // Filter by search query (title, URL, description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      results = results.filter((b) =>
        selectedTags.every((tag) => b.tags.includes(tag))
      );
    }

    // Sort
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'most_visited':
          return (b.view_count || 0) - (a.view_count || 0);
        default:
          return 0;
      }
    });

    return results;
  }, [bookmarks, searchQuery, selectedTags, sortBy]);

  return {
    filteredBookmarks,
    searchQuery,
    setSearchQuery: debouncedSearch,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy
  };
}
```

### 8.3 Metadata Fetching
```typescript
// app/api/metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      'Untitled';

    const description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    const favicon = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      `${new URL(url).origin}/favicon.ico`;

    return NextResponse.json({
      title,
      description,
      favicon: new URL(favicon, url).href
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
```

---

## 9. Performance Optimizations

### 9.1 Client-Side Optimizations
- **Lazy loading**: Use `next/dynamic` for heavy components
- **Image optimization**: Use `next/image` for favicons
- **Debouncing**: Search input (300ms)
- **Pagination**: Implement virtual scrolling for 100+ bookmarks
- **Memoization**: Use `useMemo` and `useCallback` appropriately

### 9.2 Server-Side Optimizations
- **Database indexes**: On user_id, created_at, tags
- **Query optimization**: Select only needed fields
- **Caching**: Use Vercel Edge caching for static assets
- **CDN**: Serve fonts and images from CDN

---

## 10. Testing Strategy

### 10.1 Manual Testing Checklist
- [ ] Google OAuth login works
- [ ] User can add bookmark with valid URL
- [ ] Invalid URL shows error message
- [ ] Bookmark appears immediately after adding
- [ ] Opening two tabs shows realtime sync
- [ ] Delete bookmark with confirmation
- [ ] Search by title works
- [ ] Search by URL works
- [ ] Tag filtering works
- [ ] Sort options work correctly
- [ ] Theme toggle switches dark/light
- [ ] Responsive design on mobile
- [ ] Keyboard navigation works
- [ ] Empty states display correctly

### 10.2 Edge Cases
- [ ] Very long URLs are truncated properly
- [ ] Bookmarks without description display correctly
- [ ] Failed favicon fetch shows fallback icon
- [ ] Network errors are handled gracefully
- [ ] Session expiration redirects to login
- [ ] Concurrent edits handled correctly

---

## 11. Deployment Checklist

### 11.1 Pre-Deployment
- [ ] Environment variables set in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server-side)
- [ ] Google OAuth redirect URLs configured:
  - `https://yourdomain.com/auth/callback`
  - `http://localhost:3000/auth/callback` (dev)
- [ ] Database migrations applied
- [ ] RLS policies enabled and tested
- [ ] Build succeeds locally (`npm run build`)

### 11.2 Post-Deployment
- [ ] Test login with Google account
- [ ] Test all CRUD operations
- [ ] Test realtime sync between devices
- [ ] Check mobile responsiveness
- [ ] Verify theme toggle works
- [ ] Test search and filters
- [ ] Monitor error logs in Vercel

---

## 12. README Template

The README.md should include:

### Structure
```markdown
# Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js and Supabase.

## Features
- 🔐 Google OAuth authentication
- 📚 Save and organize bookmarks
- 🔍 Advanced search and filtering
- 🏷️ Tag-based organization
- ⚡ Real-time synchronization
- 🎨 Dark/light theme toggle
- 📱 Fully responsive design

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Auth, Database, Realtime)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Aceternity UI
- Framer Motion

## Live Demo
[https://your-app.vercel.app](https://your-app.vercel.app)

## Setup Instructions
[Detailed setup steps...]

## Problems & Solutions

### Problem 1: Realtime not working across tabs
**Issue**: Bookmarks added in one tab didn't appear in another tab immediately.

**Solution**: 
1. Enabled Realtime replication for bookmarks table in Supabase dashboard
2. Added proper cleanup in useEffect to prevent memory leaks
3. Used channel-based subscriptions instead of table-level

### Problem 2: Google OAuth redirect failing in production
**Issue**: After Google login, redirect to callback URL was failing.

**Solution**:
1. Added production URL to Google Cloud Console authorized redirect URIs
2. Updated Supabase Auth settings with correct site URL
3. Ensured middleware.ts handles auth callback route correctly

### Problem 3: Search performance degrading with many bookmarks
**Issue**: Client-side filtering became slow with 500+ bookmarks.

**Solution**:
1. Implemented server-side search using Supabase full-text search
2. Added GIN index on title and description columns
3. Used debounced search input (300ms) to reduce query frequency

[Continue with more problems and solutions...]

## Future Enhancements
- Browser extension for one-click bookmarking
- Import/export bookmarks
- Shared collections with other users
- AI-powered tag suggestions
- Screenshot capture of bookmarked pages

## License
MIT
```

---

## 13. Design Assets & Resources

### 13.1 Icon Library
- Use **Lucide React** for consistent icons
- Favicon size: 16x16px, 32x32px
- Loading spinner: Custom SVG with brand colors

### 13.2 Empty States
Create custom illustrations for:
- No bookmarks yet (encourage first bookmark)
- No search results (suggest different keywords)
- No tags (explain how to add tags)

### 13.3 Custom Cursor (Desktop Only)
```css
.bookmark-card {
  cursor: url('/cursors/pointer.svg'), pointer;
}
```

---

## 14. Accessibility (a11y)

- **Keyboard Navigation**: Tab through all interactive elements
- **ARIA Labels**: Meaningful labels for screen readers
- **Color Contrast**: WCAG AA compliance (4.5:1 for text)
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Alt Text**: Descriptive alt text for images
- **Skip Links**: "Skip to main content" link

---

## 15. Analytics & Monitoring (Optional)

If time permits:
- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Sentry integration
- **User Analytics**: PostHog or Plausible (privacy-friendly)

---

## 16. Success Metrics

The project is successful if:
1. ✅ User can log in with Google account
2. ✅ User can add, view, and delete bookmarks
3. ✅ Real-time sync works across multiple tabs
4. ✅ Privacy is enforced (users can't see others' bookmarks)
5. ✅ Search finds bookmarks by title, URL, and tags
6. ✅ UI is polished, elegant, and doesn't look AI-generated
7. ✅ App is deployed and accessible via public URL
8. ✅ README documents problems and solutions clearly

---

## 17. Anti-AI Checklist (Making it Look Human-Designed)

To avoid "AI slop" aesthetics:

### Typography
- ✅ Use distinctive fonts (NOT Inter, Roboto, Arial)
- ✅ Custom font pairing (display + body)
- ✅ Proper font weights and letter-spacing
- ❌ Avoid system fonts

### Colors
- ✅ Custom color palette with semantic naming
- ✅ Avoid purple gradients on white
- ✅ Use CSS variables for consistency
- ❌ Avoid default Tailwind colors without customization

### Layout
- ✅ Asymmetric compositions where appropriate
- ✅ Intentional negative space
- ✅ Break-grid moments for visual interest
- ❌ Avoid perfectly centered, evenly-spaced layouts

### Motion
- ✅ Custom easing curves (not default ease-in-out)
- ✅ Staggered animations with intentional delays
- ✅ Micro-interactions on hover/focus
- ❌ Avoid generic fade-in animations

### Details
- ✅ Custom scrollbar styling
- ✅ Subtle textures or noise overlays
- ✅ Gradient meshes in backgrounds
- ✅ Unique card hover effects (3D tilt, glow, etc.)
- ❌ Avoid flat, lifeless cards

---

## 18. Known Limitations & Trade-offs

1. **No offline support**: Requires internet connection
2. **Google OAuth only**: No email/password fallback
3. **Client-side search**: May be slow with 1000+ bookmarks
4. **No bookmark sharing**: Strictly private to each user
5. **No import/export**: Feature for future iteration

---

## Final Notes

This PRD is a living document. As you build, you may discover better approaches or need to make trade-offs. Document all decisions and challenges in the README.

**Remember**: The goal is to create a polished, production-ready app that doesn't feel like it was churned out by AI. Focus on:
- Intentional design decisions
- Smooth animations
- Delightful micro-interactions
- Clear, helpful error messages
- Fast, responsive performance

Good luck! 🚀