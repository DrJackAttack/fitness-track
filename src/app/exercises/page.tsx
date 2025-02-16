import { Card } from "@/components/ui/card"

export default function ExercisesPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Exercise Library</h1>
      <div className="grid gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground">
            Exercise library is coming soon. This feature will allow you to browse and manage your exercise collection.
          </p>
        </Card>
      </div>
    </div>
  )
}
