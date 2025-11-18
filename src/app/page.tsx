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
  const [useBackgroundRemoval, setUseBackgroundRemoval] = useState(false)

  const handleImageCapture = async (imageUrl: string, skipProcessing: boolean = false) => {
    setCurrentImage(imageUrl)

    // Skip background removal for faster workflow
    if (skipProcessing || !useBackgroundRemoval) {
      setProcessedImage(imageUrl)
      return
    }

    setIsProcessing(true)

    try {
      // Remove background and add white background (slow AI process)
      const processed = await removeBackgroundAndAddWhite(imageUrl)
      setProcessedImage(processed)
    } catch (error) {
      console.error('Failed to process image:', error)
      alert('Failed to process image. Using original instead.')
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="bg-removal"
                        checked={useBackgroundRemoval}
                        onChange={(e) => setUseBackgroundRemoval(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <label htmlFor="bg-removal" className="font-medium text-blue-900 cursor-pointer">
                          Enable AI Background Removal (Slower)
                        </label>
                        <p className="text-sm text-blue-700 mt-1">
                          {useBackgroundRemoval
                            ? '⚠️ This will take 10-30 seconds on first use (downloads AI model). Uncheck for instant results.'
                            : '✓ Fast mode enabled - Upload and edit images instantly!'}
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
                <p className="text-gray-600 font-medium">
                  Removing background with AI...
                </p>
                <p className="text-sm text-gray-500">
                  This may take 10-30 seconds on first use (downloading model)
                </p>
              </div>
            )}

            {processedImage && !isProcessing && (
              <ImageEditor
                imageUrl={processedImage}
                onSave={handleSavePost}
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
