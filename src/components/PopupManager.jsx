import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { usePopups } from "../lib/usePopups";
import { fontFamilyFor } from "../lib/fonts";

const MOTION = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35 } },
  "slide-down": { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -50 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  "slide-up": { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  "slide-left": { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 60 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  "slide-right": { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -60 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  zoom: { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.85 }, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  bounce: { initial: { opacity: 0, y: 30, scale: 0.92 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.95 }, transition: { type: "spring", stiffness: 320, damping: 18 } },
};

const TEXT_PX = {
  sm: { title: 16, message: 13 },
  md: { title: 20, message: 15 },
  lg: { title: 26, message: 17 },
};

const CORNER_POS = {
  "top-left": "top-5 left-5",
  "top-right": "top-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
};

function dismissedKey(id) {
  return `dv_popup_dismissed_${id}`;
}

function PopupContent({ p, onClose }) {
  const sizes = TEXT_PX[p.textSize] || TEXT_PX.md;
  const style = { fontFamily: fontFamilyFor(p.fontFamily) || undefined };
  const showImage = p.imageUrl && (p.contentType === "image" || p.contentType === "both");
  const showText = p.contentType !== "image" && (p.title || p.message);

  return (
    <>
      {showImage && (
        <img src={p.imageUrl} alt="" className={p.contentType === "image" ? "w-full h-full object-cover" : "w-full h-40 object-cover"} />
      )}
      {showText && (
        <div className="px-5 py-4" style={style}>
          {p.title && <p className="font-display font-bold uppercase mb-1" style={{ fontSize: sizes.title, color: p.textColor }}>{p.title}</p>}
          {p.message && <p className="leading-relaxed" style={{ fontSize: sizes.message, color: p.textColor, opacity: 0.9 }}>{p.message}</p>}
          {p.linkUrl && p.linkLabel && (
            <a href={p.linkUrl} target="_blank" rel="noopener noreferrer" onClick={onClose}
              className="inline-block mt-3 px-4 py-2 rounded-full text-xs font-bold text-white transition-transform hover:scale-105"
              style={{ background: p.accentColor }}>
              {p.linkLabel}
            </a>
          )}
        </div>
      )}
    </>
  );
}

function CloseButton({ onClose, dark }) {
  return (
    <button onClick={onClose} aria-label="Fechar"
      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${dark ? "bg-black/10 hover:bg-black/20 text-current" : "bg-white/90 hover:bg-white text-ink shadow-sm"}`}>
      <X size={13} />
    </button>
  );
}

function PopupItem({ p }) {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(dismissedKey(p.id)) !== "1");
  const motionProps = MOTION[p.animation] || MOTION.fade;

  const close = () => {
    try { sessionStorage.setItem(dismissedKey(p.id), "1"); } catch { /* ignora falha de sessionStorage (modo privado) */ }
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    if (p.closeMode === "timer" || p.closeMode === "both") {
      if (!p.autoCloseSeconds) return;
      const t = setTimeout(close, p.autoCloseSeconds * 1000);
      return () => clearTimeout(t);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const showX = p.closeMode === "x" || p.closeMode === "both";

  if (p.kind === "modal") {
    return (
      <AnimatePresence>
        {visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              {...motionProps}
              className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: p.bgColor }}
            >
              {showX && <CloseButton onClose={close} />}
              <PopupContent p={p} onClose={close} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  if (p.kind === "bar") {
    const isTop = p.position === "top";
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            {...motionProps}
            className={`fixed left-0 right-0 z-[90] flex items-center justify-center gap-4 px-5 ${isTop ? "top-0" : "bottom-0"}`}
            style={{ background: p.bgColor, color: p.textColor, minHeight: p.barSize, fontFamily: fontFamilyFor(p.fontFamily) || undefined }}
          >
            <div className="flex items-center gap-3 flex-wrap justify-center text-center py-1.5">
              {p.title && <span className="font-display font-bold uppercase" style={{ fontSize: (TEXT_PX[p.textSize] || TEXT_PX.md).title * 0.75 }}>{p.title}</span>}
              {p.message && <span style={{ fontSize: (TEXT_PX[p.textSize] || TEXT_PX.md).message, opacity: 0.9 }}>{p.message}</span>}
              {p.linkUrl && p.linkLabel && (
                <a href={p.linkUrl} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-transform hover:scale-105 shrink-0"
                  style={{ background: p.accentColor }}>
                  {p.linkLabel}
                </a>
              )}
            </div>
            {showX && (
              <button onClick={close} aria-label="Fechar" className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                <X size={13} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // kind === "corner"
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          {...motionProps}
          className={`fixed z-[90] rounded-2xl overflow-hidden shadow-2xl ${CORNER_POS[p.position] || CORNER_POS["bottom-right"]}`}
          style={{ background: p.bgColor, width: p.cornerWidth, maxWidth: "calc(100vw - 2.5rem)" }}
        >
          {showX && <CloseButton onClose={close} />}
          <PopupContent p={p} onClose={close} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PopupManager() {
  const popups = usePopups();
  const ordered = useMemo(() => [...popups].sort((a, b) => a.displayOrder - b.displayOrder), [popups]);
  return (
    <>
      {ordered.map((p) => <PopupItem key={p.id} p={p} />)}
    </>
  );
}
