"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProgressSectionProps {
  progress: number
  currentStep: number
  onCancel: () => void
}

const steps = [
  { id: 1, label: "Uploading images...", progress: 10 },
  { id: 2, label: "Enhancing quality (Nano Banana)...", progress: 25 },
  { id: 3, label: "Generating side angles (Seedream)...", progress: 50 },
  { id: 4, label: "Creating video (Kling AI)...", progress: 80 },
  { id: 5, label: "Finalizing...", progress: 100 },
]

export function ProgressSection({ progress, currentStep, onCancel }: ProgressSectionProps) {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Generating Video</h2>
          <Badge variant="secondary" className="text-sm">
            {progress}%
          </Badge>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 text-sm">
              {currentStep > step.id ? (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              ) : currentStep === step.id ? (
                <Loader2 className="flex-shrink-0 h-5 w-5 text-primary animate-spin" />
              ) : (
                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-border" />
              )}
              <span className={currentStep >= step.id ? "text-foreground font-medium" : "text-muted-foreground"}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Estimated time remaining: <span className="text-foreground">~2-3 minutes</span>
          </p>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}
