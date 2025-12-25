# AI Agent Usage Log

This document tracks how I used AI tools throughout the development process, including prompts, results, and learnings.

---

## Session 1: Project Setup and Database Schema

### Date: [Your Date]
### Tool: Claude AI (Anthropic)
### Duration: ~30 minutes

**Prompt 1: Initial Planning**
```
I need to build a careers page builder for an ATS platform. 
Requirements: Recruiters can customize branding and add jobs. 
Candidates can browse and filter jobs. Help me plan the tech stack.
```

**AI Response:**
- Suggested Next.js for SEO benefits
- Recommended Supabase for quick backend setup
- Proposed multi-tenant database design

**What I Learned:**
- Next.js App Router is better than Pages Router for this use case
- Supabase RLS policies handle multi-tenancy well
- TypeScript adds valuable type safety

**What I Modified:**
- AI suggested MongoDB initially, I switched to PostgreSQL for relational data
- Added more specific field types based on assignment requirements

---

**Prompt 2: Database Schema Design**
```
Create a PostgreSQL schema for companies, sections, and jobs tables. 
Each company should have customizable branding and multiple jobs.
```

**AI Response:**
Generated complete SQL schema with tables and relationships

**Issues Encountered:**
- Initial schema missing order_index for sections
- Forgot to add is_active flag for soft deletes

**How I Fixed:**
- Added order_index INTEGER to company_sections
- Added is_active BOOLEAN to jobs table
- Modified RLS policies to be more permissive for development

**Refinement Prompts:**
```
Add a field to track section ordering
Add soft delete capability for jobs
Make RLS policies work without authentication for now
```

---

## Session 2: Building the Public Careers Page

### Duration: ~45 minutes

**Prompt 3: Careers Page Component**
```
Create a Next.js server component that fetches company data 
and displays a branded careers page with job listings
```

**AI Output Quality:** 8/10
- Generated clean server component code
- Proper async/await handling
- Good TypeScript types

**Issues:**
- Missing job filtering logic initially
- Not handling null values properly

**Manual Fixes:**
- Added URL parameter filtering for search and location
- Added null checks for optional fields
- Improved error handling with notFound()

---

**Prompt 4: Job Filter Component**
```
Create a client component for filtering jobs by search term, 
location, and job type using URL parameters
```

**AI Response:**
Generated working filter component with useState

**What Worked Well:**
- URL parameter management was correct
- Search and filter logic was solid

**What I Changed:**
- Removed useEffect dependency that caused infinite loops
- Simplified the filter update logic
- Added "Clear filters" button manually

---

**Prompt 5: Company Header Component**
```
Build a header component showing company logo, banner, 
name, tagline with dynamic brand colors
```

**AI Output:** Good starting point

**Modifications Made:**
- Changed fixed height to responsive classes
- Added gradient overlay for better text readability
- Improved mobile responsiveness
- Added fallback for missing logo (show first letter)

---

## Session 3: Recruiter Dashboard

### Duration: ~60 minutes

**Prompt 6: Dashboard Layout**
```
Create a dashboard page with tabs for Branding, Sections, 
and Jobs using shadcn/ui tabs component
```

**Result:** Clean tabbed interface

**Issues Encountered:**
- Tabs component wasn't installed
- Had to run: npx shadcn@latest add tabs

**Learning:**
Always check which shadcn components are needed before starting

---

**Prompt 7: Branding Editor Form**
```
Build a form for editing company branding including 
color pickers, image URLs, and a save button
```

**AI Generated:**
- Complete form with all fields
- Color picker implementation
- Save handler with loading state

**What I Improved:**
- Added image preview functionality
- Added error handling for broken image URLs
- Changed alert() to better UI feedback (would use toast in production)
- Added form validation

**Challenges:**
- Color input type behavior varies across browsers
- Had to add both color and text input for hex codes

---

**Prompt 8: Sections Editor with Reordering**
```
Create a component to add, edit, delete, and reorder 
content sections with up/down arrows
```

**AI Output:** Good foundation

