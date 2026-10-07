import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Intro cinematográfica de uma atividade: abertura (mira ou emoji), montagem
// rápida de fotos com cortes secos, flashes, efeitos do tema e palavras de
// impacto, título a cair letra a letra com o ecrã a tremer e abertura da
// página num círculo. ~7 s, pode saltar-se (botão ou Esc) e só aparece uma
// vez por sessão. O tema (efeito, cores, palavras) vem de INTROS na página.
//   effect: 'paint' (manchas de tinta) | 'confetti' | 'stars' | 'bubbles'

const COLORS = ["#ff6a00", "#ff3d78", "#0aa89e", "#ffc233", "#7cff3a", "#8b5cf6", "#38bdf8"];

// Gerador pseudo-aleatório determinístico (as animações são sempre iguais).
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// ── Efeitos ──────────────────────────────────────────────────────────────

function splatPath(seed, spikes = 18) {
  const rnd = rng(seed);
  const pts = [];
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * Math.PI * 2;
    const r = 34 + rnd() * 10 + (rnd() > 0.72 ? 14 + rnd() * 16 : 0);
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], n = pts[(i + 1) % pts.length];
    d += ` Q ${p[0]} ${p[1]} ${(p[0] + n[0]) / 2} ${(p[1] + n[1]) / 2}`;
  }
  return d + " Z";
}

// Mancha de tinta (paintball).
function Splat({ seed, color, x, y, size, delay = 0, rotate = 0 }) {
  const d = useMemo(() => splatPath(seed), [seed]);
  const drops = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const a = ((seed * 37 + i * 61) % 360) * (Math.PI / 180);
    const r = 46 + ((seed + i * 13) % 14);
    return { cx: 50 + Math.cos(a) * r, cy: 50 + Math.sin(a) * r, r: 1.5 + ((seed + i) % 4) };
  }), [seed]);
  return (
    <motion.svg viewBox="0 0 100 100" className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, rotate, filter: `drop-shadow(0 0 30px ${color}88)` }}
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 0.95] }}
      transition={{ duration: 0.35, delay, ease: [0.2, 1.4, 0.4, 1] }}>
      <path d={d} fill={color} />
      {drops.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} />)}
    </motion.svg>
  );
}

// Explosão de confetis a partir de um ponto (com gravidade).
function Confetti({ seed, x, y, count = 46, delay = 0, spread = 520 }) {
  const parts = useMemo(() => {
    const rnd = rng(seed);
    return Array.from({ length: count }, () => {
      const a = rnd() * Math.PI * 2, v = spread * (0.35 + rnd() * 0.65);
      return { dx: Math.cos(a) * v, dy: Math.sin(a) * v * 0.7 - 120, fall: 220 + rnd() * 260, rot: (rnd() - 0.5) * 900, w: 6 + rnd() * 8, h: 10 + rnd() * 10, c: COLORS[Math.floor(rnd() * COLORS.length)], round: rnd() > 0.7 };
    });
  }, [seed, count, spread]);
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {parts.map((p, i) => (
        <motion.span key={i} className="absolute block" style={{ width: p.w, height: p.round ? p.w : p.h, background: p.c, borderRadius: p.round ? "50%" : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.dx, y: [0, p.dy, p.dy + p.fall], opacity: [1, 1, 0], rotate: p.rot, scale: 1 }}
          transition={{ duration: 1.6, delay, ease: "easeOut", times: [0, 0.45, 1] }} />
      ))}
    </div>
  );
}

// Estrelas a rebentar (insufláveis).
function StarBurst({ seed, x, y, count = 14, delay = 0, size = 34 }) {
  const parts = useMemo(() => {
    const rnd = rng(seed);
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + rnd() * 0.4, v = 140 + rnd() * 260;
      return { dx: Math.cos(a) * v, dy: Math.sin(a) * v, s: 0.5 + rnd() * 1.1, c: COLORS[i % COLORS.length], rot: rnd() * 360 };
    });
  }, [seed, count]);
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {parts.map((p, i) => (
        <motion.svg key={i} viewBox="0 0 24 24" className="absolute" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, filter: `drop-shadow(0 0 10px ${p.c})` }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.dx, y: p.dy, scale: [0, p.s * 1.4, p.s], rotate: p.rot + 180, opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}>
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z" fill={p.c} />
        </motion.svg>
      ))}
    </div>
  );
}

