"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dumbbell, Plus, X } from "lucide-react"
import { useState } from "react"

interface Exercise {
  name: string
  sets: number
  reps: number
}

interface WorkoutFormProps {
  initialData?: {
    id?: number
    name: string
    description?: string | null
    exercises: Exercise[]
  }
  onSubmit: (formData: FormData) => Promise<void>
}

export function WorkoutForm({ initialData, onSubmit }: WorkoutFormProps) {
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises ?? []
  )

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10 }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    setExercises(
      exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Add exercises to form data
    exercises.forEach((exercise, index) => {
      formData.append(`exercises[${index}][name]`, exercise.name)
      formData.append(`exercises[${index}][sets]`, exercise.sets.toString())
      formData.append(`exercises[${index}][reps]`, exercise.reps.toString())
    })

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Workout Name
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="e.g., Upper Body Strength"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description ?? ""}
            placeholder="Describe your workout..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Exercises</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExercise}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>

          {exercises.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/50">
              <Dumbbell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No exercises added yet. Click &apos;Add Exercise&apos; to get started.
              </p>
            </div>
          )}

          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-4 border rounded-lg bg-card relative group"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeExercise(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex-1 space-y-4">
                <Input
                  value={exercise.name}
                  onChange={(e) =>
                    updateExercise(index, "name", e.target.value)
                  }
                  placeholder="Exercise name"
                  required
                />
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sets</label>
                    <Input
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) =>
                        updateExercise(index, "sets", parseInt(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reps</label>
                    <Input
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) =>
                        updateExercise(index, "reps", parseInt(e.target.value))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" className="w-full sm:w-auto">
          {initialData ? "Update Workout" : "Create Workout"}
        </Button>
      </div>
    </form>
  )
}
