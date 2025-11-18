import { removeBackground } from '@imgly/background-removal'

export async function removeImageBackground(imageUrl: string): Promise<string> {
  try {
    const blob = await removeBackground(imageUrl, {
      output: {
        format: 'image/png',
        quality: 0.9,
      },
    })

    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Background removal failed:', error)
    throw new Error('Failed to remove background')
  }
}

export async function addWhiteBackground(
  imageUrl: string,
  width: number = 1080,
  height: number = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    canvas.width = width
    canvas.height = height

    // Fill with white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Calculate scaling to fit image within canvas while maintaining aspect ratio
      const scale = Math.min(width / img.width, height / img.height)
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // Center the image
      const x = (width - scaledWidth) / 2
      const y = (height - scaledHeight) / 2

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = () => {
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
  const removedBgUrl = await removeImageBackground(imageUrl)
  const finalUrl = await addWhiteBackground(removedBgUrl, width, height)
  return finalUrl
}
