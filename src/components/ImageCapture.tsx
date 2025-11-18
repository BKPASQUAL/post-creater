'use client'

import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, Upload, X, RotateCcw } from 'lucide-react'

interface ImageCaptureProps {
  onImageCapture: (imageUrl: string, file?: File) => void
}

export default function ImageCapture({ onImageCapture }: ImageCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      setIsCameraOpen(false)
      onImageCapture(imageSrc)
    }
  }, [onImageCapture])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCapturedImage(imageUrl)
        onImageCapture(imageUrl, file)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageCapture])

  const toggleCamera = useCallback(() => {
    setIsCameraOpen(!isCameraOpen)
  }, [isCameraOpen])

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  const reset = useCallback(() => {
    setCapturedImage(null)
    setIsCameraOpen(false)
  }, [])

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Capture or Upload Image</h2>

        {!capturedImage && !isCameraOpen && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={toggleCamera}
              className="flex-1"
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Open Camera
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {isCameraOpen && (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: facingMode
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={capture} className="flex-1" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>
              <Button onClick={switchCamera} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button onClick={toggleCamera} variant="outline" size="lg">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="flex-1">
                <X className="mr-2 h-5 w-5" />
                Remove
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Different
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
