import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Intro cinematográfica de uma atividade (por agora só o Paintball adultos):
// mira que se desenha, montagem rápida de fotos com cortes secos, flashes e
// manchas de tinta a rebentar, título a cair com o ecrã a tremer e uma
// mancha de tinta que abre a página. ~6,5 s, pode saltar-se, e só aparece
// uma vez por sessão (quem volta à página não a vê outra vez).

const PAINT = ["#ff6a00", "#ff3d78", "#0aa89e", "#ffc233", "#7cff3a"];

// Mancha de tinta (SVG) com pontas irregulares — determinística pela semente.
function splatPath(seed, spikes = 18) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pts = [];
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * Math.PI * 2;
    const r = 34 + rnd() * 10 + (rnd() > 0.72 ? 14 + rnd() * 16 : 0);
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], n = pts[(i + 1) % pts.length];
    const mx = (p[0] + n[0]) / 2, my = (p[1] + n[1]) / 2;
    d += ` Q ${p[0]} ${p[1]} ${mx} ${my}`;
  }
  return d + " Z";
}

function Splat({ seed, color, x, y, size, delay = 0, rotate = 0 }) {
  const d = useMemo(() => splatPath(seed), [seed]);
  // Pingos à volta da mancha.
  const drops = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const a = ((seed * 37 + i * 61) % 360) * (Math.PI / 180);
    const r = 46 + ((seed + i * 13) % 14);
    return { cx: 50 + Math.cos(a) * r, cy: 50 + Math.sin(a) * r, r: 1.5 + ((seed + i) % 4) };
  }), [seed]);
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, rotate, filter: `drop-shadow(0 0 30px ${color}88)` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 0.95] }}
      transition={{ duration: 0.35, delay, ease: [0.2, 1.4, 0.4, 1] }}
    >
      <path d={d} fill={color} />
      {drops.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} />)}
    </motion.svg>
  );
}

// Mira que se desenha e "trava".
function Crosshair({ size = 220, delay = 0, opacity = 1 }) {
  const stroke = { pathLength: [0, 1] };
  return (
    <motion.svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      initial={{ rotate: -90, scale: 1.6, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      <motion.circle cx="50" cy="50" r="38" fill="none" stroke="#ff3d3d" strokeWidth="1.2" animate={stroke} transition={{ duration: 0.6, delay }} />
      <motion.circle cx="50" cy="50" r="24" fill="none" stroke="#ff3d3d" strokeWidth="0.8" strokeDasharray="3 3" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "50px", originY: "50px" }} />
      {[[50, 4, 50, 22], [50, 78, 50, 96], [4, 50, 22, 50], [78, 50, 96, 50]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ff3d3d" strokeWidth="1.4" animate={stroke} transition={{ duration: 0.4, delay: delay + 0.2 + i * 0.05 }} />
      ))}
      <motion.circle cx="50" cy="50" r="1.6" fill="#ff3d3d" animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
    </motion.svg>
  );
}

const SHOT = 0.62;          // duração de cada fotografia na montagem (s)

