'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Download, Loader2 } from 'lucide-react'

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImage: string, settings: EditorSettings) => void
}

export interface EditorSettings {
  companyLogoUrl: string | null
  logoPosition: { x: number; y: number; width: number; height: number }
  price: string
  pricePosition: { x: number; y: number; width: number; height: number }
  priceBadgeStyle: {
    backgroundColor: string
    textColor: string
    fontSize: number
  }
  borderEnabled: boolean
  borderWidth: number
  borderColor: string
  borderStyle: string
}

export default function ImageEditor({ imageUrl, onSave }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [settings, setSettings] = useState<EditorSettings>({
    companyLogoUrl: null,
    logoPosition: { x: 20, y: 20, width: 100, height: 100 },
    price: '',
    pricePosition: { x: -140, y: -80, width: 120, height: 60 },
    priceBadgeStyle: {
      backgroundColor: '#FF6B6B',
      textColor: '#FFFFFF',
      fontSize: 20,
    },
    borderEnabled: false,
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'solid',
  })

  const [isRendering, setIsRendering] = useState(false)

  useEffect(() => {
    renderCanvas()
  }, [imageUrl, settings])

  const renderCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsRendering(true)

    try {
      // Set canvas size
      canvas.width = 1080
      canvas.height = 1080

      // Load and draw main image
      const mainImg = await loadImage(imageUrl)
      ctx.drawImage(mainImg, 0, 0, canvas.width, canvas.height)

      // Draw border if enabled
      if (settings.borderEnabled) {
        ctx.strokeStyle = settings.borderColor
        ctx.lineWidth = settings.borderWidth
        ctx.strokeRect(
          settings.borderWidth / 2,
          settings.borderWidth / 2,
          canvas.width - settings.borderWidth,
          canvas.height - settings.borderWidth
        )
      }

      // Draw company logo if available
      if (settings.companyLogoUrl) {
        try {
          const logo = await loadImage(settings.companyLogoUrl)
          ctx.drawImage(
            logo,
            settings.logoPosition.x,
            settings.logoPosition.y,
            settings.logoPosition.width,
            settings.logoPosition.height
          )
        } catch (error) {
          console.error('Failed to load logo:', error)
        }
      }

      // Draw price badge if price is set
      if (settings.price) {
        drawPriceBadge(ctx, canvas.width, canvas.height)
      }
    } catch (error) {
      console.error('Failed to render canvas:', error)
    } finally {
      setIsRendering(false)
    }
  }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const drawPriceBadge = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const { pricePosition, priceBadgeStyle, price } = settings

    // Calculate actual position (handle negative values as offsets from right/bottom)
    const x = pricePosition.x < 0
      ? canvasWidth + pricePosition.x - pricePosition.width
      : pricePosition.x
    const y = pricePosition.y < 0
      ? canvasHeight + pricePosition.y - pricePosition.height
      : pricePosition.y

    // Draw badge background with rounded corners
    const radius = 8
    ctx.fillStyle = priceBadgeStyle.backgroundColor
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + pricePosition.width - radius, y)
    ctx.quadraticCurveTo(x + pricePosition.width, y, x + pricePosition.width, y + radius)
    ctx.lineTo(x + pricePosition.width, y + pricePosition.height - radius)
    ctx.quadraticCurveTo(
      x + pricePosition.width,
      y + pricePosition.height,
      x + pricePosition.width - radius,
      y + pricePosition.height
    )
    ctx.lineTo(x + radius, y + pricePosition.height)
    ctx.quadraticCurveTo(x, y + pricePosition.height, x, y + pricePosition.height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()

    // Draw price text
    ctx.fillStyle = priceBadgeStyle.textColor
    ctx.font = `bold ${priceBadgeStyle.fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      `$${price}`,
      x + pricePosition.width / 2,
      y + pricePosition.height / 2
    )
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings({
          ...settings,
          companyLogoUrl: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const editedImage = canvas.toDataURL('image/png')
      onSave(editedImage, settings)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'edited-post.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Customize Your Post</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas Preview */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {isRendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Save Post
              </Button>
            </div>
          </div>

          {/* Editor Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="logo" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="logo">Logo</TabsTrigger>
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="border">Border</TabsTrigger>
              </TabsList>

              {/* Logo Tab */}
              <TabsContent value="logo" className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => logoInputRef.current?.click()}
                      variant="outline"
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {settings.companyLogoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>

                {settings.companyLogoUrl && (
                  <>
                    <div>
                      <Label>Logo Size</Label>
                      <Slider
                        value={[settings.logoPosition.width]}
                        onValueChange={([width]) =>
                          setSettings({
                            ...settings,
                            logoPosition: {
                              ...settings.logoPosition,
                              width,
                              height: width,
                            },
                          })
                        }
                        min={50}
                        max={300}
                        step={10}
                        className="mt-2"
                      />
                      <span className="text-sm text-gray-500">
                        {settings.logoPosition.width}px
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>X Position</Label>
                        <Input
                          type="number"
                          value={settings.logoPosition.x}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              logoPosition: {
                                ...settings.logoPosition,
                                x: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Y Position</Label>
                        <Input
                          type="number"
                          value={settings.logoPosition.y}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              logoPosition: {
                                ...settings.logoPosition,
                                y: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Price Tab */}
              <TabsContent value="price" className="space-y-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="text"
                    placeholder="Enter price"
                    value={settings.price}
                    onChange={(e) =>
                      setSettings({ ...settings, price: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                {settings.price && (
                  <>
                    <div>
                      <Label>Badge Background Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="color"
                          value={settings.priceBadgeStyle.backgroundColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              priceBadgeStyle: {
                                ...settings.priceBadgeStyle,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.priceBadgeStyle.backgroundColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              priceBadgeStyle: {
                                ...settings.priceBadgeStyle,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="color"
                          value={settings.priceBadgeStyle.textColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              priceBadgeStyle: {
                                ...settings.priceBadgeStyle,
                                textColor: e.target.value,
                              },
                            })
                          }
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.priceBadgeStyle.textColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              priceBadgeStyle: {
                                ...settings.priceBadgeStyle,
                                textColor: e.target.value,
                              },
                            })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Font Size</Label>
                      <Slider
                        value={[settings.priceBadgeStyle.fontSize]}
                        onValueChange={([fontSize]) =>
                          setSettings({
                            ...settings,
                            priceBadgeStyle: {
                              ...settings.priceBadgeStyle,
                              fontSize,
                            },
                          })
                        }
                        min={12}
                        max={48}
                        step={2}
                        className="mt-2"
                      />
                      <span className="text-sm text-gray-500">
                        {settings.priceBadgeStyle.fontSize}px
                      </span>
                    </div>

                    <div>
                      <Label>Badge Width</Label>
                      <Slider
                        value={[settings.pricePosition.width]}
                        onValueChange={([width]) =>
                          setSettings({
                            ...settings,
                            pricePosition: {
                              ...settings.pricePosition,
                              width,
                            },
                          })
                        }
                        min={80}
                        max={200}
                        step={10}
                        className="mt-2"
                      />
                      <span className="text-sm text-gray-500">
                        {settings.pricePosition.width}px
                      </span>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Border Tab */}
              <TabsContent value="border" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="border-enabled"
                    checked={settings.borderEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        borderEnabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="border-enabled">Enable Border</Label>
                </div>

                {settings.borderEnabled && (
                  <>
                    <div>
                      <Label>Border Width</Label>
                      <Slider
                        value={[settings.borderWidth]}
                        onValueChange={([borderWidth]) =>
                          setSettings({ ...settings, borderWidth })
                        }
                        min={1}
                        max={20}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-sm text-gray-500">
                        {settings.borderWidth}px
                      </span>
                    </div>

                    <div>
                      <Label>Border Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="color"
                          value={settings.borderColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              borderColor: e.target.value,
                            })
                          }
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.borderColor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              borderColor: e.target.value,
                            })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Card>
  )
}
