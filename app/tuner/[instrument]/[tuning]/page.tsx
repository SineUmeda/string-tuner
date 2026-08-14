import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Tuner from "../../../../components/Tuner";
import { allTunings, getInstrument, getTuning } from "../../../../data/tunings";

export const dynamicParams = false;
export function generateStaticParams() { return allTunings.map(({ instrument, tuning }) => ({ instrument: instrument.slug, tuning: tuning.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ instrument: string; tuning: string }> }): Promise<Metadata> {
  const values = await params; const instrument = getInstrument(values.instrument); const tuning = getTuning(values.instrument, values.tuning);
  if (!instrument || !tuning) return {};
  const title = `${instrument.name} ${tuning.name} チューナー｜無料・ブラウザ対応`;
  const description = `${tuning.description} マイクですぐ使える無料のオンライン${instrument.name}チューナー。各弦の目標音と周波数を表示し、クロマチック測定にも対応。`;
  const canonical = `/tuner/${instrument.slug}/${tuning.slug}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, locale: "ja_JP", type: "website" }, twitter: { card: "summary", title, description } };
}

export default async function TuningPage({ params }: { params: Promise<{ instrument: string; tuning: string }> }) {
  const values = await params; const instrument = getInstrument(values.instrument); const tuning = getTuning(values.instrument, values.tuning);
  if (!instrument || !tuning) notFound();
  return <Tuner instrument={instrument} tuning={tuning}/>;
}
