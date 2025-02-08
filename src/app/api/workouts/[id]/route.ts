import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        exercises: true,
      },
    })

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(workout)
  } catch (error) {
    console.error("Error fetching workout:", error)
    return NextResponse.json(
      { error: "Error fetching workout" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workout.delete({
      where: {
        id: parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting workout:", error)
    return NextResponse.json(
      { error: "Error deleting workout" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, exercises } = body

    // Delete existing exercises
    await prisma.exercise.deleteMany({
      where: {
        workoutId: parseInt(params.id),
      },
    })

    // Update workout and create new exercises
    const workout = await prisma.workout.update({
      where: {
        id: parseInt(params.id),
      },
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
    console.error("Error updating workout:", error)
    return NextResponse.json(
      { error: "Error updating workout" },
      { status: 500 }
    )
  }
}
