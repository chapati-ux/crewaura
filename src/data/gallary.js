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

import g1 from '../assets/images/gallery/c3.webp'
import g2 from '../assets/images/gallery/c2.webp'
import g3 from '../assets/images/gallery/g2.webp'
import g4 from '../assets/images/gallery/g3.webp'
import g5 from '../assets/images/gallery/g10.webp'
import g6 from '../assets/images/gallery/c1.webp'
import g7 from '../assets/images/gallery/g5.webp'
import g8 from '../assets/images/gallery/g4.jpg'
import g9 from '../assets/images/gallery/21.webp'
import g10 from '../assets/images/hero/g19.webp'
import g11 from '../assets/images/hero/g23.webp'
import g12 from '../assets/images/hero/g19.webp'
import g13 from '../assets/images/hero/hero1.webp'
import g14 from '../assets/images/hero/g22.webp'
import g15 from '../assets/images/gallery/g1.webp'
import g16 from '../assets/images/gallery/g12.webp'
import g17 from '../assets/images/gallery/g11.webp'
import g18 from '../assets/images/gallery/g13.webp'
import g19 from '../assets/images/gallery/g14.webp'
import g20 from '../assets/images/gallery/g6.webp'
import g21 from '../assets/images/gallery/g7.webp'
import g22 from '../assets/images/gallery/g8.webp'
import g23 from '../assets/images/gallery/g9.webp'
import g24 from '../assets/images/gallery/g15.webp'
import g25 from '../assets/images/gallery/g20.webp'
import g26 from '../assets/images/gallery/g21.webp'

const galleryItems = [
  {
  id: 1,
  media: "image",
  title: "The Grand Hall",
  aspect: "aspect-[4/5]",
  img: g1,
  tag: "Architecture",
  year: "2026",
},
{
  id: 2,
  media: "image",
  title: "Ethereal Flora",
  aspect: "aspect-[3/4]",
  img: g2,
  tag: "Botanical",
  year: "2026",
},
{
  id: 3,
  media: "image",
  title: "Golden Hour Silhouette",
  aspect: "aspect-square",
  img: g3,
  tag: "Candid",
  year: "2026",
},
{
  id: 4,
  media: "image",
  title: "Velvet Details",
  aspect: "aspect-[2/3]",
  img: g4,
  tag: "Texture",
  year: "2026",
},
{
  id: 5,
  media: "image",
  title: "The Banquet Setting",
  aspect: "aspect-[4/5]",
  img: g5,
  tag: "Design",
  year: "2026",
},
{
  id: 6,
  media: "image",
  title: "Starlit Aisle",
  aspect: "aspect-[3/4]",
  img: g6,
  tag: "Lighting",
  year: "2026",
},
{
  id: 7,
  media: "image",
  title: "The Bridal Bouquet",
  aspect: "aspect-[3/4]",
  img: g7,
  tag: "Botanical",
  year: "2026",
},
{
  id: 8,
  media: "image",
  title: "Table for Two",
  aspect: "aspect-square",
  img: g8,
  tag: "Design",
  year: "2026",
},
{
  id: 9,
  media: "image",
  title: "The First Look",
  aspect: "aspect-[4/5]",
  img: g9,
  tag: "Candid",
  year: "2026",
},
 {
  id: 10,
  media: "image",
  title: "Elegant Couple Portrait",
  aspect: "aspect-[4/5]",
  img: g10,
  tag: "Portrait",
  year: "2026",
},
{
  id: 11,
  media: "image",
  title: "Romantic Moments",
  aspect: "aspect-[3/4]",
  img: g11,
  tag: "Couple",
  year: "2026",
},
{
  id: 12,
  media: "image",
  title: "Timeless Memories",
  aspect: "aspect-square",
  img: g12,
  tag: "Wedding",
  year: "2026",
},
{
  id: 13,
  media: "image",
  title: "Wedding Celebration",
  aspect: "aspect-[4/5]",
  img: g13,
  tag: "Celebration",
  year: "2026",
},
{
  id: 14,
  media: "image",
  title: "Luxury Venue",
  aspect: "aspect-[3/4]",
  img: g14,
  tag: "Venue",
  year: "2026",
},
{
  id: 15,
  media: "image",
  title: "Floral Decor",
  aspect: "aspect-square",
  img: g15,
  tag: "Decor",
  year: "2026",
},
{
  id: 16,
  media: "image",
  title: "Wedding Moments",
  aspect: "aspect-[4/5]",
  img: g16,
  tag: "Moments",
  year: "2026",
},
{
  id: 17,
  media: "image",
  title: "Bride & Groom",
  aspect: "aspect-[3/4]",
  img: g17,
  tag: "Couple",
  year: "2026",
},
{
  id: 18,
  media: "image",
  title: "Reception Decor",
  aspect: "aspect-square",
  img: g18,
  tag: "Reception",
  year: "2026",
},
{
  id: 19,
  media: "image",
  title: "Elegant Entrance",
  aspect: "aspect-[4/5]",
  img: g19,
  tag: "Entrance",
  year: "2026",
},
{
  id: 20,
  media: "image",
  title: "Garden Wedding",
  aspect: "aspect-[3/4]",
  img: g20,
  tag: "Garden",
  year: "2026",
},
{
  id: 21,
  media: "image",
  title: "Beautiful Decor",
  aspect: "aspect-square",
  img: g21,
  tag: "Decor",
  year: "2026",
},
{
  id: 22,
  media: "image",
  title: "Wedding Bliss",
  aspect: "aspect-[4/5]",
  img: g22,
  tag: "Love",
  year: "2026",
},
{
  id: 23,
  media: "image",
  title: "Grand Celebration",
  aspect: "aspect-[3/4]",
  img: g23,
  tag: "Celebration",
  year: "2026",
},
{
  id: 24,
  media: "image",
  title: "Wedding Ceremony",
  aspect: "aspect-square",
  img: g24,
  tag: "Ceremony",
  year: "2026",
},
{
  id: 25,
  media: "image",
  title: "Luxury Stage",
  aspect: "aspect-[4/5]",
  img: g25,
  tag: "Stage",
  year: "2026",
},
{
  id: 26,
  media: "image",
  title: "Forever Together",
  aspect: "aspect-[3/4]",
  img: g26,
  tag: "Love",
  year: "2026",
},
];

export default galleryItems;