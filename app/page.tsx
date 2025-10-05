"use client"

import { useState } from "react"
import { UploadSection } from "@/components/upload-section"
import { GenerateButton } from "@/components/generate-button"
import { ProgressSection } from "@/components/progress-section"
import { ResultsSection } from "@/components/results-section"
import { ErrorSection } from "@/components/error-section"

type AppState = "idle" | "generating" | "complete" | "error"

type Costs = {
  enhancement: number
  sideAngles: number
  videoCreation: number
  total: number
}

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
  const [costs, setCosts] = useState<Costs | null>(null)

  const handleGenerate = async () => {
    if (!frontImage || !backImage) return

    setState("generating")
    setProgress(0)
    setCurrentStep(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("frontImage", frontImage)
      formData.append("backImage", backImage)

      const response = await fetch(`${BACKEND_API_URL}/api/generate-video`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")

      if (contentType?.includes("text/event-stream")) {
        await handleSSEStream(response)
      } else if (contentType?.includes("application/json")) {
        const result = await response.json()
        await simulateProgressWithSteps()
        setGeneratedImages(result.generatedImages || [])
        setVideoUrl(result.videoUrl || null)
        setCosts(result.costs || null)
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

    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.step) setCurrentStep(data.step)
            if (data.progress !== undefined) setProgress(data.progress)

            if (data.status === "complete" && data.result) {
              setGeneratedImages(data.result.generatedImages || [])
              setVideoUrl(data.result.videoUrl || null)
              setCosts(data.result.costs || null)
              setState("complete")
            }

            if (data.status === "error") {
              throw new Error(data.message || "Video generation failed")
            }
          } catch (parseError) {
            console.error("[v0] Failed to parse SSE data:", parseError)
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
    setCosts(null)
  }

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-foreground">AI 4-Angle Video Generator</h1>
          <p className="text-lg text-muted-foreground">Upload 2 photos → Get 4-angle cinematic video</p>
        </header>

        {(state === "idle" || state === "error") && (
          <UploadSection
            frontImage={frontImage}
            backImage={backImage}
            onFrontImageChange={setFrontImage}
            onBackImageChange={setBackImage}
          />
        )}

        {(state === "idle" || state === "error") && (
          <GenerateButton disabled={!frontImage || !backImage} onClick={handleGenerate} />
        )}

        {state === "error" && error && <ErrorSection error={error} onRetry={handleGenerate} />}

        {state === "generating" && (
          <ProgressSection progress={progress} currentStep={currentStep} onCancel={handleReset} />
        )}

        {state === "complete" && videoUrl && (
          <ResultsSection videoUrl={videoUrl} images={generatedImages} costs={costs} onGenerateAnother={handleReset} />
        )}
      </div>
    </main>
  )
}
