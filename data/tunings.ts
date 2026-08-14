export type Tuning = {
  slug: string;
  instrument: "guitar";
  name: string;
  shortName: string;
  description: string;
  strings: { note: string; frequency: number }[];
};

export const tunings: Tuning[] = [
  { slug: "guitar-standard", instrument: "guitar", name: "ギター Standard チューナー", shortName: "Standard", description: "6弦 E2–1弦 E4の標準チューニング。", strings: [{note:"E2",frequency:82.41},{note:"A2",frequency:110},{note:"D3",frequency:146.83},{note:"G3",frequency:196},{note:"B3",frequency:246.94},{note:"E4",frequency:329.63}] },
  { slug: "guitar-drop-d", instrument: "guitar", name: "ギター Drop D チューナー", shortName: "Drop D", description: "6弦だけをD2へ下げるドロップD。", strings: [{note:"D2",frequency:73.42},{note:"A2",frequency:110},{note:"D3",frequency:146.83},{note:"G3",frequency:196},{note:"B3",frequency:246.94},{note:"E4",frequency:329.63}] },
  { slug: "guitar-half-step-down", instrument: "guitar", name: "ギター 半音下げチューナー", shortName: "半音下げ", description: "全弦をStandardより半音下げたチューニング。", strings: [{note:"E♭2",frequency:77.78},{note:"A♭2",frequency:103.83},{note:"D♭3",frequency:138.59},{note:"G♭3",frequency:185},{note:"B♭3",frequency:233.08},{note:"E♭4",frequency:311.13}] },
];

export const getTuning = (slug: string) => tunings.find((item) => item.slug === slug);
