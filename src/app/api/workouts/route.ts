import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, exercises } = body

    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        exercises: {
          create: exercises.map((exercise: any) => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
          })),
        },
      },
      include: {
        exercises: true,
      },
    })

    return NextResponse.json(workout)
  } catch (error) {
    console.error("Error creating workout:", error)
    return NextResponse.json(
      { error: "Error creating workout" },
      { status: 500 }
    )
  }
}
