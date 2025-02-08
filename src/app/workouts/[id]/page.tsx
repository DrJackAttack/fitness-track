import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function WorkoutPage({
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

  async function deleteWorkout() {
    "use server"
    
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/workouts/${params.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete workout")
    }

    redirect("/")
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold flex-1">{workout.name}</h1>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/workouts/${workout.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <form action={deleteWorkout}>
            <Button variant="destructive" size="icon" type="submit">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {workout.description && (
          <p className="text-muted-foreground mb-8">{workout.description}</p>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <div className="grid gap-4">
            {workout.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
              >
                <h3 className="font-medium mb-2">{exercise.name}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <p>{exercise.sets} sets</p>
                  <p>{exercise.reps} reps</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
