'use client'

import { useState } from 'react'
import ImageCapture from '@/components/ImageCapture'
import ImageEditor, { EditorSettings } from '@/components/ImageEditor'
import PostsDashboard from '@/components/PostsDashboard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { removeBackgroundAndAddWhite } from '@/lib/backgroundRemoval'
import { createPost, uploadImageFromDataUrl, updatePost } from '@/lib/api/posts'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import type { Post } from '@/types/database'

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [useBackgroundRemoval, setUseBackgroundRemoval] = useState(true) // Enable by default

  const handleImageCapture = async (imageUrl: string, skipProcessing: boolean = false) => {
    setCurrentImage(imageUrl)

    // Skip background removal for faster workflow
    if (skipProcessing || !useBackgroundRemoval) {
      setProcessedImage(imageUrl)
      return
    }

    setIsProcessing(true)

    try {
      console.log('Starting background removal process...')
      // Remove background and add white background (slow AI process)
      const processed = await removeBackgroundAndAddWhite(imageUrl)
      console.log('Background removal successful!')
      setProcessedImage(processed)
    } catch (error) {
      console.error('Failed to process image:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to process image: ${errorMessage}\n\nUsing original image instead. Check browser console for details.`)
      setProcessedImage(imageUrl)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSavePost = async (editedImage: string, settings: EditorSettings) => {
    setIsProcessing(true)

    try {
      // Upload images to Supabase
      const originalUrl = await uploadImageFromDataUrl(
        currentImage!,
        'original.png'
      )
      const processedUrl = await uploadImageFromDataUrl(
        editedImage,
        'processed.png'
      )

      let logoUrl = settings.companyLogoUrl
      if (logoUrl && logoUrl.startsWith('data:')) {
        logoUrl = await uploadImageFromDataUrl(logoUrl, 'logo.png')
      }

      if (!originalUrl || !processedUrl) {
        alert('Failed to upload images')
        return
      }

      const postData = {
        original_image_url: originalUrl,
        processed_image_url: processedUrl,
        has_white_background: true,
        company_logo_url: logoUrl,
        company_logo_position: settings.logoPosition,
        price: settings.price ? parseFloat(settings.price) : null,
        price_badge_position: settings.pricePosition,
        price_badge_style: settings.priceBadgeStyle,
        border_enabled: settings.borderEnabled,
        border_width: settings.borderWidth,
        border_color: settings.borderColor,
        border_style: settings.borderStyle,
        is_published: false,
      }

      if (editingPost) {
        await updatePost(editingPost.id, postData)
        alert('Post updated successfully!')
      } else {
        await createPost(postData)
        alert('Post created successfully!')
      }

      // Reset state
      setCurrentImage(null)
      setProcessedImage(null)
      setEditingPost(null)
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setCurrentImage(post.original_image_url)
    setProcessedImage(post.processed_image_url || post.original_image_url)
    setActiveTab('create')
  }

  const handleNewPost = () => {
    setCurrentImage(null)
    setProcessedImage(null)
    setEditingPost(null)
    setActiveTab('create')
  }

  const handleRemoveBackground = async () => {
    if (!currentImage) return

    setIsProcessing(true)
    setProcessedImage(null) // Clear current preview

    try {
      const processed = await removeBackgroundAndAddWhite(currentImage)
      setProcessedImage(processed)
    } catch (error) {
      console.error('Failed to process image:', error)
      alert('Failed to remove background. Please try again.')
      setProcessedImage(currentImage) // Restore original on error
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Post Creator Pro
              </h1>
            </div>
            {activeTab === 'dashboard' && (
              <Button onClick={handleNewPost}>Create New Post</Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="dashboard">My Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {!currentImage && !isProcessing && (
              <>
                <div className="max-w-2xl mx-auto mb-4">
                  <div className={`${useBackgroundRemoval ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4`}>
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="bg-removal"
                        checked={useBackgroundRemoval}
                        onChange={(e) => setUseBackgroundRemoval(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <label htmlFor="bg-removal" className={`font-semibold ${useBackgroundRemoval ? 'text-green-900' : 'text-gray-900'} cursor-pointer`}>
                          🎨 Remove Background & Add White Background
                        </label>
                        <p className={`text-sm mt-1 ${useBackgroundRemoval ? 'text-green-700' : 'text-gray-600'}`}>
                          {useBackgroundRemoval
                            ? '✓ AI will remove the background from your product and add a clean white background. First use takes 10-30 seconds.'
                            : 'Unchecked - Images will be used as-is without background removal.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ImageCapture onImageCapture={handleImageCapture} />
              </>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-gray-900 font-semibold text-lg">
                  🎨 Removing Background...
                </p>
                <p className="text-gray-600">
                  AI is removing the background from your product
                </p>
                <p className="text-sm text-gray-500">
                  First use: 10-30 seconds (downloading AI model)
                </p>
                <div className="max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900">
                    <strong>What's happening:</strong>
                  </p>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                    <li>AI identifies your product/item</li>
                    <li>Removes the background completely</li>
                    <li>Adds a clean white background</li>
                  </ul>
                </div>
              </div>
            )}

            {processedImage && !isProcessing && (
              <ImageEditor
                imageUrl={processedImage}
                onSave={handleSavePost}
                onRemoveBackground={!useBackgroundRemoval ? handleRemoveBackground : undefined}
              />
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            <PostsDashboard onEditPost={handleEditPost} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Post Creator Pro - Create stunning product posts with ease
          </p>
        </div>
      </footer>
    </div>
  )
}
