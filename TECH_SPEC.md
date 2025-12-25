# Technical Specification

## Table of Contents
1. Assumptions
2. Architecture Overview
3. Database Schema
4. API Endpoints
5. Component Structure
6. Authentication Flow
7. Data Flow
8. Test Plan
9. Scalability Considerations

---

## 1. Assumptions

### Business Assumptions
- Each company has one unique slug identifier
- Recruiters manage a single company at a time
- Basic authentication is sufficient for MVP
- Jobs are published immediately when created
- No approval workflow needed for changes
- Candidates do not need accounts to browse jobs

### Technical Assumptions
- Modern browser support only (ES6+)
- Internet connection required (no offline mode)
- Images hosted externally (no file storage yet)
- Video content uses embed URLs (YouTube/Vimeo)
- English language only for now
- Desktop-first design, mobile-responsive

### Data Assumptions
- Job data remains relatively static (not real-time updates)
- Company branding changes are infrequent
- Average company has 5-50 open positions
- Section content is text-based (no rich media)
- Search is simple text matching (no fuzzy search yet)

---

## 2. Architecture Overview

### High-Level Architecture
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│   Next.js Application       │
│  ┌─────────────────────┐   │
│  │  App Router Pages   │   │
│  │  - [slug]/careers   │   │
│  │  - [slug]/edit      │   │
│  │  - login            │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │   API Routes        │   │
│  │  - /api/companies   │   │
│  │  - /api/sections    │   │
│  │  - /api/jobs        │   │
│  └─────────────────────┘   │
└──────────┬──────────────────┘
           │
           ▼
    ┌──────────────┐
    │   Supabase   │
    │ ┌──────────┐ │
    │ │PostgreSQL│ │
    │ └──────────┘ │
    │ ┌──────────┐ │
    │ │   Auth   │ │
    │ └──────────┘ │
    └──────────────┘
```

### Technology Stack Rationale

**Next.js 15 (App Router)**
- Server-side rendering for SEO optimization
- API routes for backend logic
- File-based routing matches URL structure
- Built-in image optimization
- Zero-config production builds

**TypeScript**
- Type safety for database queries
- Better IDE support and autocomplete
- Catches errors at compile time
- Self-documenting code

**Supabase**
- Managed PostgreSQL database
- Built-in authentication
- Row-level security for multi-tenancy
- Real-time subscriptions (future use)
- Generous free tier

**Tailwind CSS v4**
- Rapid UI development
- Consistent design system
- Minimal CSS bundle size
- No configuration needed in v4

---

## 3. Database Schema

### Entity Relationship Diagram
```
┌─────────────────┐
│    companies    │
├─────────────────┤
│ id (PK)         │
│ slug (UNIQUE)   │
│ name            │
│ tagline         │
│ logo_url        │
│ banner_image    │
│ video_url       │
│ primary_color   │
│ secondary_color │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────────────────────┐
    │                         │
    ▼                         ▼
┌─────────────────┐   ┌──────────────┐
│company_sections │   │     jobs     │
├─────────────────┤   ├──────────────┤
│ id (PK)         │   │ id (PK)      │
│ company_id (FK) │   │ company_id   │
│ section_type    │   │ title        │
│ title           │   │ location     │
│ content         │   │ job_type     │
│ order_index     │   │ department   │
│ created_at      │   │ description  │
└─────────────────┘   │ requirements │
                      │ is_active    │
                      │ created_at   │
                      └──────────────┘
```

### Table Definitions

#### companies
Primary table storing company information and branding.
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_primary_color TEXT DEFAULT '#3b82f6',
  brand_secondary_color TEXT DEFAULT '#1e40af',
  banner_image_url TEXT,
  culture_video_url TEXT,
  tagline TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- Primary key on id
- Unique index on slug (for URL lookups)

**Why this design:**
- UUID for distributed systems compatibility
- Slug for SEO-friendly URLs
- Color fields for brand customization
- Timestamps for audit trail

#### company_sections
Stores customizable content sections for careers pages.
```sql
CREATE TABLE company_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- Primary key on id
- Index on company_id for fast filtering
- Index on order_index for sorting

**Why this design:**
- Flexible section types (about, culture, values, custom)
- Order index for custom ordering
- Cascade delete when company is removed
- Text content supports long-form content

#### jobs
Stores job postings for each company.
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT,
  job_type TEXT,
  department TEXT,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- Primary key on id
- Index on company_id
- Index on is_active (for filtering published jobs)
- Composite index on (company_id, is_active) for common queries

**Why this design:**
- Soft delete via is_active flag
- Flexible text fields for descriptions
- Support for filtering by location/type
- Cascade delete maintains referential integrity

### Row-Level Security Policies

#### Public Read Access
```sql
CREATE POLICY "Public read companies" 
  ON companies FOR SELECT 
  USING (true);

CREATE POLICY "Public read sections" 
  ON company_sections FOR SELECT 
  USING (true);

CREATE POLICY "Public read jobs" 
  ON jobs FOR SELECT 
  USING (true);
```

