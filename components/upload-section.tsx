"use client"

import type React from "react"

import { useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadSectionProps {
  frontImage: File | null
  backImage: File | null
  onFrontImageChange: (file: File | null) => void
  onBackImageChange: (file: File | null) => void
}

export function UploadSection({ frontImage, backImage, onFrontImageChange, onBackImageChange }: UploadSectionProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent, type: "front" | "back") => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && validateFile(file)) {
        type === "front" ? onFrontImageChange(file) : onBackImageChange(file)
      }
    },
    [onFrontImageChange, onBackImageChange],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
      const file = e.target.files?.[0]
      if (file && validateFile(file)) {
        type === "front" ? onFrontImageChange(file) : onBackImageChange(file)
      }
    },
    [onFrontImageChange, onBackImageChange],
  )

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload JPG or PNG files only")
      return false
    }

    if (file.size > maxSize) {
      alert("File size must be less than 10MB")
      return false
    }

    return true
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <UploadZone
        label="Upload Front Photo"
        file={frontImage}
        onDrop={(e) => handleDrop(e, "front")}
        onFileInput={(e) => handleFileInput(e, "front")}
        onClear={() => onFrontImageChange(null)}
      />
      <UploadZone
        label="Upload Back Photo"
        file={backImage}
        onDrop={(e) => handleDrop(e, "back")}
        onFileInput={(e) => handleFileInput(e, "back")}
        onClear={() => onBackImageChange(null)}
      />
    </div>
  )
}

interface UploadZoneProps {
  label: string
  file: File | null
  onDrop: (e: React.DragEvent) => void
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

function UploadZone({ label, file, onDrop, onFileInput, onClear }: UploadZoneProps) {
  return (
    <Card className="relative">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="p-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={onFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="space-y-4">
            <img
              src={URL.createObjectURL(file) || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate">{file.name}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">JPG or PNG, max 10MB</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
