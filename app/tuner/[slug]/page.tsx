import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Tuner from "../../../components/Tuner";
import { getTuning, tunings } from "../../../data/tunings";

export const dynamicParams = false;
export function generateStaticParams() { return tunings.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const tuning = getTuning(slug); if (!tuning) return {};
  return { title: tuning.name, description: `${tuning.description} マイクだけで使える無料・広告なしのWebチューナー。`, alternates: { canonical: `/tuner/${slug}` }, openGraph: { title: tuning.name, url: `/tuner/${slug}` } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const tuning = getTuning(slug); if (!tuning) notFound(); return <Tuner tuning={tuning} />; }