**Issues Fixed:**
- Reorder logic had off-by-one errors
- Delete button wasn't showing initially (missing import)
- Had to add visual feedback for order changes

**Code I Rewrote:**
```javascript
// AI version had bugs with boundaries
const moveSection = (index, direction) => {
  // My corrected version with proper bounds checking
}
```

---

**Prompt 9: Jobs Manager with Modal**
```
Build a job management interface with add/edit modal 
using shadcn dialog component
```

**AI Result:** Functional but needed refinement

**Modifications:**
- Made modal scrollable for long forms
- Added proper form validation
- Improved delete confirmation UX
- Added edit functionality (AI only did create initially)

**Refinement Prompt:**
```
Add edit functionality and make the modal work for 
both creating and editing jobs
```

---

## Session 4: API Routes

### Duration: ~30 minutes

**Prompt 10: Company Update API**
```
Create a Next.js API route to update company data 
in Supabase with proper error handling
```

**AI Generated:** Working API route

**Issues:**
- Didn't handle updated_at timestamp
- Missing try-catch in some places

**My Additions:**
- Added updated_at field
- Better error messages
- Input validation

---

**Prompt 11: Sections Bulk Save API**
```
Create an API endpoint that deletes all existing sections 
and inserts new ones in a transaction
```

**AI Approach:** Delete then insert

**My Concern:** No transaction handling

**What I Asked:**
```
How do I ensure atomicity? What if delete succeeds but insert fails?
```

**AI Response:** 
Suggested using Supabase transactions, but admitted it's not directly supported

**My Solution:**
- Kept simple delete-then-insert
- Added better error handling
- Would add proper transactions in production

---

## Session 5: Authentication

### Duration: ~40 minutes

**Prompt 12: Login Page**
```
Create a login page using Supabase Auth with 
email/password and sign up option
```

**AI Output:** Complete login page

**Good:**
- Clean UI with shadcn components
- Toggle between login/signup
- Proper error handling

**Issues:**
- Didn't redirect after login initially
- Missing router.refresh() to update auth state

---

**Prompt 13: Middleware for Protected Routes**
```
Create Next.js middleware to protect /edit routes 
and redirect to login if not authenticated
```

**AI Generated:** Middleware with Supabase auth check

**Challenges:**
- Cookie handling was complex
- Had to debug why auth wasn't persisting

**What I Learned:**
- Next.js middleware runs on edge
- Cookie handling differs from regular routes
- Need both request and response cookie operations

**Debugging Process:**
1. Added console.logs to track user state
2. Checked Supabase docs for SSR auth
3. Found the correct cookie handling pattern

---

## Session 6: Job Details Modal

### Duration: ~20 minutes

**Prompt 14: Job Details Modal**
```
Create a modal that shows full job details including 
description and requirements when clicking View Details
```

**AI Response:** Complete modal component

**What Worked:**
- Used existing dialog component
- Good layout for job information
- Proper props handling

**My Improvements:**
- Made JobCard client component (AI kept it server)
- Added useState for modal open/close
- Improved mobile scrolling behavior

---

## Session 7: Polish and Documentation

### Duration: ~45 minutes

**Prompt 15: Improved Homepage**
```
Create an attractive landing page with hero section, 
company cards, and features section
```

**AI Generated:** Modern homepage design

**Quality:** 9/10

**Minor Tweaks:**
- Adjusted spacing for mobile
- Changed some colors to match brand
- Added more descriptive text

---

**Prompt 16: README Structure**
```
Help me structure a comprehensive README for this project
```

**AI Provided:** Good outline

**What I Added Manually:**
- Specific setup instructions from my experience
- Screenshots descriptions
- Troubleshooting section based on issues I faced
- More detailed user guide

---

**Prompt 17: Technical Specification**
```
Help me document the technical architecture, 
database schema, and API endpoints
```

**AI Output:** Comprehensive technical doc

**My Additions:**
- Actual SQL from my database
- Specific implementation decisions I made
- Performance considerations based on assignment requirements
- Scalability analysis

---

## Key Learnings and Best Practices

### What AI Was Great For:

1. **Boilerplate Code Generation**
   - Component structure
   - API route templates
   - TypeScript types

