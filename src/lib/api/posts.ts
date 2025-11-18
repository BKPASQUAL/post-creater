import { createClient } from '@/lib/supabase/client'
import type { Post, PostInsert, PostUpdate } from '@/types/database'

export async function createPost(post: PostInsert): Promise<Post | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    return null
  }

  return data
}

export async function updatePost(id: string, updates: PostUpdate): Promise<Post | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return null
  }

  return data
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return false
  }

  return true
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data
}

export async function getAllPosts(limit: number = 50): Promise<Post[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data
}

export async function getPublishedPosts(limit: number = 50): Promise<Post[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching published posts:', error)
    return []
  }

  return data
}

export async function uploadImage(file: File, path: string): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function uploadImageFromDataUrl(
  dataUrl: string,
  filename: string
): Promise<string | null> {
  // Convert data URL to blob
  const response = await fetch(dataUrl)
  const blob = await response.blob()

  // Create a file from the blob
  const file = new File([blob], filename, { type: 'image/png' })

  // Upload the file
  return uploadImage(file, `${Date.now()}-${filename}`)
}

export async function deleteImage(path: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from('post-images')
    .remove([path])

  if (error) {
    console.error('Error deleting image:', error)
    return false
  }

  return true
}
