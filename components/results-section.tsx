"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw } from "lucide-react"

type Costs = {
  enhancement: number
  sideAngles: number
  videoCreation: number
  total: number
}

interface ResultsSectionProps {
  videoUrl: string
  images: string[]
  costs: Costs | null
  onGenerateAnother: () => void
}

export function ResultsSection({ videoUrl, images, costs, onGenerateAnother }: ResultsSectionProps) {
  const labels = ["Front (Original)", "Back (Original)", "Left Side (AI)", "Right Side (AI)"]

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = "ai-generated-video.mp4"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="aspect-video bg-secondary flex items-center justify-center">
          <video src={videoUrl} controls className="w-full h-full object-cover">
            Your browser does not support the video tag.
          </video>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square bg-secondary">
              <img src={image || "/placeholder.svg"} alt={labels[index]} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground text-center">{labels[index]}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          className="px-12 py-6 text-lg font-medium bg-primary hover:bg-primary/90"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-5 w-5" />
          Download Video (MP4)
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nano Banana (Enhancement)</span>
            <span className="text-foreground font-medium">${costs?.enhancement.toFixed(2) || "0.08"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seedream 4.0 (Side Angles)</span>
            <span className="text-foreground font-medium">${costs?.sideAngles.toFixed(2) || "0.12"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Kling AI (Video Creation)</span>
            <span className="text-foreground font-medium">${costs?.videoCreation.toFixed(2) || "1.27"}</span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-semibold text-primary text-lg">${costs?.total.toFixed(2) || "1.47"}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" size="lg" onClick={onGenerateAnother}>
          <RotateCcw className="mr-2 h-5 w-5" />
          Generate Another
        </Button>
      </div>
    </div>
  )
}