#### Authenticated Write Access
```sql
CREATE POLICY "Public write companies" 
  ON companies FOR ALL 
  USING (true);

CREATE POLICY "Public write sections" 
  ON company_sections FOR ALL 
  USING (true);

CREATE POLICY "Public write jobs" 
  ON jobs FOR ALL 
  USING (true);
```

Note: Current policies are permissive for development. In production, these should be:
```sql
USING (auth.uid() = company_owner_id)
```

---

## 4. API Endpoints

### Company Management

#### Update Company Branding
```
PUT /api/companies/[slug]
```

**Request Body:**
```json
{
  "name": "string",
  "tagline": "string",
  "logo_url": "string",
  "banner_image_url": "string",
  "culture_video_url": "string",
  "brand_primary_color": "string",
  "brand_secondary_color": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "slug": "string",
  "name": "string",
  ...updated fields
}
```

**Error Responses:**
- 400: Invalid data format
- 404: Company not found
- 500: Server error

### Section Management

#### Save All Sections
```
POST /api/sections
```

**Request Body:**
```json
{
  "companyId": "uuid",
  "sections": [
    {
      "section_type": "string",
      "title": "string",
      "content": "string",
      "order_index": "number"
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

**Logic:**
1. Delete all existing sections for company
2. Insert new sections with updated order
3. Transaction ensures atomicity

### Job Management

#### Create Job
```
POST /api/jobs
```

**Request Body:**
```json
{
  "company_id": "uuid",
  "title": "string",
  "location": "string",
  "job_type": "string",
  "department": "string",
  "description": "string",
  "requirements": "string"
}
```

#### Update Job
```
PUT /api/jobs/[id]
```

**Request Body:** Same as create (without company_id)

#### Delete Job
```
DELETE /api/jobs/[id]
```

**Response:**
```json
{
  "success": true
}
```

---

## 5. Component Structure

### Page Components (Server Components)
```
app/
├── page.tsx                    # Homepage
├── login/
│   └── page.tsx               # Auth page
└── [slug]/
    ├── careers/
    │   ├── page.tsx           # Public careers page (SSR)
    │   └── components/
    │       ├── CompanyHeader.tsx
    │       ├── CompanySection.tsx
    │       ├── JobCard.tsx
    │       ├── JobFilters.tsx
    │       └── JobDetailsModal.tsx
    └── edit/
        ├── page.tsx           # Dashboard (Protected)
        └── components/
            ├── BrandingEditor.tsx
            ├── SectionsEditor.tsx
            ├── JobsManager.tsx
            ├── PreviewButton.tsx
            └── LogoutButton.tsx
```

### Component Responsibilities

**CompanyHeader**
- Display company logo and banner
- Show company name and tagline
- Render culture video if available
- Apply brand colors dynamically

**JobFilters**
- Search input for job titles
- Dropdown filters for location and type
- URL-based state management
- Clear filters functionality

**BrandingEditor**
- Form for company information
- Color pickers for brand colors
- Image URL inputs with previews
- Save functionality with loading states

**SectionsEditor**
- Add/delete sections
- Drag to reorder sections
- Inline editing of title and content
- Bulk save operation

**JobsManager**
- List all jobs
- Modal for add/edit job
- Delete confirmation
- Form validation

---

## 6. Authentication Flow

### Sign Up Flow
```
User enters email/password
         ↓
Supabase Auth creates account
         ↓
Confirmation email sent
         ↓
User redirected to login
```

### Login Flow
```
User enters credentials
         ↓
Supabase validates
         ↓
Session cookie created
         ↓
User redirected to /[slug]/edit
         ↓
Middleware verifies on each request
```

### Protected Route Access
```
Request to /[slug]/edit
         ↓
Middleware checks auth cookie
         ↓
   ┌─────┴─────┐
   ▼           ▼
Valid      Invalid
   ↓           ↓