// Bolhas (bubble soccer): crescem, sobem e rebentam.
function Bubbles({ seed, count = 12, delay = 0 }) {
  const parts = useMemo(() => {
    const rnd = rng(seed);
    return Array.from({ length: count }, () => ({ x: rnd() * 100, y: 55 + rnd() * 45, s: 40 + rnd() * 140, rise: 180 + rnd() * 320, d: rnd() * 0.5, c: COLORS[Math.floor(rnd() * 4)] }));
  }, [seed, count]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {parts.map((p, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, marginLeft: -p.s / 2, background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), ${p.c}55 40%, ${p.c}22 70%, transparent 72%)`, boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.55), 0 0 30px ${p.c}66` }}
          initial={{ scale: 0, y: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 1, 1.35], y: -p.rise, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, delay: delay + p.d, ease: "easeOut", times: [0, 0.25, 0.8, 1] }} />
      ))}
    </div>
  );
}

// Efeito do tema num corte da montagem.
function ShotEffect({ effect, shot }) {
  const c = COLORS[shot % COLORS.length], c2 = COLORS[(shot + 2) % COLORS.length];
  const x = `${18 + ((shot * 29) % 64)}%`, y = `${22 + ((shot * 41) % 50)}%`;
  if (effect === "confetti") return <Confetti seed={shot + 1} x={x} y={y} delay={0.05} count={36} />;
  if (effect === "stars") return <StarBurst seed={shot + 1} x={x} y={y} delay={0.05} />;
  if (effect === "bubbles") return <Bubbles seed={shot + 1} count={9} />;
  return (
    <>
      <Splat seed={shot * 7 + 3} color={c} x={x} y={y} size={shot % 2 ? 260 : 190} delay={0.08} rotate={shot * 47} />
      {shot % 2 === 1 && <Splat seed={shot * 11 + 5} color={c2} x={`${78 - ((shot * 23) % 50)}%`} y={`${70 - ((shot * 17) % 40)}%`} size={120} delay={0.2} rotate={shot * 90} />}
    </>
  );
}

