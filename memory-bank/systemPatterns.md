# FlexForge System Patterns

## Architecture Overview
FlexForge follows a modern Next.js application architecture with server components, client components, and server actions.

## Key Technical Decisions

### Database Design
```prisma
model Workout {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  exercises   Exercise[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Exercise {
  id          Int      @id @default(autoincrement())
  name        String
  sets        Int
  reps        Int
  workoutId   Int
  workout     Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
}
```

### Component Architecture
1. Server Components
   - Page components (`page.tsx`)
   - Layout components
   - Data fetching components

2. Client Components
   - WorkoutForm (marked with "use client")
   - Interactive UI components
   - Form handling components

### Design Patterns
1. Form Handling
   - Server actions for data mutations
   - FormData for data transfer
   - Client-side state for exercise management

2. Data Flow
   - Server-side data fetching
   - Client-side form state
   - Server actions for mutations

3. UI Patterns
   - Card-based layout
   - Responsive grid system
   - Dark mode by default

## Component Relationships
- Root Layout → Page Components
- Page Components → Form Components
- Form Components → UI Components
- Server Actions ← Form Submissions

## Known Issues
- Edit functionality has runtime errors
- Form validation needs improvement
- Error handling needs enhancement