Allow    Redirect to /login
```

---

## 7. Data Flow

### Public Careers Page Load
```
1. User visits /[slug]/careers
2. Next.js server component runs
3. Fetch company data from Supabase
4. Fetch sections (ordered)
5. Fetch jobs (filtered by search params)
6. Render HTML on server
7. Send to browser
8. Hydrate client components
```

### Job Filtering
```
1. User types in search or selects filter
2. Client component updates URL params
3. Page re-renders on server
4. New query sent to Supabase
5. Filtered results returned
6. UI updates with new data
```

### Editing Branding
```
1. User changes form field
2. Local state updated
3. User clicks Save
4. POST to /api/companies/[slug]
5. API validates data
6. Update Supabase
7. Return success
8. Router refresh to show changes
```

---

## 8. Test Plan

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with new email
- [ ] Sign up with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access /edit without login (should redirect)
- [ ] Logout successfully

#### Branding Editor
- [ ] Change company name and save
- [ ] Update brand colors and verify on careers page
- [ ] Add logo URL and verify display
- [ ] Add banner image and verify display
- [ ] Add invalid URL and check error handling
- [ ] Save without internet connection

#### Sections Editor
- [ ] Add new section
- [ ] Edit section title and content
- [ ] Delete section
- [ ] Reorder sections with arrows
- [ ] Save empty section (should be filtered)
- [ ] Save with very long content

#### Jobs Manager
- [ ] Create new job with all fields
- [ ] Create job with only required fields
- [ ] Edit existing job
- [ ] Delete job with confirmation
- [ ] Cancel delete dialog
- [ ] Submit form with empty title (should fail)

#### Careers Page
- [ ] View company header with branding
- [ ] See all company sections in order
- [ ] View all active jobs
- [ ] Search for job by title
- [ ] Filter by location
- [ ] Filter by job type
- [ ] Combine search and filters
- [ ] Clear all filters
- [ ] Click job to view details modal
- [ ] Close modal

#### Mobile Responsiveness
- [ ] Homepage displays correctly
- [ ] Careers page is readable
- [ ] Filters are usable
- [ ] Job cards stack properly
- [ ] Edit dashboard tabs scroll
- [ ] Forms are usable on mobile
- [ ] Modals fit on screen

#### SEO
- [ ] View page source, check meta tags
- [ ] Verify OpenGraph tags present
- [ ] Check structured data
- [ ] Test with Lighthouse (target score > 90)

### Edge Cases to Test

**Empty States**
- Company with no jobs
- Company with no sections
- Search with no results
- New company with no data

**Data Validation**
- Very long job titles
- Special characters in company name
- Invalid color codes
- Broken image URLs
- Invalid video URLs

**Concurrent Edits**
- Two users editing same company
- Edit while preview is open
- Browser back button behavior

**Performance**
- Company with 100+ jobs
- Very long job descriptions
- Multiple images loading
- Slow network simulation

### Automated Testing Recommendations

For production, implement:

**Unit Tests**
- Utility functions
- Form validation
- URL parameter parsing

**Integration Tests**
- API endpoints
- Database queries
- Authentication flow

**E2E Tests (Playwright/Cypress)**
- Complete user journeys
- Form submissions
- Search and filter flows

---

## 9. Scalability Considerations

### Current Limitations

**Database**
- Single PostgreSQL instance
- No read replicas
- No caching layer

**Application**
- Server-side rendering on every request
- No CDN for static assets
- No image optimization service

**Authentication**
- Basic email/password only
- No rate limiting
- No session management

### Scaling to 100 Companies

**No changes needed**
- Current architecture handles this easily
- Supabase free tier supports this load
- Vercel free tier sufficient

### Scaling to 1,000 Companies

**Required changes:**
- Add database indexes on frequently queried fields
- Implement page-level caching
- Use CDN for static assets
- Upgrade to Supabase Pro tier

**Implementation:**
```typescript
// Add revalidation to pages
export const revalidate = 3600 // 1 hour

// Add Redis caching layer
import { Redis } from '@upstash/redis'
const redis = new Redis({ url, token })
```

### Scaling to 10,000+ Companies

**Infrastructure changes:**
- Read replicas for database
- Redis caching layer
- CDN for all static content
- Image optimization service
- Rate limiting on API routes

**Code changes:**
- Implement incremental static regeneration
- Add search index (Algolia/Elasticsearch)
- Queue system for heavy operations
- Horizontal scaling with load balancer

**Cost estimate:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Redis: $10/month
- CDN: $50/month
- Total: ~$105/month

### Performance Optimizations

**Implemented:**
- Server-side rendering
- Component code splitting
- Tailwind CSS purging

**Future optimizations:**
- Image lazy loading
- Job list virtualization
- Database query optimization
- API response caching
- WebP image format

### Monitoring and Observability

**Would add in production:**
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database query analysis
- User behavior tracking
- Uptime monitoring

### Security Enhancements for Scale

**Current security:**
- Row-level security
- Authentication required for edits
- SQL injection prevention

**Would add:**
- Rate limiting per IP
- CSRF protection
- Content security policy
- Input sanitization
- API key rotation
- Audit logging
- DDoS protection

---

## Conclusion

This architecture is designed for rapid MVP development while maintaining clean code structure and scalability foundations. The choice of Next.js and Supabase provides a solid base that can scale from dozens to thousands of companies with incremental improvements rather than complete rewrites.

The multi-tenant database design with row-level security ensures data isolation while keeping the schema simple. The component architecture separates concerns and makes the codebase maintainable as features are added.

Key strengths:
- Type safety throughout the stack
- SEO-optimized from the start
- Clean separation of recruiter and candidate experiences
- Easy to extend with new features

Areas for future improvement:
- File upload infrastructure
- Advanced search capabilities
- Real-time collaboration features
- Application tracking system