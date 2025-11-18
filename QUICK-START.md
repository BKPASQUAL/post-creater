# Quick Start Guide 🚀

## ⚡ Fastest Way to Start (Recommended)

### Use Without Background Removal

**Works instantly - NO setup needed!**

1. **Leave the checkbox UNCHECKED** (default)
2. **Upload your product photo**
3. **Add your logo** (top-left)
4. **Add price badge** (bottom-right)
5. **Add border** (optional)
6. **Save and download!**

✅ Takes 10 seconds
✅ No API keys required
✅ Zero configuration

---

## 🎨 If You Need Background Removal

### Option 1: Use Remove.bg Website (Manual)

1. Go to https://www.remove.bg
2. Upload your product photo
3. Download the result (50 free per month)
4. Upload to this app
5. Add logo, price, borders

**Alternative online tools:**
- https://www.photoroom.com
- Photoshop / Photopea / GIMP (manual)

---

### Option 2: Use Remove.bg API (Automatic) ⭐

**For automatic background removal in the app:**

### Step 1: Get API Key (Free)
1. Go to https://www.remove.bg/api
2. Click "Get API Key"
3. Sign up (it's free!)
4. Copy your API key

### Step 2: Add to Your App
1. In your project, create `.env.local` file:
   ```
   NEXT_PUBLIC_REMOVEBG_API_KEY=your-key-here
   ```
2. Restart the server: `npm run dev`

### Step 3: Use It
1. **Check the checkbox** for background removal
2. Upload any product photo
3. Wait 2-5 seconds
4. Perfect white background added automatically!

**Free Tier:** 50 images/month

---

## Recommended Workflow 💡

### For Quick Posts (No Setup):
```
Upload → Add Logo → Add Price → Save
```
Takes: **10 seconds**

### For Professional Posts (With API):
```
Check BG Removal → Upload → Wait → Add Logo → Add Price → Save
```
Takes: **30 seconds**

### First Time Users:
```
1. Try without background removal first
2. Get comfortable with logo/price/border tools
3. Then add Remove.bg API later for automatic BG removal
```

---

## Troubleshooting 🔧

### "Background removal failed"
→ **Solution:** Uncheck the background removal box and use the app without it!

### "Can't remove background"
→ **Solution:** Use remove.bg website manually, then upload the processed image

### "Too slow"
→ **Solution:** Don't use background removal - upload and edit instantly!

---

## Summary

**You DON'T need background removal to use this app!**

The app works perfectly for:
- Adding company logos
- Adding price badges
- Adding custom borders
- Creating professional posts

Background removal is **optional** and requires either:
1. Manual preprocessing (free online tools)
2. Remove.bg API (50 free/month)

**Start simple, add features later!** 🎯