// Fundo do título conforme o tema.
function TitleEffect({ effect, accent }) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
  const circle = (k, max) => { const s = Math.min(vw * k, max); return { width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2 }; };
  if (effect === "confetti") return (
    <>
      <motion.div className="absolute left-1/2 top-[47%] rounded-full" style={{ ...circle(0.7, 620), background: `radial-gradient(circle, ${accent}cc, ${accent}33 55%, transparent 70%)` }}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }} transition={{ duration: 0.6, delay: 0.15 }} />
      <Confetti seed={101} x="50%" y="45%" delay={0.3} count={90} spread={760} />
      <Confetti seed={202} x="20%" y="30%" delay={0.7} count={40} spread={420} />
      <Confetti seed={303} x="80%" y="35%" delay={0.9} count={40} spread={420} />
    </>
  );
  if (effect === "stars") return (
    <>
      <motion.div className="absolute left-1/2 top-[47%] rounded-full" style={{ ...circle(0.85, 760), background: `repeating-conic-gradient(${accent}66 0deg 10deg, transparent 10deg 20deg)`, maskImage: "radial-gradient(circle, black 25%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, black 25%, transparent 70%)" }}
        initial={{ scale: 0, rotate: 0 }} animate={{ scale: 1, rotate: 90 }} transition={{ duration: 3, ease: "easeOut" }} />
      <StarBurst seed={7} x="50%" y="46%" delay={0.3} count={22} size={46} />
      <StarBurst seed={9} x="50%" y="46%" delay={0.75} count={16} size={30} />
    </>
  );
  if (effect === "bubbles") return (
    <>
      <Bubbles seed={55} count={18} delay={0.1} />
      <motion.span className="absolute left-1/2 top-[46%] rounded-full" style={{ ...circle(0.62, 560), background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), ${accent}66 45%, ${accent}22 70%, transparent 72%)`, boxShadow: `inset 0 0 0 4px rgba(255,255,255,0.6), 0 0 80px ${accent}88` }}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.12, 0.96, 1] }} transition={{ duration: 0.9, delay: 0.15 }} />
    </>
  );
  return (
    <>
      <div className="absolute inset-0" style={{ opacity: 0.92 }}>
        <Splat seed={42} color={accent} x="50%" y="47%" size={Math.min(vw * 0.62, 560)} delay={0.18} rotate={-12} />
      </div>
      <Splat seed={77} color="#ff3d78" x="22%" y="30%" size={150} delay={0.42} rotate={30} />
      <Splat seed={13} color="#0aa89e" x="80%" y="68%" size={170} delay={0.55} rotate={120} />
      <Splat seed={91} color="#ffc233" x="74%" y="24%" size={90} delay={0.66} rotate={200} />
      <Splat seed={5} color="#7cff3a" x="26%" y="74%" size={80} delay={0.78} rotate={300} />
    </>
  );
}

// Mira que se desenha e "trava" (paintball).
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

// Abertura com emoji (atividades sem mira): aparece aos saltos com um anel.
function EmojiOpener({ emoji, accent }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
      <motion.span className="absolute rounded-full border-4" style={{ width: 200, height: 200, borderColor: accent }}
        initial={{ scale: 0.2, opacity: 1 }} animate={{ scale: [0.2, 1.4], opacity: [1, 0] }} transition={{ duration: 0.9, repeat: 1 }} />
      <motion.span className="text-8xl" initial={{ scale: 0, y: 60, rotate: -30 }} animate={{ scale: [0, 1.3, 1], y: [60, -30, 0], rotate: [-30, 10, 0] }} transition={{ duration: 0.7, ease: "easeOut" }}>
        {emoji}
      </motion.span>
    </div>
  );
}

const SHOT = 0.62;          // duração de cada fotografia na montagem (s)

export default function CinematicIntro({ images, title, tagline, theme = {}, storageKey, onDone }) {
  const { accent = "#ff6a00", effect = "paint", words = [], emoji = "🎯", crosshair = effect === "paint", title: introTitle } = theme;
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [phase, setPhase] = useState("open");     // open → montage → title → exit
  const [shot, setShot] = useState(0);
  const [visible, setVisible] = useState(true);
  // Até 6 fotos na montagem; a seguinte (ou a primeira) fica por trás do título.
  const montage = images.slice(0, Math.min(6, Math.max(1, images.length - 1)));

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

  // Título da intro (o tema pode ter um mais curto, ex.: "ATL"); parte só entre palavras.
  const shownTitle = (introTitle || title).toUpperCase();
  const letters = shownTitle.replace(/ /g, "").split("");
  const titleWords = shownTitle.split(" ").filter(Boolean);
  const lastImage = images[montage.length] || images[0];
  const bouncy = effect !== "paint";
  // Títulos compridos (ex.: "Festas de Aniversário") ficam mais pequenos.
  const longest = Math.max(...titleWords.map((w) => w.length));
  const titleSize = longest > 11 || letters.length > 18 ? "text-[11vw] md:text-[5.5rem]" : letters.length > 14 ? "text-[9vw] md:text-[6.5rem]" : letters.length > 9 ? "text-[12vw] md:text-[8.5rem]" : "text-[17vw] md:text-[12rem]";

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div key="intro" className="fixed inset-0 z-[100] overflow-hidden bg-black text-white select-none"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.7, ease: [0.7, 0, 0.3, 1] } }}
          style={{ clipPath: "circle(150% at 50% 50%)" }}>
          {/* Câmara: treme (paintball) ou salta (restantes) nos impactos */}
          <motion.div className="absolute inset-0"
            animate={phase === "title" ? (bouncy ? { y: [0, -18, 0, -8, 0], scale: [1, 1.02, 1] } : { x: [0, -14, 12, -8, 6, 0], y: [0, 8, -10, 6, -3, 0] }) : {}}
            transition={{ duration: bouncy ? 0.7 : 0.45, delay: 0.25 }}>
            {/* 1) Abertura */}
            {phase === "open" && (
              <>
                <motion.p className="absolute left-1/2 top-[22%] -translate-x-1/2 text-xs md:text-lg font-semibold tracking-[0.6em] text-white/80 whitespace-nowrap"
                  initial={{ opacity: 0, letterSpacing: "1.2em" }} animate={{ opacity: 1, letterSpacing: "0.6em" }} transition={{ duration: 0.8 }}>
                  DESAFIAR VIANA APRESENTA
                </motion.p>
                {crosshair ? <Crosshair /> : <EmojiOpener emoji={emoji} accent={accent} />}
              </>
            )}

            {/* 2) Montagem */}
            {phase === "montage" && (
              <AnimatePresence>
                <motion.div key={shot} className="absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.05 } }}>
                  <motion.img src={montage[shot]} alt="" className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: bouncy ? 1.25 : 1.35, rotate: shot % 2 ? 2 : -2, filter: "contrast(1.25) saturate(1.45) brightness(0.92)" }}
                    animate={bouncy ? { scale: [1.25, 1.02, 1.07], rotate: 0 } : { scale: 1.05, rotate: 0 }}
                    transition={{ duration: SHOT + 0.2, ease: "easeOut" }} />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
                  <motion.div className="absolute inset-0" style={{ background: bouncy ? accent : "#fff" }} initial={{ opacity: bouncy ? 0.55 : 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                  <ShotEffect effect={effect} shot={shot} />
                  {words.length > 0 && (
                    <motion.p className="absolute bottom-[16%] left-1/2 -translate-x-1/2 font-display text-5xl md:text-8xl tracking-wide whitespace-nowrap"
                      style={{ textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}
                      initial={bouncy ? { scale: 0, rotate: -8, opacity: 0 } : { scale: 2.4, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={bouncy ? { type: "spring", stiffness: 420, damping: 12 } : { duration: 0.22, ease: [0.2, 1.3, 0.4, 1] }}>
                      {words[shot % words.length]}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* 3) Título */}
            {(phase === "title" || phase === "exit") && (
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <motion.img src={lastImage} alt="" className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.25, filter: "blur(6px) brightness(0.35)" }} animate={{ scale: 1.08, filter: "blur(0px) brightness(0.45)" }} transition={{ duration: 2.4, ease: "easeOut" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                <TitleEffect effect={effect} accent={accent} />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <div className={`flex flex-wrap justify-center font-display leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${titleSize}`}>
                    {titleWords.map((w, wi) => {
                      const before = titleWords.slice(0, wi).join("").length;
                      return (
                        <span key={wi} className="inline-flex whitespace-nowrap mx-[0.12em]">
                          {w.split("").map((l, li) => {
                            const i = before + li;
                            return (
                              <motion.span key={li}
                                initial={bouncy ? { y: -320, scale: 1.4, opacity: 0 } : { y: -260, scale: 3, opacity: 0, rotate: (i % 2 ? 12 : -12) }}
                                animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.2 + i * (letters.length > 14 ? 0.035 : 0.06), type: "spring", stiffness: bouncy ? 420 : 520, damping: bouncy ? 13 : 18 }}>
                                {l}
                              </motion.span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                  <motion.div className="h-1.5 rounded-full mt-3" style={{ background: bouncy ? accent : "#fff" }} initial={{ width: 0 }} animate={{ width: "min(60vw, 520px)" }} transition={{ delay: 0.75, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                  <motion.p className="mt-4 text-base md:text-2xl font-semibold tracking-wide text-white/90 text-center"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.5 }}>
                    {tagline}
                  </motion.p>
                </div>
                {crosshair && <Crosshair size={Math.min(typeof window !== "undefined" ? window.innerWidth * 0.95 : 680, 680)} delay={0.6} opacity={0.35} />}
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
