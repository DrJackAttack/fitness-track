# FlexForge Technical Context

## Development Environment
- Windows 11
- PowerShell
- VSCode
- Node.js environment

## Core Technologies
1. Next.js 14
   - App Router
   - Server Components
   - Server Actions
   - TypeScript support

2. Database
   - SQLite
   - Prisma ORM
   - Local development database

3. UI Framework
   - Tailwind CSS
   - shadcn/ui components
   - Dark mode configuration

## Dependencies
- @prisma/client: Database ORM
- class-variance-authority: Component styling
- clsx: Class name utilities
- lucide-react: Icon library
- tailwind-merge: Tailwind class merging
- @radix-ui/react-*: UI primitives

## Project Structure
```
fitness-track/
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   └── lib/            # Utility functions and configs
├── prisma/             # Database schema and migrations
└── public/            # Static assets
```

## Technical Constraints
- No authentication required
- Local SQLite database
- Server-side rendering focused
- Mobile-first responsive design

## Development Setup
1. Install dependencies: `npm install`
2. Setup database: `npx prisma generate`
3. Run development server: `npm run dev`

## Build & Deployment
- Development: `npm run dev`
- Build: `npm run build`
- Start: `npm start`
