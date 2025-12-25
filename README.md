# Careers Page Builder

A modern ATS platform that enables companies to create beautiful, branded careers pages and allows candidates to discover and explore job opportunities.

## 🌟 What I Built

This is a full-stack multi-tenant careers page builder where:
- **Recruiters** can customize their company's branding, add content sections, and manage job listings
- **Candidates** can browse companies, search/filter jobs, and view detailed job descriptions
- Each company gets a unique branded careers page at `/{company-slug}/careers`

## 🚀 Features Implemented

### For Recruiters
-  Authentication system (login/signup)
-  Brand customization (colors, logo, banner, tagline)
-  Dynamic content sections (add, edit, delete, reorder)
-  Job management (CRUD operations)
-  Live preview of careers page
-  Protected dashboard routes

### For Candidates
-  Beautiful, branded careers pages
-  Job search by title
-  Filter by location and job type
-  Job details modal with full description
-  Mobile-responsive design
-  SEO-optimized pages

### Technical Features
-  Server-side rendering (Next.js App Router)
-  Real-time database updates
-  Row-level security policies
-  Type-safe database queries
-  Clean component architecture

##  Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)

**Deployment:**
- Vercel (Frontend & API)
- Supabase (Database & Auth)

##  How to Run Locally

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/AdnanSameer1724/careers-page-builder.git
cd careers-page-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a new project at [supabase.com](https://supabase.com)
- Go to Project Settings > API
- Copy your project URL and anon key

4. **Configure environment variables**

Create `.env.local` in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Set up database tables**

Go to Supabase SQL Editor and run the schema from `TECH_SPEC.md`

6. **Run the development server**
```bash
npm run dev
```

7. **Open the app**

Visit [http://localhost:3000](http://localhost:3000)

## 📖 User Guide

### For Recruiters

1. **Sign Up / Log In**
   - Visit `/login`
   - Create an account or log in
   - You'll be redirected to your dashboard

2. **Customize Branding**
   - Go to the "Branding" tab
   - Set your company name and tagline
   - Choose brand colors using the color picker
   - Add logo and banner image URLs
   - Optionally add a culture video (YouTube embed URL)
   - Click "Save Changes"

3. **Manage Content Sections**
   - Go to the "Sections" tab
   - Click "Add Section" to create new sections
   - Use ↑↓ arrows to reorder sections
   - Edit titles and content
   - Delete unwanted sections
   - Click "Save All Sections"

4. **Manage Jobs**
   - Go to the "Jobs" tab
   - Click "Add Job" to create a new position
   - Fill in job details (title, location, type, department, description, requirements)
   - Click "Save Job"
   - Edit or delete existing jobs as needed

5. **Preview & Share**
   - Click "Preview Page" to see your live careers page
   - Share the URL: `yoursite.com/{company-slug}/careers`

### For Candidates

1. **Browse Companies**
   - Visit the homepage
   - Click on any company card to view their careers page

2. **Search & Filter Jobs**
   - Use the search bar to find jobs by title
   - Filter by location or job type
   - Click "Clear all filters" to reset

3. **View Job Details**
   - Click "View Details" on any job card
   - Read full description and requirements
   - Click "Apply" (placeholder for now)

##  Future Improvements

### Short Term
- File upload for logos/banners (instead of URLs)
- Email notifications for new applications
- Application tracking system
- Analytics dashboard (views, applications)
- Bulk job import from CSV

### Medium Term
- Multi-language support
- Advanced search (salary range, experience level)
- Job categories and tags
- Social media integration
- Candidate profiles

### Long Term
- AI-powered job matching
- Video interviews integration
- Applicant screening tools
- Integration with other ATS platforms
- White-label solution for agencies

##  Architecture Decisions

### Why Next.js App Router?
- Server-side rendering for SEO
- API routes for backend logic
- File-based routing for clean URLs
- Built-in optimization

### Why Supabase?
- PostgreSQL with real-time capabilities
- Built-in authentication
- Row-level security for multi-tenancy
- Free tier sufficient for MVP
- Easy to scale

### Why Tailwind CSS v4?
- Rapid prototyping
- Consistent design system
- Small bundle size
- No config file needed in v4

### Database Design
- **Multi-tenant architecture**: Each company has separate data via `company_id`
- **Soft deletes**: Jobs have `is_active` flag instead of hard delete
- **Ordered sections**: `order_index` for custom section ordering
- **Flexible schema**: JSON-friendly for future extensibility

##  Security Considerations

- Row-level security policies on all tables
- Authentication required for edit routes
- SQL injection prevention via parameterized queries
- CORS configured for production domain
- Environment variables for sensitive data

##  Performance Optimizations

- Server-side rendering for initial page load
- Database indexes on frequently queried fields
- Image optimization via Next.js Image component
- CSS purging in production build
- API route caching where appropriate

##  Known Issues & Limitations

- File uploads use URLs (no direct upload yet)
- No email verification for auth
- Application flow is placeholder
- Single admin per company (no team management)

## License

This project was built as an assignment for Whitecarrot.

---

Built with ❤️ by [Adnan Sameer Z]