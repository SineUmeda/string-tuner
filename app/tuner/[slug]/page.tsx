import { notFound, redirect } from "next/navigation";
import { getLegacyTuning } from "../../../data/tunings";

export default async function LegacyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getLegacyTuning(slug);
  if (!found) notFound();
  redirect(`/tuner/${found.instrument.slug}/${found.tuning.slug}`);
}
