import { WorkoutForm } from "@/components/workout-form"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

interface Props {
  params: { id: string }
}

async function getWorkout(id: string) {
  const workout = await prisma.workout.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      exercises: true,
    },
  })

  if (!workout) {
    redirect("/")
  }

  return workout
}

export default async function EditWorkoutPage({ params }: Props) {
  // Await params before accessing properties
  const { id } = await Promise.resolve(params)
  const workout = await getWorkout(id)

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/workouts/${workout.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Workout</h1>
        </div>

        <div className="bg-card rounded-xl border p-4 md:p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <WorkoutForm
              initialData={{
                id: workout.id,
                name: workout.name,
                description: workout.description,
                exercises: workout.exercises.map((exercise) => ({
                  name: exercise.name,
                  sets: exercise.sets,
                  reps: exercise.reps,
                })),
              }}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
