'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllPosts, deletePost } from '@/lib/api/posts'
import type { Post } from '@/types/database'
import { Trash2, Edit, Eye, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PostsDashboardProps {
  onEditPost?: (post: Post) => void
}

export default function PostsDashboard({ onEditPost }: PostsDashboardProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const fetchedPosts = await getAllPosts()
    setPosts(fetchedPosts)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const success = await deletePost(id)
      if (success) {
        setPosts(posts.filter((post) => post.id !== id))
      }
    }
  }

  const handlePreview = (post: Post) => {
    setSelectedPost(post)
    setIsPreviewOpen(true)
  }

  const handleDownload = (imageUrl: string, postId: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `post-${postId}.png`
    link.click()
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Your Posts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              {/* Post Image */}
              <img
                src={post.processed_image_url || post.original_image_url}
                alt={post.title || 'Post'}
                className="w-full h-full object-cover"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handlePreview(post)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {onEditPost && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEditPost(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleDownload(
                      post.processed_image_url || post.original_image_url,
                      post.id
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Post info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                {post.price && (
                  <div className="text-sm font-bold">${post.price}</div>
                )}
                {post.title && (
                  <div className="text-xs truncate">{post.title}</div>
                )}
                <div className="text-xs text-gray-300">
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title || 'Post Preview'}</DialogTitle>
            {selectedPost?.description && (
              <DialogDescription>{selectedPost.description}</DialogDescription>
            )}
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    selectedPost.processed_image_url ||
                    selectedPost.original_image_url
                  }
                  alt={selectedPost.title || 'Post'}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedPost.price && (
                  <div>
                    <span className="font-semibold">Price:</span> $
                    {selectedPost.price}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Status:</span>{' '}
                  {selectedPost.is_published ? 'Published' : 'Draft'}
                </div>
                <div>
                  <span className="font-semibold">Border:</span>{' '}
                  {selectedPost.border_enabled ? 'Enabled' : 'Disabled'}
                </div>
                <div>
                  <span className="font-semibold">Background:</span>{' '}
                  {selectedPost.has_white_background ? 'White' : 'Original'}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
