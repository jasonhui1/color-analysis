# Color Analysis & Palette Generator

An interactive, full-stack web application built with **Next.js** for extracting, analyzing, and managing color palettes from images. The project features canvas-level image masking, deep-learning-based interactive segmentation via the **Segment Anything Model (SAM)**, real-time edge detection filtering, and comprehensive database management.

---

## 🚀 Features

### 🎨 Color Analysis & Palette Extraction
* **Dominant Color Extraction:** Automatically extracts a configurable number of dominant colors from any uploaded image.
* **Pixel Percentage Distribution:** Calculates the precise percentage coverage for each extracted color in the image.
* **Ignore Palette Filter:** Exclude specific background or noise colors (e.g., white, black, or custom selected colors) from the percentage analysis to focus on relevant content.
* **Interactive Hover Highlighting:** Hovering over colors in the extracted palette highlights matching pixels in real-time on the main image canvas.
* **Triangular Color space indicator:** Displays extracted colors mapped onto a chromatic color triangle.

### 🖼️ Image Editing & Masking
* **Interactive Brush Masking:** Paint masks directly onto the image canvas to analyze specific regions.
* **Segment Anything Model (SAM) Integration:** Perform point-and-click segmentation. Add positive markers (green) or negative markers (red) to interactively segment objects using a connected python-based SAM server.
* **Sobel Edge Detection:** Apply an on-the-fly client-side Sobel edge filter in RGB space to highlight structural boundaries.
* **Crop to Mask & Export:** Crop the image down to the masked boundary (removing transparent regions) and export the final asset directly.

### 📁 Data & Collection Management (`/data`)
* **Saved Palettes Gallery:** View all saved palettes along with their associated images, masks, and percentages.
* **Interactive Compare Tool:** Select multiple saved palettes to compare their color distributions side-by-side.
* **Tagging & Filtering:** Categorize palettes with tags and filter your gallery interactively.
* **Cloud Storage & Sync:** Automatically syncs palette metadata, image uploads, and masks.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js 14 (App & Pages Router hybrid), React 18
* **Styling:** Tailwind CSS
* **Database & Auth:** Supabase (Postgres tables for palettes, tags, and mapping) + Google OAuth Login
* **Cloud Asset Hosting:** Cloudinary (secure image and mask storage)
* **Image Processing:** HTML5 Canvas API, Color Thief, Color Convert
* **AI Segmentation Interface:** Client-side hook connecting to a Python Flask API running a SAM model

---

## 📋 Database Schema

The application connects to a Supabase database with the following table architecture:
1. **`color_palette`:** Stores `id`, `userId`, original `imageURL` (Cloudinary), `maskImageURL` (Cloudinary), original `imageSourceURL`, and the `palette` object (dominant colors, percentages, and ignore list).
2. **`tags`:** Stores unique project categories mapped per `userId`.
3. **`palette_tags`:** A junction table mapping `paletteId` to `tagId` for database relationship integrity.

---

## ⚙️ Setup & Installation

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `color-analysis` directory with the following variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

*Note: Ensure your Python Flask backend is running on `http://localhost:5000` to use the interactive Segment Anything Model (SAM) features.*
