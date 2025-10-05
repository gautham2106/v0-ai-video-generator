"use client"

import { useState } from "react"
import { UploadSection } from "@/components/upload-section"
import { GenerateButton } from "@/components/generate-button"
import { ProgressSection } from "@/components/progress-section"
import { ResultsSection } from "@/components/results-section"
import { ErrorSection } from "@/components/error-section"

type AppState = "idle" | "generating" | "complete" | "error"

const BACKEND_API_URL = "https://ai-video-generator-backend-production.up.railway.app"

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
      // Create FormData with the images
      const formData = new FormData()
      formData.append("frontImage", frontImage)
      formData.append("backImage", backImage)

      console.log("[v0] Starting video generation request to backend")

      // Make API request to backend
      const response = await fetch(`${BACKEND_API_URL}/api/generate-video`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      // Check if response is streaming (SSE) or JSON
      const contentType = response.headers.get("content-type")

      if (contentType?.includes("text/event-stream")) {
        // Handle Server-Sent Events for progress updates
        console.log("[v0] Handling SSE stream for progress updates")
        await handleSSEStream(response)
      } else if (contentType?.includes("application/json")) {
        // Handle regular JSON response
        console.log("[v0] Handling JSON response")
        const result = await response.json()

        // Simulate progress through steps if backend doesn't provide streaming
        await simulateProgressWithSteps()

        // Set final results
        setGeneratedImages(result.generatedImages || [])
        setVideoUrl(result.videoUrl || null)
        setState("complete")
      } else {
        throw new Error("Unexpected response format from backend")
      }
    } catch (err) {
      console.error("[v0] Error during video generation:", err)
      setError(err instanceof Error ? err.message : "Failed to generate video. Please try again.")
      setState("error")
    }
  }

  const handleSSEStream = async (response: Response) => {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error("Response body is not readable")
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6))

          console.log("[v0] SSE update:", data)

          // Update progress based on backend response
          if (data.step) setCurrentStep(data.step)
          if (data.progress) setProgress(data.progress)

          // Handle completion
          if (data.status === "complete" && data.result) {
            setGeneratedImages(data.result.generatedImages || [])
            setVideoUrl(data.result.videoUrl || null)
            setState("complete")
          }

          // Handle errors
          if (data.status === "error") {
            throw new Error(data.message || "Video generation failed")
          }
        }
      }
    }
  }

  const simulateProgressWithSteps = async () => {
    const steps = [
      { step: 1, progress: 10, delay: 500 },
      { step: 2, progress: 25, delay: 1000 },
      { step: 3, progress: 50, delay: 1500 },
      { step: 4, progress: 80, delay: 1500 },
      { step: 5, progress: 100, delay: 500 },
    ]

    for (const { step, progress, delay } of steps) {
      setCurrentStep(step)
      setProgress(progress)
      await new Promise((resolve) => setTimeout(resolve, delay))
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
