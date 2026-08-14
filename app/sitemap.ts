import type { MetadataRoute } from "next";
import { tunings } from "../data/tunings";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || "https://string-tuner.vercel.app"; return tunings.map(({ slug }) => ({ url: `${base}/tuner/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: slug === "guitar-standard" ? 1 : 0.8 })); }
