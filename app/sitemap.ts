import type { MetadataRoute } from "next";
import { allTunings } from "../data/tunings";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://string-tuner.vercel.app";

  return [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...allTunings.map(({ instrument, tuning }) => ({
      url: `${base}/tuner/${instrument.slug}/${tuning.slug}`,
      changeFrequency: "monthly" as const,
      priority:
        instrument.slug === "guitar" && tuning.slug === "standard"
          ? 0.9
          : 0.8,
    })),
  ];
}