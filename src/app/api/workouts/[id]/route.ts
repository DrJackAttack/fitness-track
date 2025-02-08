import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const formData = await request.formData()
    
    // Validate required fields
    const name = formData.get("name")
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Workout name is required" },
        { status: 400 }
      )
    }

    const description = formData.get("description") as string
    
    // Parse and validate exercises
    const exercises: { name: string; sets: number; reps: number }[] = []
    const exerciseEntries = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("exercises["))
    
    // Group exercise data by index
    const exerciseGroups = new Map<number, { name?: string; sets?: number; reps?: number }>()
    
    exerciseEntries.forEach(([key, value]) => {
      const match = key.match(/exercises\[(\d+)\]\[(\w+)\]/)
      if (match) {
        const [, index, field] = match
        const i = parseInt(index)
        if (!exerciseGroups.has(i)) {
          exerciseGroups.set(i, {})
        }
        const exercise = exerciseGroups.get(i)!
        if (field === "name") {
          exercise.name = value as string
        } else if (field === "sets" || field === "reps") {
          exercise[field] = parseInt(value as string)
        }
      }
    })

    // Validate and convert exercise groups
    exerciseGroups.forEach((exercise) => {
      if (!exercise.name || !exercise.sets || !exercise.reps) {
        throw new Error("Invalid exercise data")
      }
      exercises.push({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps
      })
    })

    if (exercises.length === 0) {
      return NextResponse.json(
        { error: "At least one exercise is required" },
        { status: 400 }
      )
    }

    // Update in transaction to ensure data consistency
    const workout = await prisma.$transaction(async (tx) => {
      await tx.exercise.deleteMany({
        where: {
          workoutId: parseInt(id),
        },
      })

      return await tx.workout.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          description,
          exercises: {
            create: exercises,
          },
        },
        include: {
          exercises: true,
        },
      })
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const workout = await prisma.workout.findUnique({
      where: {
        id: parseInt(id),
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    await prisma.workout.delete({
      where: {
        id: parseInt(id),
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
