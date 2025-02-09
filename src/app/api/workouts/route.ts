import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
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

    // Create workout with exercises
    const workout = await prisma.workout.create({
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

    return NextResponse.json(workout)
  } catch (error) {
    console.error("Error creating workout:", error)
    return NextResponse.json(
      { error: "Error creating workout" },
      { status: 500 }
    )
  }
}
