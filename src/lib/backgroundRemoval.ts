import { removeBackground } from '@imgly/background-removal'

export async function removeImageBackground(imageUrl: string): Promise<string> {
  try {
    console.log('Starting browser-based background removal...')
    console.log('Note: This method is experimental and may fail. Consider using Remove.bg API instead.')

    const blob = await removeBackground(imageUrl, {
      publicPath: '/models/',
      debug: false,
      output: {
        format: 'image/png',
        quality: 1.0,
        type: 'foreground',
      }
    })

    console.log('Background removal completed successfully')
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Browser background removal failed:', error)
    throw new Error('Browser-based background removal is not available. Please use Remove.bg API for reliable results.')
  }
}

export async function addWhiteBackground(
  imageUrl: string,
  width: number = 1080,
  height: number = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: false })

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    canvas.width = width
    canvas.height = height

    // Fill with pure white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      console.log(`Image loaded: ${img.width}x${img.height}`)

      // Calculate scaling to fit image within canvas while maintaining aspect ratio
      // Add some padding (90% of canvas size)
      const maxWidth = width * 0.9
      const maxHeight = height * 0.9
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // Center the image
      const x = (width - scaledWidth) / 2
      const y = (height - scaledHeight) / 2

      console.log(`Drawing image at: ${x}, ${y}, ${scaledWidth}x${scaledHeight}`)

      // Draw the image with transparency support
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

      const result = canvas.toDataURL('image/png', 1.0)
      console.log('White background added successfully')
      resolve(result)
    }

    img.onerror = (error) => {
      console.error('Failed to load image for white background:', error)
      reject(new Error('Failed to load image'))
    }

    img.src = imageUrl
  })
}

export async function removeBackgroundAndAddWhite(
  imageUrl: string,
  width: number = 1080,
  height: number = 1080
): Promise<string> {
  try {
    console.log('Step 1: Removing background from image...')
    const removedBgUrl = await removeImageBackground(imageUrl)

    console.log('Step 2: Adding white background...')
    const finalUrl = await addWhiteBackground(removedBgUrl, width, height)

    console.log('Process completed successfully!')
    return finalUrl
  } catch (error) {
    console.error('Error in removeBackgroundAndAddWhite:', error)
    throw error
  }
}
