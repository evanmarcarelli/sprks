import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import heroImg from "@/assets/hero-speaker.jpg";

// Plays once per page load. SPA navigations back to "/" won't replay it;
// a hard refresh (new module instance) will.
let hasPlayedThisSession = false;

type Particle = { hx: number; hy: number; ex: number; ey: number; gx: number; gy: number; size: number; col: string };

const EXPLODE_MS = 1200; // slow-mo blow apart
const SPIN_MS = 1100; // the fragments swirl
const FORM_MS = 1100; // fly out and fill the screen
const TOTAL_MS = EXPLODE_MS + SPIN_MS + FORM_MS;
const SPIN_ANGLE = Math.PI * 2 * 1.6; // 1.6 full turns — winds tighter

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Sound-space intro.
 * A photoreal speaker floats in a black void and thumps twice. The 3rd thump
 * blows it into thousands of tiny pieces in slow motion; the fragments spin into
 * a vortex, then fly out to fill the whole screen — and the live marketing page
 * forms through them. The shatter is a canvas particle system (the photo is
 * sampled into thousands of points), and all sound is synthesized live with the
 * Web Audio API, so there are no audio files to ship.
 */
export function SoundSpaceIntro() {
  const [show, setShow] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [revealing, setRevealing] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null); // micro-shake
  const speakerRef = useRef<HTMLDivElement>(null); // bump (scale)
  const imgRef = useRef<HTMLImageElement>(null); // the intact speaker
  const canvasRef = useRef<HTMLCanvasElement>(null); // the particle field
  const starsRef = useRef<HTMLDivElement>(null); // dust
  const vignetteRef = useRef<HTMLDivElement>(null); // void edges
  const ringsRef = useRef<HTMLDivElement>(null); // shockwave origin (woofer)
  const glowRef = useRef<HTMLDivElement>(null); // cone flare
  const flashRef = useRef<HTMLDivElement>(null); // light pulse
  const scrubRef = useRef<HTMLDivElement>(null); // scanline strobe

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timers = useRef<number[]>([]);
  const rafRef = useRef(0);
  const finishedRef = useRef(false);

  // Decide whether to play (client-only; respects reduced motion).
  useEffect(() => {
    if (hasPlayedThisSession) return;
    hasPlayedThisSession = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // keep the site instant for reduced-motion users
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";

    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 0.4);
    master.connect(ctx.destination);
    masterRef.current = master;

    const tryResume = () => {
      ctx.resume().then(() => setSoundOn(ctx.state === "running")).catch(() => {});
    };
    tryResume();
    const onGesture = () => tryResume();
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);

    startHum(ctx, master);

    const noiseBuffer = (dur: number) => {
      const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return buf;
    };

    // ---- audio: a deep kick with a transient click ----
    const kick = (t: number, o: { f0: number; f1: number; dur: number; level: number; click: number }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(o.f0, t);
      osc.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur * 0.85);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(o.level, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + o.dur + 0.05);
      if (o.click > 0) {
        const c = ctx.createOscillator();
        const cg = ctx.createGain();
        c.type = "triangle";
        c.frequency.setValueAtTime(1100, t);
        c.frequency.exponentialRampToValueAtTime(180, t + 0.05);
        cg.gain.setValueAtTime(o.click, t);
        cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        c.connect(cg).connect(master);
        c.start(t);
        c.stop(t + 0.09);
      }
    };

    // ---- audio: the slow-motion blow — stretched boom + a shower of glass ----
    const explosionAudio = (t: number) => {
      kick(t, { f0: 120, f1: 26, dur: 1.1, level: 1.0, click: 0 });
      const nd = 1.4;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(nd);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 850;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.0001, t);
      ng.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + nd);
      src.connect(hp).connect(ng).connect(master);
      src.start(t);
      src.stop(t + nd);
      for (let k = 0; k < 22; k++) {
        const tt = t + 0.02 + Math.random() * 1.25;
        const o = ctx.createOscillator();
        const og = ctx.createGain();
        o.type = "triangle";
        const f = 2400 + Math.random() * 4600;
        o.frequency.setValueAtTime(f, tt);
        o.frequency.exponentialRampToValueAtTime(f * 0.55, tt + 0.13);
        og.gain.setValueAtTime(0.0001, tt);
        og.gain.exponentialRampToValueAtTime(0.09, tt + 0.004);
        og.gain.exponentialRampToValueAtTime(0.0001, tt + 0.18);
        o.connect(og).connect(master);
        o.start(tt);
        o.stop(tt + 0.2);
      }
    };

    // ---- audio: the swirl — a rising, gated whoosh as the pieces spin ----
    const swirlAudio = (t: number) => {
      const dur = (SPIN_MS + FORM_MS) / 1000;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(dur + 0.15);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 0.7;
      bp.frequency.setValueAtTime(240, t);
      bp.frequency.exponentialRampToValueAtTime(2800, t + dur);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(0.4, t + dur * 0.85);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);
      const scrub = ctx.createGain();
      const steps = 12;
      for (let i = 0; i < steps; i++) scrub.gain.setValueAtTime(i % 2 === 0 ? 1 : 0.4, t + (i / steps) * dur);
      scrub.gain.setValueAtTime(1, t + dur);
      src.connect(bp).connect(env).connect(scrub).connect(master);
      src.start(t);
      src.stop(t + dur + 0.15);
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(80, t);
      o.frequency.exponentialRampToValueAtTime(520, t + dur);
      lp.type = "lowpass";
      lp.frequency.value = 1700;
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(0.13, t + dur * 0.85);
      og.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.1);
      o.connect(lp).connect(og).connect(master);
      o.start(t);
      o.stop(t + dur + 0.12);
    };

    // ---- audio: the page lands — soft thud + bright resolve chime ----
    const resolveChime = (t: number) => {
      kick(t, { f0: 90, f1: 30, dur: 0.45, level: 0.7, click: 0 });
      [523.25, 784].forEach((f, i) => {
        const o = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o2.type = "triangle";
        o.frequency.value = f;
        o2.frequency.value = f * 2;
        const tt = t + 0.02 + i * 0.05;
        g.gain.setValueAtTime(0.0001, tt);
        g.gain.exponentialRampToValueAtTime(0.12, tt + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0001, tt + 1.2);
        o.connect(g);
        o2.connect(g);
        g.connect(master);
        o.start(tt);
        o2.start(tt);
        o.stop(tt + 1.3);
        o2.stop(tt + 1.3);
      });
    };

    // ---------------- canvas particle field ----------------
    let particles: Particle[] = [];
    const cv = canvasRef.current;
    const cctx = cv?.getContext("2d") ?? null;

    // Sample the speaker photo into thousands of points placed where the photo
    // sits on screen, each with an outward explosion vector and a full-screen
    // "gather" cell (so the swirl can scatter them across the whole page).
    const buildParticles = () => {
      const img = imgRef.current;
      if (!cv || !cctx || !img || !img.complete || !img.naturalWidth) return;
      const W = window.innerWidth || document.documentElement.clientWidth || 1600;
      const H = window.innerHeight || document.documentElement.clientHeight || 900;
      cv.width = W;
      cv.height = H;
      const sh = 0.78 * H; // speaker draws at max-h:78vh
      const sw = sh * (img.naturalWidth / img.naturalHeight);
      const sx = (W - sw) / 2;
      const sy = (H - sh) / 2;
      const wx = sx + 0.47 * sw; // woofer impact point on screen
      const wy = sy + 0.61 * sh;

      const IH = 700;
      const IW = Math.round(IH * (img.naturalWidth / img.naturalHeight));
      const off = document.createElement("canvas");
      off.width = IW;
      off.height = IH;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, IW, IH);
      const data = octx.getImageData(0, 0, IW, IH).data;

      const S = 5; // sample stride (smaller = more, tinier pieces)
      const cell = (S / IW) * sw;
      const size = Math.ceil(cell) + 1;
      const arr: Particle[] = [];
      for (let y = 0; y < IH; y += S) {
        for (let x = 0; x < IW; x += S) {
          const idx = (y * IW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          if ((r * 0.299 + g * 0.587 + b * 0.114) / 255 < 0.07) continue; // skip the void
          const hx = sx + (x / IW) * sw;
          const hy = sy + (y / IH) * sh;
          const dx = hx - wx;
          const dy = hy - wy;
          const dist = Math.hypot(dx, dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;
          const reach = dist * 0.7 + 110 + Math.random() * 240;
          const ex = hx + nx * reach + (Math.random() - 0.5) * 130;
          const ey = hy + ny * reach + (Math.random() - 0.5) * 130;
          arr.push({ hx, hy, ex, ey, gx: 0, gy: 0, size, col: `rgb(${r},${g},${b})` });
        }
      }
      const MAX = 9000;
      if (arr.length > MAX) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        arr.length = MAX;
      }
      // assign each particle a cell in a full-screen jittered grid
      const n = arr.length;
      const cols = Math.max(1, Math.round(Math.sqrt((n * W) / H)));
      const rows = Math.ceil(n / cols);
      const cw = W / cols;
      const ch = H / rows;
      for (let i = 0; i < n; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        arr[i].gx = (col + 0.5) * cw + (Math.random() - 0.5) * cw * 1.5;
        arr[i].gy = (row + 0.5) * ch + (Math.random() - 0.5) * ch * 1.5;
      }
      particles = arr;
    };

    // Paint the field at a given elapsed time (drives both rAF and hold-mode).
    // explode (easeOut) -> spin/vortex -> fly out to a full-screen grid.
    const drawFrame = (elapsed: number) => {
      if (!cv || !cctx) return;
      const W = cv.width;
      const H = cv.height;
      const ccx = W / 2;
      const ccy = H / 2;
      cctx.clearRect(0, 0, W, H);

      const inExplode = elapsed <= EXPLODE_MS;
      const inSpin = !inExplode && elapsed <= EXPLODE_MS + SPIN_MS;
      let cosA = 1;
      let sinA = 0;
      let k = 1;
      if (inSpin) {
        const pr = easeInOut((elapsed - EXPLODE_MS) / SPIN_MS);
        const ang = pr * SPIN_ANGLE;
        cosA = Math.cos(ang);
        sinA = Math.sin(ang);
        k = 1 - 0.5 * pr; // wind the vortex tighter into the center
      }
      const inForm = !inExplode && !inSpin && elapsed <= TOTAL_MS;
      const afterForm = elapsed > TOTAL_MS;
      const formPr = inForm ? easeInOut((elapsed - EXPLODE_MS - SPIN_MS) / FORM_MS) : 0;
      const fk = 0.5; // match the tightened vortex before flinging out
      const fcos = Math.cos(SPIN_ANGLE);
      const fsin = Math.sin(SPIN_ANGLE);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let x: number;
        let y: number;
        if (inExplode) {
          const t = easeOut(elapsed / EXPLODE_MS);
          x = p.hx + (p.ex - p.hx) * t;
          y = p.hy + (p.ey - p.hy) * t;
        } else if (inSpin) {
          const dx = (p.ex - ccx) * k;
          const dy = (p.ey - ccy) * k;
          x = ccx + dx * cosA - dy * sinA;
          y = ccy + dx * sinA + dy * cosA;
        } else {
          const dx = (p.ex - ccx) * fk;
          const dy = (p.ey - ccy) * fk;
          const sxp = ccx + dx * fcos - dy * fsin;
          const syp = ccy + dx * fsin + dy * fcos;
          if (afterForm) {
            x = p.gx;
            y = p.gy;
          } else {
            x = sxp + (p.gx - sxp) * formPr;
            y = syp + (p.gy - syp) * formPr;
          }
        }
        cctx.fillStyle = p.col;
        cctx.fillRect(x, y, p.size, p.size);
      }
    };

    const prime = () => {
      buildParticles();
      if (imgRef.current) imgRef.current.style.opacity = "0";
      if (cv) cv.style.opacity = "1";
      drawFrame(0);
    };

    // ---- visuals ----
    const fadeIn = () => {
      speakerRef.current?.animate(
        [
          { opacity: 0, transform: "scale(0.9)", filter: "brightness(0.4)" },
          { opacity: 1, transform: "scale(1)", filter: "brightness(1)" },
        ],
        { duration: 850, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" },
      );
    };

    const shake = (px: number) => {
      sceneRef.current?.animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${px}px, ${-px * 0.6}px)` },
          { transform: `translate(${-px * 0.8}px, ${px * 0.5}px)` },
          { transform: `translate(${px * 0.4}px, 0)` },
          { transform: "translate(0,0)" },
        ],
        { duration: 280, easing: "ease-out" },
      );
    };

    const bump = (scale: number) => {
      speakerRef.current?.animate(
        [
          { transform: "scale(1)" },
          { transform: `scale(${scale})`, offset: 0.28 },
          { transform: "scale(1)" },
        ],
        { duration: 420, easing: "cubic-bezier(.18,.9,.2,1)" },
      );
    };

    const ring = (o: { size: number; border: number; opacity: number; dur: number; color: string }) => {
      const host = ringsRef.current;
      if (!host) return;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:0;top:0;width:${o.size}px;height:${o.size}px;margin:${-o.size / 2}px 0 0 ${-o.size / 2}px;border-radius:9999px;border:${o.border}px solid ${o.color};pointer-events:none;`;
      host.appendChild(el);
      const a = el.animate(
        [
          { transform: "scale(0.18)", opacity: o.opacity },
          { transform: "scale(1)", opacity: 0 },
        ],
        { duration: o.dur, easing: "cubic-bezier(.1,.6,.3,1)" },
      );
      a.onfinish = () => el.remove();
    };

    const flare = (level: number, dur: number) => {
      glowRef.current?.animate(
        [{ opacity: 0 }, { opacity: level, offset: 0.18 }, { opacity: 0 }],
        { duration: dur, easing: "ease-out" },
      );
    };

    const beat = (n: 1 | 2) => {
      const now = ctx.currentTime;
      if (n === 1) {
        kick(now, { f0: 170, f1: 48, dur: 0.5, level: 0.85, click: 0.45 });
        bump(1.045);
        shake(7);
        flare(0.5, 520);
        ring({ size: 520, border: 2, opacity: 0.55, dur: 1100, color: "rgba(200,205,214,0.7)" });
      } else {
        kick(now, { f0: 150, f1: 42, dur: 0.58, level: 0.95, click: 0.5 });
        bump(1.07);
        shake(11);
        flare(0.62, 560);
        ring({ size: 560, border: 2, opacity: 0.6, dur: 1150, color: "rgba(214,219,228,0.78)" });
        ring({ size: 360, border: 1.5, opacity: 0.5, dur: 900, color: "rgba(170,180,200,0.6)" });
      }
    };

    // The 3rd thump blows the speaker into thousands of pieces; one rAF loop
    // self-sequences explode -> spin -> fly out to fill the screen.
    const explode = () => {
      const now = ctx.currentTime;
      explosionAudio(now);
      shake(22);
      flare(1, 1300);
      ring({ size: 880, border: 2.5, opacity: 0.82, dur: 1500, color: "rgba(235,238,243,0.85)" });
      prime();
      let t0 = 0;
      const tick = (ts: number) => {
        if (!t0) t0 = ts;
        const elapsed = ts - t0;
        drawFrame(elapsed);
        if (elapsed <= TOTAL_MS) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    // Audio + scanline strobe for the swirl (motion is driven by the rAF clock).
    const swirlCue = () => {
      swirlAudio(ctx.currentTime);
      scrubRef.current?.animate(
        [
          { opacity: 0, transform: "translateX(0)" },
          { opacity: 0.13, transform: "translateX(-2px)" },
          { opacity: 0.03, transform: "translateX(1px)" },
          { opacity: 0.11, transform: "translateX(-1px)" },
          { opacity: 0.04, transform: "translateX(2px)" },
          { opacity: 0, transform: "translateX(0)" },
        ],
        { duration: SPIN_MS + FORM_MS, easing: "steps(14, end)" },
      );
    };

    // The pieces have filled the screen; dissolve the field and let the live
    // marketing page bloom into focus through it.
    const resolve = () => {
      const now = ctx.currentTime;
      resolveChime(now);
      flashRef.current?.animate(
        [{ opacity: 0 }, { opacity: 0.6, offset: 0.3 }, { opacity: 0 }],
        { duration: 700, easing: "ease-out" },
      );
      canvasRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 140, easing: "ease-out", fill: "forwards" });
      rootRef.current?.animate(
        [{ backgroundColor: "rgb(7,8,9)" }, { backgroundColor: "rgba(7,8,9,0)" }],
        { duration: 640, delay: 120, easing: "ease-out", fill: "forwards" },
      );
      starsRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-out", fill: "forwards" });
      vignetteRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, delay: 100, easing: "ease-out", fill: "forwards" });

      // the one touch outside the overlay: the live page slides up into place
      document.querySelector("main")?.animate(
        [
          { transform: "translateY(52px)", opacity: 0, filter: "blur(6px)" },
          { transform: "translateY(0px)", opacity: 1, filter: "blur(0px)" },
        ],
        { duration: 820, delay: 150, easing: "cubic-bezier(.2,.75,.2,1)" },
      );

      finishedRef.current = true;
      setRevealing(true);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      timers.current.push(window.setTimeout(() => setShow(false), 900));
    };

    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(40, fadeIn);
    at(600, () => beat(1));
    at(1250, () => beat(2));
    at(1700, explode);
    at(1700 + EXPLODE_MS, swirlCue);
    at(1700 + TOTAL_MS - 180, resolve);

    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      document.body.style.overflow = "";
      ctx.close().catch(() => {});
    };
  }, [show]);

  const skip = () => {
    if (finishedRef.current) return;
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    cancelAnimationFrame(rafRef.current);
    finishedRef.current = true;
    masterRef.current?.gain.setValueAtTime(0.0001, (ctxRef.current?.currentTime ?? 0) + 0.01);
    setRevealing(true);
    rootRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: "ease-out", fill: "forwards" });
    timers.current.push(window.setTimeout(() => setShow(false), 420));
  };

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "rgb(7,8,9)" }}
    >
      <div ref={starsRef} className="ssi-stars absolute inset-0" />

      {/* particle field — thousands of pieces of the speaker */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0 }} />

      <div ref={sceneRef} className="relative flex items-center justify-center">
        <div ref={speakerRef} className="relative will-change-transform" style={{ opacity: 0 }}>
          <img
            ref={imgRef}
            src={heroImg}
            alt=""
            width={1456}
            height={970}
            crossOrigin="anonymous"
            className="max-h-[78vh] w-auto select-none"
            draggable={false}
          />
          {/* shockwave origin — sits over the woofer */}
          <div ref={ringsRef} className="pointer-events-none absolute" style={{ left: "47%", top: "61%" }} />
          {/* cone flare */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute"
            style={{
              left: "47%",
              top: "61%",
              width: 520,
              height: 520,
              transform: "translate(-50%,-50%)",
              opacity: 0,
              borderRadius: "9999px",
              background: "radial-gradient(circle, rgba(220,226,236,0.55) 0%, rgba(180,190,210,0.18) 35%, transparent 68%)",
            }}
          />
        </div>
      </div>

      {/* vignette — melt the photo edges into the void */}
      <div
        ref={vignetteRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 56%, transparent 30%, rgba(7,8,9,0.55) 70%, #070809 100%)" }}
      />

      {/* light pulse */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(248,250,253,0.9) 0%, rgba(210,218,228,0.4) 30%, transparent 64%)",
        }}
      />

      {/* scanline strobe */}
      <div
        ref={scrubRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "screen",
        }}
      />

      {!soundOn && !revealing && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-silver/70">
          <Volume2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Tap for sound</span>
        </div>
      )}

      {!revealing && (
        <button
          onClick={skip}
          className="absolute bottom-8 right-8 z-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip →
        </button>
      )}

      <style>{`
        .ssi-stars {
          background-image:
            radial-gradient(1px 1px at 18% 28%, rgba(255,255,255,0.18), transparent),
            radial-gradient(1px 1px at 72% 18%, rgba(255,255,255,0.12), transparent),
            radial-gradient(1px 1px at 60% 72%, rgba(255,255,255,0.10), transparent),
            radial-gradient(1.5px 1.5px at 35% 80%, rgba(255,255,255,0.10), transparent),
            radial-gradient(1px 1px at 88% 62%, rgba(255,255,255,0.08), transparent);
          animation: ssi-drift 14s ease-in-out infinite alternate;
        }
        @keyframes ssi-drift {
          from { transform: translateY(0) scale(1); opacity: 0.7; }
          to   { transform: translateY(-14px) scale(1.04); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/** Low ambient sub-bass hum that fades up under the intro. */
function startHum(ctx: AudioContext, master: GainNode) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const fifth = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  fifth.type = "sine";
  osc.frequency.value = 48;
  fifth.frequency.value = 72;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 1.2);
  osc.connect(g);
  fifth.connect(g);
  g.connect(master);
  osc.start(t);
  fifth.start(t);
  osc.stop(t + 4.5);
  fifth.stop(t + 4.5);
}
