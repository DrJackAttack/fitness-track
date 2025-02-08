import { WorkoutForm } from "@/components/workout-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

async function createWorkout(formData: FormData) {
  "use server"

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  // Parse exercises from form data
  const exercises = []
  let i = 0
  while (formData.has(`exercises[${i}][name]`)) {
    exercises.push({
      name: formData.get(`exercises[${i}][name]`) as string,
      sets: parseInt(formData.get(`exercises[${i}][sets]`) as string),
      reps: parseInt(formData.get(`exercises[${i}][reps]`) as string),
    })
    i++
  }

  await prisma.workout.create({
    data: {
      name,
      description,
      exercises: {
        create: exercises,
      },
    },
  })

  redirect("/")
}

export default function NewWorkoutPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Workout</h1>
        </div>

        <div className="bg-card rounded-xl border p-4 md:p-6">
          <WorkoutForm onSubmit={createWorkout} />
        </div>
      </div>
    </main>
  )
}
