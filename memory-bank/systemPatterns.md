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

## Form Handling Patterns

1. Server-Side Form Processing
   - Use FormData for data transfer
   - Parse and validate form data on server
   - Group related form fields (e.g., exercises)
   - Return appropriate error responses

2. Next.js 14 Params Handling
   ```typescript
   // Always await params before using
   const { id } = await Promise.resolve(params)
   ```

3. API Route Patterns
   - Consistent error handling
   - Proper status codes
   - Validation before database operations
   - Transaction-based updates

4. Form Submission
   - Client-side validation
   - Loading states during submission
   - Error message display
   - Proper HTTP methods (POST/PUT)

## Current Patterns

1. Data Validation
   - Server-side required fields
   - Client-side validation before submit
   - Structured error responses
   - Type checking for inputs

2. Error Handling
   - Try/catch blocks in API routes
   - Proper error messages
   - Status code mapping
   - Client-side error display

3. Form State Management
   - Loading states
   - Error states
   - Client-side validation
   - Dynamic form fields

## Known Issues
- Need to implement workout categories
- Exercise library functionality pending
- Progress tracking to be added
