"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GenerateButtonProps {
  disabled: boolean
  onClick: () => void
}

export function GenerateButton({ disabled, onClick }: GenerateButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        size="lg"
        disabled={disabled}
        onClick={onClick}
        className="w-full md:w-auto px-12 py-6 text-lg font-medium bg-primary hover:bg-primary/90"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Generate 4-Angle Video
      </Button>
      <p className="text-sm text-muted-foreground">
        Estimated cost: <span className="text-foreground font-medium">~$1.50 per video</span>
      </p>
    </div>
  )
}
