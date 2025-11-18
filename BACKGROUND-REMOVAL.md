# Background Removal Guide

This app supports **two methods** for removing backgrounds from product images:

## Method 1: Remove.bg API (Recommended) ⭐

**Best for:** Production use, reliable results, professional quality

### Setup:

1. **Sign up** at [Remove.bg](https://www.remove.bg/api)
2. **Get your API key** (Free tier: 50 images/month)
3. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_REMOVEBG_API_KEY=your-api-key-here
   ```
4. **Restart your dev server:** `npm run dev`

### Pros:
- ✅ **Highly accurate** - Industry-leading AI
- ✅ **Fast** - Processes in 2-5 seconds
- ✅ **Reliable** - Works every time
- ✅ **Server-side** - No model downloads

### Cons:
- ⚠️ Requires API key
- ⚠️ Limited free tier (50/month)
- ⚠️ Paid after free tier ($0.20/image)

---

## Method 2: Browser-Based AI (Fallback)

**Best for:** Testing, development, no API key needed

### Setup:
- **No setup required!** Works out of the box
- Automatically used if Remove.bg API key is not configured

### Pros:
- ✅ **Free** - Unlimited usage
- ✅ **No signup** - Works immediately
- ✅ **Privacy** - All processing in browser

### Cons:
- ⚠️ **Slow first use** - Downloads 50MB AI model
- ⚠️ **Less accurate** - May miss edges
- ⚠️ **Memory intensive** - Can crash on large images
- ⚠️ **Browser-dependent** - Works best in Chrome

---

## How It Works

The app automatically tries **Remove.bg API first** (if configured), then **falls back to browser AI** if:
- No API key is set
- API fails or has errors
- API quota is exceeded

---

## Usage Tips

### For Best Results:

1. **Use good lighting** - Clear, bright product photos
2. **Simple backgrounds** - Plain backgrounds work best
3. **High contrast** - Product should stand out from background
4. **Moderate size** - 1-5MB images work best

### Troubleshooting:

**Background removal fails?**
- Check browser console (F12) for errors
- Try a smaller image (<2MB)
- Use Chrome/Edge browser
- Get a Remove.bg API key

**Too slow?**
- Uncheck "Remove Background" for instant uploads
- Add logo/price/borders to original images
- Remove background later using the editor button

**API errors?**
- Check your API key is correct
- Verify you haven't exceeded quota
- Check [Remove.bg status](https://status.remove.bg/)

---

## Without Background Removal

The app works perfectly **without background removal**:

1. Uncheck the background removal option
2. Upload images instantly
3. Add logo, price badges, and borders
4. Create professional posts immediately

You can always remove backgrounds later using the **"Remove Background & Add White"** button in the editor!

---

## Pricing

### Remove.bg API:
- **Free Tier:** 50 images/month
- **Subscription:** From $9/month for 500 images
- **Pay-as-you-go:** $0.20 per image
- [View Pricing](https://www.remove.bg/pricing)

### Browser AI:
- **Always Free** - No cost ever
- May use more battery/CPU

---

## Recommendations

**For Testing/Personal Use:**
- Use browser AI (free, no setup)

**For Production/Business:**
- Use Remove.bg API (reliable, fast, accurate)
- Consider subscription if >50 images/month

**For Maximum Flexibility:**
- Configure Remove.bg API as primary
- Browser AI as automatic fallback
- Manual option available in editor
