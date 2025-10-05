"use client"

import { useState } from "react"
import { UploadSection } from "@/components/upload-section"
import { GenerateButton } from "@/components/generate-button"
import { ProgressSection } from "@/components/progress-section"
import { ResultsSection } from "@/components/results-section"
import { ErrorSection } from "@/components/error-section"

type AppState = "idle" | "generating" | "complete" | "error"

export default function Home() {
  const [state, setState] = useState<AppState>("idle")
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!frontImage || !backImage) return

    setState("generating")
    setProgress(0)
    setCurrentStep(0)
    setError(null)

    try {
      // Step 1: Uploading
      setCurrentStep(1)
      setProgress(10)
      await simulateDelay(1000)

      // Step 2: Enhancing quality
      setCurrentStep(2)
      setProgress(25)
      await simulateDelay(2000)

      // Step 3: Generating side angles
      setCurrentStep(3)
      setProgress(50)
      await simulateDelay(3000)

      // Step 4: Creating video
      setCurrentStep(4)
      setProgress(80)
      await simulateDelay(3000)

      // Step 5: Finalizing
      setCurrentStep(5)
      setProgress(100)
      await simulateDelay(1000)

      // Mock results
      const frontUrl = URL.createObjectURL(frontImage)
      const backUrl = URL.createObjectURL(backImage)
      setGeneratedImages([frontUrl, backUrl, "/ai-generated-left-side-view.jpg", "/ai-generated-right-side-view.jpg"])
      setVideoUrl("/cinematic-4-angle-video-preview.jpg")

      setState("complete")
    } catch (err) {
      setError("Failed to generate video. Please try again.")
      setState("error")
    }
  }

  const handleReset = () => {
    setState("idle")
    setFrontImage(null)
    setBackImage(null)
    setProgress(0)
    setCurrentStep(0)
    setError(null)
    setVideoUrl(null)
    setGeneratedImages([])
  }

  const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-foreground">AI 4-Angle Video Generator</h1>
          <p className="text-lg text-muted-foreground">Upload 2 photos → Get 4-angle cinematic video</p>
        </header>

        {/* Upload Section */}
        {(state === "idle" || state === "error") && (
          <UploadSection
            frontImage={frontImage}
            backImage={backImage}
            onFrontImageChange={setFrontImage}
            onBackImageChange={setBackImage}
          />
        )}

        {/* Generate Button */}
        {(state === "idle" || state === "error") && (
          <GenerateButton disabled={!frontImage || !backImage} onClick={handleGenerate} />
        )}

        {/* Error Section */}
        {state === "error" && error && <ErrorSection error={error} onRetry={handleGenerate} />}

        {/* Progress Section */}
        {state === "generating" && (
          <ProgressSection progress={progress} currentStep={currentStep} onCancel={handleReset} />
        )}

        {/* Results Section */}
        {state === "complete" && videoUrl && (
          <ResultsSection videoUrl={videoUrl} images={generatedImages} onGenerateAnother={handleReset} />
        )}
      </div>
    </main>
  )
}
