# Post Creator Pro

A powerful Next.js application for creating professional product posts with automatic background removal, custom branding, and price badges - perfect for e-commerce and social media marketing.

## Features

- 📸 **Camera Capture & Upload**: Take photos directly or upload images
- 🎨 **Background Removal**: Automatic background removal with white background
- 🏢 **Company Logo**: Add your company logo to the top-left corner
- 💰 **Price Badge**: Add customizable price badges to the bottom-right
- 🖼️ **Border Customization**: Add borders with custom colors and widths
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 💾 **Post Management**: View, edit, and manage all your posts
- ☁️ **Cloud Storage**: All images stored securely in Supabase

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Database + Storage)
- **Image Processing**: @imgly/background-removal, HTML Canvas API
- **Camera**: react-webcam

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd post-creater
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** > **API** and copy:
   - Project URL
   - Anon/Public Key
   - Service Role Key (optional, for admin operations)

3. Run the database schema:
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Paste and run it

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Creating a Post

1. **Capture/Upload Image**
   - Click "Open Camera" to take a photo
   - Or click "Upload Image" to select from your device
   - Switch between front/back camera on mobile

2. **Automatic Processing**
   - Background is automatically removed
   - White background is added
   - Image is optimized for social media (1080x1080)

3. **Customize Your Post**
   - **Logo Tab**: Upload your company logo and adjust size/position
   - **Price Tab**: Add a price badge with custom colors and styling
   - **Border Tab**: Enable borders and customize color/width

4. **Save & Download**
   - Click "Save Post" to store in your dashboard
   - Click "Download" to save directly to your device

### Managing Posts

1. Navigate to the "My Posts" tab
2. Hover over any post to:
   - **Preview**: View full details
   - **Edit**: Modify settings and re-save
   - **Download**: Save to device
   - **Delete**: Remove permanently

## Database Schema

The app uses a single `posts` table with the following structure:

```sql
- id (UUID): Primary key
- created_at/updated_at (Timestamp): Auto-managed
- original_image_url (Text): Original uploaded image
- processed_image_url (Text): Final edited image
- company_logo_url (Text): Logo image URL
- logo_position (JSONB): Logo placement coordinates
- price (Decimal): Product price
- price_badge_position (JSONB): Badge placement
- price_badge_style (JSONB): Badge styling options
- border_enabled (Boolean): Border toggle
- border_width/color/style: Border properties
- title/description (Text): Optional metadata
- tags (Array): Optional categorization
- is_published (Boolean): Publication status
```

## Customization

### Styling

The app uses Tailwind CSS. Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      // Add your brand colors
    }
  }
}
```

### Default Settings

Modify default editor settings in `src/components/ImageEditor.tsx`:

```typescript
const [settings, setSettings] = useState<EditorSettings>({
  logoPosition: { x: 20, y: 20, width: 100, height: 100 },
  pricePosition: { x: -140, y: -80, width: 120, height: 60 },
  // ... customize defaults
})
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

### Deploy to Other Platforms

The app can be deployed anywhere that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Troubleshooting

### Background Removal Issues

The background removal library runs in the browser and may take a few seconds. If it fails:
- Check browser console for errors
- Ensure image is not too large (< 5MB recommended)
- Try a different browser (Chrome/Edge work best)

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase project is active
- Ensure database schema was run successfully
- Check Row Level Security (RLS) policies

### Camera Not Working

- Ensure HTTPS is enabled (required for camera access)
- Grant camera permissions in browser
- Check browser compatibility (modern browsers only)

## Project Structure

```
post-creater/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ImageCapture.tsx  # Camera/upload component
│   │   ├── ImageEditor.tsx   # Post customization editor
│   │   ├── PostsDashboard.tsx # Post management
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── api/
│   │   │   └── posts.ts      # Supabase API functions
│   │   ├── supabase/
│   │   │   ├── client.ts     # Browser client
│   │   │   └── server.ts     # Server client
│   │   ├── backgroundRemoval.ts # Image processing
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── database.ts       # TypeScript types
├── supabase-schema.sql       # Database setup
└── package.json
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review Supabase and Next.js documentation

## Future Enhancements

- [ ] User authentication
- [ ] Multiple logo presets
- [ ] Batch processing
- [ ] Template library
- [ ] Social media integration
- [ ] AI-powered text generation
- [ ] Export to multiple formats
- [ ] Collaborative editing

---

Built with ❤️ using Next.js and Supabase
