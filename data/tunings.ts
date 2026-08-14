export type StringTarget = { label: string; note: string; frequency: number };

export type Tuning = {
  slug: string;
  name: string;
  description: string;
  strings: StringTarget[];
  note?: string;
};

export type Instrument = {
  slug: string;
  name: string;
  description: string;
  tunings: Tuning[];
};

const SEMITONES: Record<string, number> = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };

export function noteFrequency(note: string) {
  const match = note.match(/^([A-G](?:#|b)?)(-?\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const midi = (Number(match[2]) + 1) * 12 + SEMITONES[match[1]];
  return Number((440 * 2 ** ((midi - 69) / 12)).toFixed(2));
}

const strings = (...notes: string[]): StringTarget[] => notes.map((note, index) => ({ label: `${notes.length - index}弦`, note, frequency: noteFrequency(note) }));
const tuning = (slug: string, name: string, description: string, notes: string[], note?: string): Tuning => ({ slug, name, description, strings: strings(...notes), note });

export const instruments: Instrument[] = [
  { slug: "guitar", name: "ギター", description: "6弦ギターの定番チューニングに対応。", tunings: [
    tuning("standard", "Standard", "6弦ギターの標準チューニング E2–A2–D3–G3–B3–E4。", ["E2","A2","D3","G3","B3","E4"]),
    tuning("drop-d", "Drop D", "6弦だけをD2へ下げるドロップD。", ["D2","A2","D3","G3","B3","E4"]),
    tuning("half-step-down", "半音下げ", "全弦をStandardから半音下げたチューニング。", ["Eb2","Ab2","Db3","Gb3","Bb3","Eb4"]),
    tuning("whole-step-down", "1音下げ", "全弦をStandardから1音下げたチューニング。", ["D2","G2","C3","F3","A3","D4"]),
    tuning("dadgad", "DADGAD", "ケルト音楽やフィンガースタイルで使われるDADGAD。", ["D2","A2","D3","G3","A3","D4"]),
    tuning("open-g", "Open G", "開放弦でGメジャーになるオープンG。", ["D2","G2","D3","G3","B3","D4"]),
    tuning("open-d", "Open D", "開放弦でDメジャーになるオープンD。", ["D2","A2","D3","F#3","A3","D4"]),
    tuning("drop-c", "Drop C", "1音下げを基準に6弦をC2へ下げるドロップC。", ["C2","G2","C3","F3","A3","D4"]),
  ]},
  { slug: "bass", name: "ベース", description: "4弦・5弦・6弦ベースに対応。", tunings: [
    tuning("4-string-standard", "4弦 Standard", "4弦ベースの標準 E1–A1–D2–G2。", ["E1","A1","D2","G2"]),
    tuning("4-string-drop-d", "4弦 Drop D", "4弦ベースの最低弦をD1へ下げるDrop D。", ["D1","A1","D2","G2"]),
    tuning("5-string-standard", "5弦 Standard", "Low Bを加えた5弦ベースの標準。", ["B0","E1","A1","D2","G2"]),
    tuning("6-string-standard", "6弦 Standard", "Low BとHigh Cを備えた6弦ベースの標準。", ["B0","E1","A1","D2","G2","C3"]),
  ]},
  { slug: "ukulele", name: "ウクレレ", description: "High G、Low G、バリトンに対応。", tunings: [
    tuning("standard", "Standard (High G)", "ソプラノ・コンサート・テナーで一般的なリエントラント調弦。", ["G4","C4","E4","A4"]),
    tuning("low-g", "Low G", "4弦を1オクターブ低いG3にしたLow G。", ["G3","C4","E4","A4"]),
    tuning("baritone", "Baritone", "バリトンウクレレの標準 D3–G3–B3–E4。", ["D3","G3","B3","E4"]),
  ]},
  { slug: "violin", name: "バイオリン", description: "バイオリンの完全5度調弦。", tunings: [tuning("standard", "Standard", "バイオリンの標準 G3–D4–A4–E5。", ["G3","D4","A4","E5"])] },
  { slug: "viola", name: "ヴィオラ", description: "ヴィオラの完全5度調弦。", tunings: [tuning("standard", "Standard", "ヴィオラの標準 C3–G3–D4–A4。", ["C3","G3","D4","A4"])] },
  { slug: "cello", name: "チェロ", description: "チェロの完全5度調弦。", tunings: [tuning("standard", "Standard", "チェロの標準 C2–G2–D3–A3。", ["C2","G2","D3","A3"])] },
  { slug: "double-bass", name: "コントラバス", description: "コントラバスの完全4度調弦。", tunings: [tuning("standard", "Standard", "4弦コントラバスの標準 E1–A1–D2–G2。", ["E1","A1","D2","G2"])] },
  { slug: "mandolin", name: "マンドリン", description: "4コース8弦マンドリンの標準調弦。", tunings: [tuning("standard", "Standard", "各2本を同音に合わせる標準 G3–D4–A4–E5。", ["G3","D4","A4","E5"], "各ボタンは2本1組のコースを表します。") ] },
  { slug: "banjo", name: "5弦バンジョー", description: "短いドローン弦を含む5弦バンジョー。", tunings: [
    tuning("open-g", "Open G", "5弦から1弦へ G4–D3–G3–B3–D4。", ["G4","D3","G3","B3","D4"], "5弦は短いドローン弦のため、最も高いG4です。"),
    tuning("double-c", "Double C", "オールドタイムで使われるDouble C。", ["G4","C3","G3","C4","D4"]),
  ]},
  { slug: "shamisen", name: "三味線", description: "三味線の代表的な3種類の調子。", tunings: [
    tuning("honchoshi", "本調子", "一の糸をC3とした本調子 C3–F3–C4。", ["C3","F3","C4"], "三味線は相対調弦です。このページでは四本（C）を基準例にしています。"),
    tuning("niagari", "二上り", "本調子から二の糸を全音上げた C3–G3–C4。", ["C3","G3","C4"], "三味線は相対調弦です。このページでは四本（C）を基準例にしています。"),
    tuning("sansagari", "三下り", "本調子から三の糸を全音下げた C3–F3–Bb3。", ["C3","F3","Bb3"], "三味線は相対調弦です。このページでは四本（C）を基準例にしています。"),
  ]},
];

export const allTunings = instruments.flatMap((instrument) => instrument.tunings.map((item) => ({ instrument, tuning: item })));
export const getInstrument = (slug: string) => instruments.find((item) => item.slug === slug);
export const getTuning = (instrumentSlug: string, tuningSlug: string) => getInstrument(instrumentSlug)?.tunings.find((item) => item.slug === tuningSlug);
export const getLegacyTuning = (slug: string) => allTunings.find(({ instrument, tuning }) => `${instrument.slug}-${tuning.slug}` === slug);