2. **Problem Solving**
   - Suggesting approaches for complex features
   - Explaining Next.js patterns
   - Debugging help

3. **Documentation**
   - Structuring markdown files
   - Explaining technical concepts
   - Creating comprehensive guides

### What Required Human Oversight:

1. **Business Logic**
   - AI doesn't understand assignment requirements fully
   - Needed to verify all features matched spec
   - Had to add missing requirements

2. **Error Handling**
   - AI often missed edge cases
   - Had to add validation manually
   - Improved error messages

3. **UX Decisions**
   - Color choices
   - Spacing and layout tweaks
   - Mobile responsiveness refinements

4. **Integration Issues**
   - Library version conflicts
   - Environment setup
   - Deployment configuration

### Prompting Strategies That Worked:

1. **Be Specific**
   - Bad: "Create a form"
   - Good: "Create a form with color picker, image URL inputs, and save button using shadcn components"

2. **Iterate**
   - Start with basic requirement
   - Refine based on output
   - Ask for specific improvements

3. **Provide Context**
   - Mention tech stack
   - Reference existing code structure
   - Specify constraints

4. **Ask for Explanations**
   - "Why did you choose this approach?"
   - "What are the tradeoffs?"
   - "How would this scale?"

### Common AI Mistakes I Fixed:

1. **Import Errors**
   - AI often imports components that aren't installed
   - Always verify imports exist

2. **Type Mismatches**
   - TypeScript errors in generated code
   - Had to adjust types manually

3. **Missing Error Handling**
   - AI focuses on happy path
   - Always add try-catch and validation

4. **Over-Engineering**
   - Sometimes AI suggests complex solutions
   - Simplified where appropriate

5. **Outdated Patterns**
   - Occasionally uses old Next.js patterns
   - Verified against current docs

### Time Savings:

**Estimated time without AI:** 12-15 hours
**Actual time with AI:** 6-7 hours
**Time saved:** ~50%

**Biggest time savers:**
- Component boilerplate generation
- API route structure
- TypeScript type definitions
- Documentation templates

**Where I spent extra time:**
- Debugging AI-generated code
- Fixing integration issues
- Understanding why AI chose certain patterns
- Refining UX details

---

## Reflections

### What Worked Well:

1. Using AI as a pair programmer
2. Rapid prototyping of components
3. Getting unstuck on technical problems
4. Documentation generation

### What I'd Do Differently:

1. Start with clearer requirements document
2. Create component checklist before coding
3. Test AI-generated code immediately
4. Keep a running list of all components needed

### Skills Developed:

1. Better at evaluating AI-generated code
2. Learned to ask more specific prompts
3. Improved debugging of unfamiliar patterns
4. Better understanding of Next.js App Router

### Future Improvements:

1. Use AI for test generation
2. Ask for accessibility improvements
3. Get AI help with performance optimization
4. Use for refactoring suggestions

---

## Statistics

**Total AI Interactions:** ~30 prompts
**Code Generated by AI:** ~70%
**Code Modified by Me:** ~30%
**Code Written from Scratch:** ~10%

**Component Breakdown:**
- Fully AI-generated (with minor tweaks): 40%
- AI-generated, heavily modified: 50%
- Written by me: 10%

**Most Helpful AI Contributions:**
1. Database schema design
2. Component structure
3. API route patterns
4. Documentation

**Least Helpful AI Contributions:**
1. Middleware implementation (too complex)
2. Some styling decisions
3. Business logic validation

---

## Conclusion

AI tools significantly accelerated development, especially for boilerplate code and standard patterns. However, human judgment was essential for:
- Understanding assignment requirements
- Making UX decisions
- Debugging integration issues
- Ensuring code quality
- Writing meaningful documentation

The key to effective AI usage was treating it as a knowledgeable assistant rather than a replacement for thinking. Best results came from:
1. Clear, specific prompts
2. Critical evaluation of output
3. Iterative refinement
4. Understanding the "why" behind suggestions

This project demonstrated that AI is most valuable when combined with human expertise, domain knowledge, and critical thinking.
```