"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Tuning } from "../data/tunings";
import { tunings } from "../data/tunings";
import { detectPitch, frequencyToPitch, type Pitch } from "../lib/pitch";

type Status = "idle" | "requesting" | "listening" | "silent" | "denied" | "unsupported";
export default function Tuner({ tuning }: { tuning: Tuning }) {
  const [status, setStatus] = useState<Status>("idle");
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [chromatic, setChromatic] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const audioRef = useRef<{ context: AudioContext; stream: MediaStream; frame: number } | null>(null);

  const stop = useCallback(() => { const current = audioRef.current; if (current) { cancelAnimationFrame(current.frame); current.stream.getTracks().forEach((track) => track.stop()); void current.context.close(); audioRef.current = null; } setStatus("idle"); setPitch(null); }, []);
  useEffect(() => stop, [stop]);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus("unsupported"); return; }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const context = new AudioContext(); await context.resume();
      const analyser = context.createAnalyser(); analyser.fftSize = 4096; analyser.smoothingTimeConstant = 0;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Float32Array(analyser.fftSize); let misses = 0; const recent: number[] = [];
      const tick = () => {
        analyser.getFloatTimeDomainData(samples); const found = detectPitch(samples, context.sampleRate);
        if (found) { recent.push(found); if (recent.length > 5) recent.shift(); const sorted = [...recent].sort((a,b)=>a-b); setPitch(frequencyToPitch(sorted[Math.floor(sorted.length / 2)])); setStatus("listening"); misses = 0; }
        else if (++misses > 18) { setPitch(null); setStatus("silent"); recent.length = 0; }
        if (audioRef.current) audioRef.current.frame = requestAnimationFrame(tick);
      };
      audioRef.current = { context, stream, frame: requestAnimationFrame(tick) };
    } catch { setStatus("denied"); }
  };

  const selected = tuning.strings[targetIndex];
  const targetPitch = pitch && !chromatic ? { ...pitch, cents: Math.round(1200 * Math.log2(pitch.frequency / selected.frequency)) } : pitch;
  const cents = Math.max(-50, Math.min(50, targetPitch?.cents ?? 0));
  const inTune = targetPitch ? Math.abs(targetPitch.cents) <= 5 : false;
  const displayNote = chromatic ? (pitch?.note ?? "–") : selected.note;
  const guidance = !targetPitch ? "弦を鳴らしてください" : inTune ? "ぴったりです" : targetPitch.cents < 0 ? "低いです・少し締める" : "高いです・少し緩める";

  return <main>
    <header><Link href="/tuner/guitar-standard" className="brand">STRING<span>TUNER</span></Link><span className="privacy">音声は端末内だけで処理</span></header>
    <nav aria-label="チューニング">
      {tunings.map((item) => <Link key={item.slug} href={`/tuner/${item.slug}`} className={item.slug === tuning.slug ? "active" : ""}>{item.shortName}</Link>)}
    </nav>
    <section className="tuner-card">
      <div className="mode-row"><h1>{tuning.shortName}</h1><button className={`toggle ${chromatic ? "on" : ""}`} onClick={() => setChromatic(!chromatic)} aria-pressed={chromatic}>クロマチック</button></div>
      <div className={`note ${inTune ? "tuned" : ""}`}>{displayNote}</div>
      <div className="meter" aria-label={`ずれ ${targetPitch?.cents ?? 0} cents`}>
        <div className="ticks"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="needle" style={{ transform: `translateX(-50%) rotate(${cents * 0.7}deg)` }} />
        <div className="center-mark" />
      </div>
      <div className={`guidance ${inTune ? "good" : ""}`}>{guidance}</div>
      <div className="readout"><div><span>周波数</span><strong>{pitch ? pitch.frequency.toFixed(1) : "–––"} <small>Hz</small></strong></div><div><span>ずれ</span><strong>{targetPitch ? `${targetPitch.cents > 0 ? "+" : ""}${targetPitch.cents}` : "–––"} <small>cent</small></strong></div></div>
      {!chromatic && <div className="strings" aria-label="目標の弦を選択">{tuning.strings.map((string, index) => <button key={`${string.note}-${index}`} onClick={() => setTargetIndex(index)} className={index === targetIndex ? "selected" : ""}><span>{6-index}弦</span><strong>{string.note}</strong></button>)}</div>}
      <div className="status">{status === "requesting" && "マイクの許可を確認しています…"}{status === "silent" && "待機中：マイクに近づけて1本ずつ鳴らしてください"}{status === "denied" && "マイクを利用できません。ブラウザの設定から許可してください。"}{status === "unsupported" && "このブラウザはマイク入力に対応していません。"}</div>
      {status === "idle" || status === "denied" || status === "unsupported" ? <button className="start" onClick={start}>マイクを使って始める</button> : <button className="stop" onClick={stop}>終了する</button>}
    </section>
    <section className="info"><h2>無料・広告なし。音声も残しません。</h2><p>マイクの音はこの端末のブラウザ内だけで解析します。録音・保存・外部サーバーへの音声送信は行いません。</p><p className="tip">静かな場所で、ほかの弦に軽く触れながら1本ずつ鳴らすと安定します。</p></section>
    <footer>© 2026 String Tuner</footer>
  </main>;
}
