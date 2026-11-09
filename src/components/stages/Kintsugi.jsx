import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Flame, Sun } from 'lucide-react';
import { useJourney } from '../../context/journeyContextObject';

import { HEART_PATH } from '../../data/shared';

// Peças do coração — posição inicial será calculada dinamicamente
const PIECE_DEFS = [
  { id: 'tl', label: 'Confiança', Icon: ShieldCheck, clipPath: 'polygon(0% 0%, 50% 0%, 50% 55%, 0% 40%)', quadrant: [-1, -1] },
  { id: 'tr', label: 'Sonhos', Icon: Sparkles, clipPath: 'polygon(50% 0%, 100% 0%, 100% 40%, 50% 55%)', quadrant: [1, -1] },
  { id: 'bl', label: 'Coragem', Icon: Flame, clipPath: 'polygon(0% 40%, 50% 55%, 50% 100%, 0% 100%)', quadrant: [-1, 1] },
  { id: 'br', label: 'Esperança', Icon: Sun, clipPath: 'polygon(50% 55%, 100% 40%, 100% 100%, 50% 100%)', quadrant: [1, 1] },
];

// ─── Peça individual ──────────────────────────────────────────────────────────
const KintsugiPiece = ({ piece, initOffset, snapRadius, onSnap, pieceSize }) => {
  // null = peça na posição inicial (acompanha resize sem precisar de effect)
  const [dragOffset, setDragOffset] = useState(null);
  const [dragging, setDragging] = useState(false);
  const offset = dragOffset ?? initOffset;
  const offsetRef = useRef(offset);
  useEffect(() => { offsetRef.current = offset; });
  const dragOrigin = useRef(null);
  const pieceRef = useRef(null);
  const cleanupRef = useRef(null); // remove listeners de window de um arrasto em andamento

  const startDrag = useCallback((clientX, clientY) => {
    setDragging(true);
    dragOrigin.current = { mouseX: clientX, mouseY: clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
  }, []);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!dragOrigin.current) return;
    setDragOffset({
      x: dragOrigin.current.ox + (clientX - dragOrigin.current.mouseX),
      y: dragOrigin.current.oy + (clientY - dragOrigin.current.mouseY),
    });
  }, []);

  const endDrag = useCallback((clientX, clientY, cancelled = false) => {
    if (!dragOrigin.current) return;
    setDragging(false);
    const finalX = dragOrigin.current.ox + (clientX - dragOrigin.current.mouseX);
    const finalY = dragOrigin.current.oy + (clientY - dragOrigin.current.mouseY);
    const dist = Math.sqrt(finalX ** 2 + finalY ** 2);
    if (!cancelled && dist <= snapRadius) {
      onSnap(piece.id);
    } else {
      setDragOffset(null); // volta ao ponto inicial com spring
    }
    dragOrigin.current = null;
  }, [snapRadius, piece.id, onSnap]);

  // Remove listeners pendentes se a peça sair da tela durante um arrasto
  useEffect(() => () => cleanupRef.current?.(), []);

  // Mouse
  const handleMouseDown = (e) => {
    e.preventDefault();
    cleanupRef.current?.();
    startDrag(e.clientX, e.clientY);
    const mm = (ev) => moveDrag(ev.clientX, ev.clientY);
    const mu = (ev) => { cleanup(); endDrag(ev.clientX, ev.clientY); };
    const cleanup = () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      cleanupRef.current = null;
    };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    cleanupRef.current = cleanup;
  };

  // Teclado: Enter/Espaço encaixa a peça no lugar (alternativa ao arrastar)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setDragOffset({ x: 0, y: 0 });
      onSnap(piece.id);
    }
  };

  // Touch registrado de forma ativa (passive: false) para permitir preventDefault sem avisos no console
  useEffect(() => {
    const el = pieceRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      cleanupRef.current?.();
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
      const last = { x: t.clientX, y: t.clientY };
      const tm = (ev) => { const p = ev.touches[0]; last.x = p.clientX; last.y = p.clientY; moveDrag(p.clientX, p.clientY); };
      const tu = (ev) => { const p = ev.changedTouches[0]; cleanup(); endDrag(p.clientX, p.clientY); };
      const tc = () => { cleanup(); endDrag(last.x, last.y, true); };
      const cleanup = () => {
        window.removeEventListener('touchmove', tm);
        window.removeEventListener('touchend', tu);
        window.removeEventListener('touchcancel', tc);
        cleanupRef.current = null;
      };
      window.addEventListener('touchmove', tm, { passive: false });
      window.addEventListener('touchend', tu);
      window.addEventListener('touchcancel', tc);
      cleanupRef.current = cleanup;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
    };
  }, [startDrag, moveDrag, endDrag]);

  return (
    <div
      ref={pieceRef}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Encaixar a peça ${piece.label}`}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
        transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: dragging ? 50 : 10,
        touchAction: 'none',
        userSelect: 'none',
        filter: dragging
          ? 'drop-shadow(0 8px 14px rgba(59,47,42,0.30))'
          : 'drop-shadow(0 3px 8px rgba(59,47,42,0.22))',
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
      }}
    >
      <svg width={pieceSize} height={pieceSize} viewBox="0 0 400 340" style={{ display: 'block', pointerEvents: 'none' }}>
        <g style={{ clipPath: piece.clipPath }}>
          <path d={HEART_PATH} fill="rgba(201,139,110,0.22)" stroke="rgba(59,47,42,0.5)" strokeWidth="3" />
        </g>
      </svg>
      {/* Label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', gap: '3px',
      }}>
        <piece.Icon size={Math.max(pieceSize * 0.2, 18)} strokeWidth={1.6} color="#8a4730" aria-hidden="true" />
        <span style={{ fontSize: `${Math.max(pieceSize * 0.085, 12)}px`, color: 'var(--text-main)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
          {piece.label}
        </span>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Kintsugi = () => {
  const { nextStage } = useJourney();
  const [snapped, setSnapped] = useState([]);
  const areaRef = useRef(null);
  const [dims, setDims] = useState({ w: 400, h: 380 }); // dimensões da área de jogo
  const allSnapped = snapped.length === PIECE_DEFS.length;

  // Mede a área de jogo e atualiza ao resize
  useEffect(() => {
    const measure = () => {
      if (!areaRef.current) return;
      const r = areaRef.current.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    };
    measure();
    const obs = new ResizeObserver(measure);
    if (areaRef.current) obs.observe(areaRef.current);
    return () => obs.disconnect();
  }, []);

  // Posições iniciais calculadas dinamicamente: 30% da metade da área para não sair da tela no mobile
  const spread = { x: dims.w * 0.30, y: dims.h * 0.30 };
  const pieceSize = Math.min(dims.w, dims.h) * 0.44; // peça = 44% do menor lado
  const snapRadius = pieceSize * 0.55; // zona de snap generosa

  const getInitOffset = (quadrant) => ({
    x: quadrant[0] * spread.x,
    y: quadrant[1] * spread.y,
  });

  const handleSnap = useCallback((id) => {
    setSnapped(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // Ao completar o coração, avança depois de uma pausa (limpa no unmount)
  useEffect(() => {
    if (!allSnapped) return;
    const t = setTimeout(nextStage, 3000);
    return () => clearTimeout(t);
  }, [allSnapped, nextStage]);

  // Tamanho do SVG do coração alvo (proporcional ao container)
  const heartDisplaySize = Math.min(dims.w * 0.55, dims.h * 0.55, 220);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100dvh',
        overflowX: 'hidden',
        position: 'relative',
        padding: '1rem 1rem 6rem 1rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center', marginBottom: '1rem', zIndex: 20, flexShrink: 0 }}
      >
        <h2 style={{
          fontSize: 'var(--font-title)',
          fontWeight: 500,
          color: 'var(--text-main)',
          marginBottom: '0.3rem',
          lineHeight: 1.3,
        }}>
          Junte os pedaços. Reconstrua-se.
        </h2>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-subtitle)', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
          Arraste cada fragmento e comece a reconstrução.
        </p>
        <motion.p
          animate={{ color: snapped.length > 0 ? '#8a4730' : '#6f6057' }}
          className="t-eyebrow"
          aria-live="polite"
        >
          {snapped.length} / {PIECE_DEFS.length} peças reunidas
        </motion.p>
      </motion.div>

      {/* Área de jogo — ocupa o espaço restante */}
      <div
        ref={areaRef}
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          maxWidth: '520px',
          maxHeight: allSnapped ? (dims.w < 500 ? '240px' : '340px') : '520px',
          flexShrink: 1,
          transition: 'max-height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Silhueta tracejada (alvo) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 5,
        }}>
          <svg width={heartDisplaySize} height={heartDisplaySize * 0.92} viewBox="0 0 400 340">
            <path
              d={HEART_PATH}
              fill="rgba(169,119,47,0.06)"
              stroke="rgba(59,47,42,0.35)"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </svg>
        </div>

        {/* Peças encaixadas (ouro) */}
        {snapped.map(id => {
          const piece = PIECE_DEFS.find(p => p.id === id);
          return (
            <div key={`snap-${id}`} style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `translate(-50%, -50%)`,
              pointerEvents: 'none', zIndex: 6,
              width: `${pieceSize}px`, height: `${pieceSize}px`,
            }}>
              <motion.svg
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                width={pieceSize} height={pieceSize} viewBox="0 0 400 340"
              >
                <g style={{ clipPath: piece.clipPath }}>
                  <path d={HEART_PATH} fill="rgba(169,119,47,0.28)" stroke="#a9772f" strokeWidth="3" />
                </g>
              </motion.svg>
            </div>
          );
        })}

        {/* Peças arrastáveis */}
        {PIECE_DEFS.filter(p => !snapped.includes(p.id)).map(piece => (
          <KintsugiPiece
            key={piece.id}
            piece={piece}
            initOffset={getInitOffset(piece.quadrant)}
            snapRadius={snapRadius}
            onSnap={handleSnap}
            pieceSize={pieceSize}
          />
        ))}
      </div>

      {/* Mensagem final */}
      <AnimatePresence>
        {allSnapped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              flexShrink: 0,
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ display: 'flex', color: '#a9772f' }}><Sparkles size={34} strokeWidth={1.5} aria-hidden="true" /></motion.span>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-subtitle)', color: 'var(--clay-dark)', fontStyle: 'italic', fontWeight: 500, maxWidth: '340px' }}>
              "Uma vez provado, o ouro brilha mais forte."
            </p>
            <p style={{ fontSize: 'var(--font-small)', color: 'var(--text-secondary)', letterSpacing: '0.07em' }}>

            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Kintsugi;