export default function CinematicIntro({ images, title, tagline, accent = "#ff6a00", storageKey, onDone }) {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [phase, setPhase] = useState("open");     // open → montage → title → exit
  const [shot, setShot] = useState(0);
  const [visible, setVisible] = useState(true);
  const montage = images.slice(0, 6);

  const finish = () => {
    try { sessionStorage.setItem(storageKey, "1"); } catch { /* sem armazenamento */ }
    setVisible(false);
  };

  // Linha do tempo.
  useEffect(() => {
    if (reduced) { const t = setTimeout(finish, 1200); return () => clearTimeout(t); }
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    at(900, () => setPhase("montage"));
    montage.forEach((_, i) => at(900 + i * SHOT * 1000, () => setShot(i)));
    const titleAt = 900 + montage.length * SHOT * 1000;
    at(titleAt, () => setPhase("title"));
    at(titleAt + 2300, () => setPhase("exit"));
    at(titleAt + 3000, finish);
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Bloqueia o scroll enquanto a intro está no ecrã; Esc salta.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const letters = title.toUpperCase().split("");
  const lastImage = images[montage.length] || images[0];

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] overflow-hidden bg-black text-white select-none"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.7, ease: [0.7, 0, 0.3, 1] } }}
          style={{ clipPath: "circle(150% at 50% 50%)" }}
        >
          {/* Câmara: treme nos impactos */}
          <motion.div
            className="absolute inset-0"
            animate={phase === "title" ? { x: [0, -14, 12, -8, 6, 0], y: [0, 8, -10, 6, -3, 0] } : {}}
            transition={{ duration: 0.45, delay: 0.25 }}
          >
            {/* 1) Abertura: escuro, mira e texto */}
            {phase === "open" && (
              <>
                <motion.p className="absolute left-1/2 top-[27%] -translate-x-1/2 text-xs md:text-lg font-semibold tracking-[0.6em] text-white/80 whitespace-nowrap"
                  initial={{ opacity: 0, letterSpacing: "1.2em" }} animate={{ opacity: 1, letterSpacing: "0.6em" }} transition={{ duration: 0.8 }}>
                  DESAFIAR VIANA APRESENTA
                </motion.p>
                <Crosshair />
              </>
            )}

            {/* 2) Montagem: cortes secos, zoom, manchas de tinta e flash */}
            {phase === "montage" && (
              <AnimatePresence>
                <motion.div key={shot} className="absolute inset-0"
                  initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.05 } }}>
                  <motion.img src={montage[shot]} alt="" className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.35, rotate: shot % 2 ? 2 : -2, filter: "contrast(1.4) saturate(1.5) brightness(0.9)" }}
                    animate={{ scale: 1.05, rotate: 0 }}
                    transition={{ duration: SHOT + 0.2, ease: "easeOut" }} />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
                  {/* flash branco no corte */}
                  <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.18 }} />
                  <Splat seed={shot * 7 + 3} color={PAINT[shot % PAINT.length]} x={`${18 + ((shot * 29) % 64)}%`} y={`${22 + ((shot * 41) % 56)}%`} size={shot % 2 ? 260 : 190} delay={0.08} rotate={shot * 47} />
                  {shot % 2 === 1 && <Splat seed={shot * 11 + 5} color={PAINT[(shot + 2) % PAINT.length]} x={`${78 - ((shot * 23) % 50)}%`} y={`${70 - ((shot * 17) % 40)}%`} size={120} delay={0.2} rotate={shot * 90} />}
                  {/* palavras de impacto */}
                  <motion.p className="absolute bottom-[16%] left-1/2 -translate-x-1/2 font-display text-5xl md:text-8xl tracking-wide whitespace-nowrap"
                    style={{ textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}
                    initial={{ scale: 2.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.22, ease: [0.2, 1.3, 0.4, 1] }}>
                    {["ESTRATÉGIA", "ADRENALINA", "EQUIPA", "MIRA", "ATAQUE", "VITÓRIA"][shot % 6]}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            )}

            {/* 3) Título */}
            {(phase === "title" || phase === "exit") && (
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <motion.img src={lastImage} alt="" className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.25, filter: "blur(6px) brightness(0.35)" }} animate={{ scale: 1.08, filter: "blur(0px) brightness(0.45)" }} transition={{ duration: 2.4, ease: "easeOut" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                {/* Disparos de tinta: a mancha principal e outras mais pequenas à volta */}
                <div className="absolute inset-0" style={{ opacity: 0.92 }}>
                  <Splat seed={42} color={accent} x="50%" y="47%" size={Math.min(typeof window !== "undefined" ? window.innerWidth * 0.62 : 520, 560)} delay={0.18} rotate={-12} />
                </div>
                <Splat seed={77} color="#ff3d78" x="22%" y="30%" size={150} delay={0.42} rotate={30} />
                <Splat seed={13} color="#0aa89e" x="80%" y="68%" size={170} delay={0.55} rotate={120} />
                <Splat seed={91} color="#ffc233" x="74%" y="24%" size={90} delay={0.66} rotate={200} />
                <Splat seed={5} color="#7cff3a" x="26%" y="74%" size={80} delay={0.78} rotate={300} />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <div className="flex font-display text-[17vw] md:text-[12rem] leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                    {letters.map((l, i) => (
                      <motion.span key={i}
                        initial={{ y: -260, scale: 3, opacity: 0, rotate: (i % 2 ? 12 : -12) }}
                        animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.2 + i * 0.06, type: "spring", stiffness: 520, damping: 18 }}>
                        {l === " " ? " " : l}
                      </motion.span>
                    ))}
                  </div>
                  <motion.div className="h-1.5 rounded-full bg-white mt-3" initial={{ width: 0 }} animate={{ width: "min(60vw, 520px)" }} transition={{ delay: 0.75, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                  <motion.p className="mt-4 text-base md:text-2xl font-semibold tracking-wide text-white/90 text-center"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.5 }}>
                    {tagline}
                  </motion.p>
                </div>
                <Crosshair size={Math.min(typeof window !== "undefined" ? window.innerWidth * 0.95 : 680, 680)} delay={0.6} opacity={0.35} />
              </motion.div>
            )}
          </motion.div>

          {/* Barras de cinema */}
          <motion.div className="absolute top-0 inset-x-0 bg-black z-10" initial={{ height: "50%" }} animate={{ height: phase === "exit" ? "0%" : "9%" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
          <motion.div className="absolute bottom-0 inset-x-0 bg-black z-10" initial={{ height: "50%" }} animate={{ height: phase === "exit" ? "0%" : "9%" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
          {/* Grão de película */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />

          <button onClick={finish}
            className="absolute z-20 right-4 top-[calc(9%+12px)] md:right-8 px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-white/10 hover:bg-white/25 backdrop-blur border border-white/25 transition-colors">
            Saltar intro ▸▸
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Intro só uma vez por sessão para cada atividade.
export function shouldPlayIntro(key) {
  try { return !sessionStorage.getItem(key); } catch { return true; }
}
