"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorSectionProps {
  error: string
  onRetry: () => void
}

export function ErrorSection({ error, onRetry }: ErrorSectionProps) {
  return (
    <Card className="p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">{error}</AlertDescription>
      </Alert>

      <div className="flex items-center gap-4 mt-6">
        <Button onClick={onRetry} className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <a href="mailto:support@example.com">Report Issue</a>
        </Button>
      </div>
    </Card>
  )
}
