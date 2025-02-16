import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

export default async function Home() {
  const workouts = await prisma.workout.findMany({
    include: {
      exercises: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="container mx-auto p-4 md:p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Your Workouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id} className="group hover:border-primary/50">
            <CardHeader>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {workout.name}
              </CardTitle>
              <CardDescription>
                {workout.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workout.exercises.length > 0 ? (
                <div className="space-y-3">
                  {workout.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-2 rounded-md border bg-muted/40 hover:bg-muted/60 transition-colors"
                    >
                      <h3 className="font-medium text-sm mb-1">{exercise.name}</h3>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <p>{exercise.sets} sets</p>
                        <p>{exercise.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No exercises added yet</p>
              )}
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href={`/workouts/${workout.id}`}>
                  View Details
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href={`/workouts/${workout.id}/edit`}>
                  Edit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {workouts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No workouts yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first workout to get started
            </p>
            <Button asChild>
              <Link href="/workouts/new">
                Create Your First Workout
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
