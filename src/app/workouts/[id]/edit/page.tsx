import { WorkoutForm } from "@/components/workout-form"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

async function updateWorkout(id: string, formData: FormData) {
  "use server"

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const exerciseData = formData.getAll("exercise").map((e) => JSON.parse(e as string))

  await prisma.exercise.deleteMany({
    where: {
      workoutId: parseInt(id),
    },
  })

  await prisma.workout.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      description,
      exercises: {
        create: exerciseData.map((exercise: any) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
        })),
      },
    },
  })

  redirect(`/workouts/${id}`)
}

export default async function EditWorkoutPage({
  params,
}: {
  params: { id: string }
}) {
  const workout = await prisma.workout.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      exercises: true,
    },
  })

  if (!workout) {
    redirect("/")
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/workouts/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Workout</h1>
        </div>

        <div className="bg-card rounded-xl border p-4 md:p-6">
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
            onSubmit={(formData) => updateWorkout(params.id, formData)}
          />
        </div>
      </div>
    </main>
  )
}
