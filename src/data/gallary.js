// gallery.js
// media: "image" | "video"
// For videos: `img` is used as the poster/thumbnail, `src` is the video file.
//
// NOTE: the video `src` values below point to Google's public test-video bucket
// (storage.googleapis.com/gtv-videos-bucket) — these are real, playable,
// CORS-open .mp4 files, but they are generic stock/demo clips, NOT actual
// wedding footage (there's no free wedding-specific video CDN to pull from).
// Swap `src` for your own hosted wedding clips before going live:
//   - Local: drop files into `public/videos/` and use "/videos/yourfile.mp4"
//   - Hosted: use a direct .mp4 URL from Cloudinary, S3, Mux, Bunny, etc.

const galleryItems = [
  {
    id: 1,
    media: "image",
    title: "The Grand Hall",
    aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
    tag: "Architecture",
    year: "2026",
  },
  {
    id: 2,
    media: "image",
    title: "Ethereal Flora",
    aspect: "aspect-[3/4]",
    img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    tag: "Botanical",
    year: "2025",
  },
  {
    id: 3,
    media: "image",
    title: "Golden Hour Silhouette",
    aspect: "aspect-square",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    tag: "Candid",
    year: "2026",
  },
  {
    id: 4,
    media: "image",
    title: "Velvet Details",
    aspect: "aspect-[2/3]",
    img: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=80",
    tag: "Texture",
    year: "2026",
  },
  {
    id: 5,
    media: "image",
    title: "The Banquet Setting",
    aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1546032996-6dfacbaccd36?auto=format&fit=crop&w=800&q=80",
    tag: "Design",
    year: "2025",
  },
  {
    id: 6,
    media: "image",
    title: "Starlit Aisle",
    aspect: "aspect-[3/4]",
    img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
    tag: "Lighting",
    year: "2026",
  },
  {
    id: 7,
    media: "image",
    title: "The Bridal Bouquet",
    aspect: "aspect-[3/4]",
    img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    tag: "Botanical",
    year: "2026",
  },
  {
    id: 8,
    media: "image",
    title: "Table for Two",
    aspect: "aspect-square",
    img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    tag: "Design",
    year: "2025",
  },
  {
    id: 9,
    media: "image",
    title: "The First Look",
    aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    tag: "Candid",
    year: "2026",
  },
  {
    id: 10,
    media: "video",
    title: "First Dance",
    aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    tag: "Reception",
    year: "2026",
  },
  {
    id: 11,
    media: "video",
    title: "Walking Down the Aisle",
    aspect: "aspect-[3/4]",
    img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    tag: "Ceremony",
    year: "2026",
  },
  {
    id: 12,
    media: "video",
    title: "Golden Confetti Exit",
    aspect: "aspect-square",
    img: "https://images.unsplash.com/photo-1509610973-7dd8b0e35de3?auto=format&fit=crop&w=800&q=80",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    tag: "Celebration",
    year: "2025",
  },
];

export default galleryItems;