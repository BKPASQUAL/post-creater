// Alternative background removal using Remove.bg API
// More reliable than browser-based AI
// Free tier: 50 images/month
// Sign up at: https://www.remove.bg/api

export async function removeBackgroundWithAPI(imageDataUrl: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY

  if (!apiKey) {
    throw new Error('Remove.bg API key not configured. Add NEXT_PUBLIC_REMOVEBG_API_KEY to .env.local')
  }

  try {
    console.log('Using Remove.bg API for background removal...')

    // Convert data URL to blob
    const response = await fetch(imageDataUrl)
    const blob = await response.blob()

    // Create form data
    const formData = new FormData()
    formData.append('image_file', blob)
    formData.append('size', 'auto')

    // Call Remove.bg API
    const apiResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    })

    if (!apiResponse.ok) {
      const error = await apiResponse.json()
      throw new Error(`Remove.bg API error: ${error.errors?.[0]?.title || 'Unknown error'}`)
    }

    // Get the result blob
    const resultBlob = await apiResponse.blob()

    // Convert to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(resultBlob)
    })
  } catch (error) {
    console.error('Remove.bg API failed:', error)
    throw error
  }
}

export async function removeBackgroundAndAddWhiteAPI(
  imageUrl: string,
  width: number = 1080,
  height: number = 1080
): Promise<string> {
  try {
    // Remove background using API
    const removedBgUrl = await removeBackgroundWithAPI(imageUrl)

    // Add white background using canvas
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { alpha: false })

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
      img.onload = () => {
        // Calculate scaling to fit image within canvas
        const maxWidth = width * 0.9
        const maxHeight = height * 0.9
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale

        // Center the image
        const x = (width - scaledWidth) / 2
        const y = (height - scaledHeight) / 2

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
        resolve(canvas.toDataURL('image/png', 1.0))
      }

      img.onerror = reject
      img.src = removedBgUrl
    })
  } catch (error) {
    console.error('API background removal failed:', error)
    throw error
  }
}
