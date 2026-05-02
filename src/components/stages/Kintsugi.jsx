import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

const HEART_PATH =
  'M 200 320 C 200 320 40 220 40 120 C 40 60 80 20 130 20 C 160 20 185 40 200 60 C 215 40 240 20 270 20 C 320 20 360 60 360 120 C 360 220 200 320 200 320 Z';

// Peças do coração — posição inicial será calculada dinamicamente
const PIECE_DEFS = [
  { id: 'tl', label: 'Confiança', emoji: '🤍', clipPath: 'polygon(0% 0%, 50% 0%, 50% 55%, 0% 40%)', quadrant: [-1, -1] },
  { id: 'tr', label: 'Sonhos', emoji: '✨', clipPath: 'polygon(50% 0%, 100% 0%, 100% 40%, 50% 55%)', quadrant: [1, -1] },
  { id: 'bl', label: 'Coragem', emoji: '🔥', clipPath: 'polygon(0% 40%, 50% 55%, 50% 100%, 0% 100%)', quadrant: [-1, 1] },
  { id: 'br', label: 'Esperança', emoji: '🌟', clipPath: 'polygon(50% 55%, 100% 40%, 100% 100%, 50% 100%)', quadrant: [1, 1] },
];

// ─── Peça individual ──────────────────────────────────────────────────────────
const KintsugiPiece = ({ piece, initOffset, snapRadius, onSnap, pieceSize }) => {
  const [offset, setOffset] = useState(initOffset);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef(null);

  // Atualiza posição inicial se o container mudar (resize)
  useEffect(() => {
    setOffset(initOffset);
  }, [initOffset.x, initOffset.y]);

  const startDrag = useCallback((clientX, clientY) => {
    setDragging(true);
    dragOrigin.current = { mouseX: clientX, mouseY: clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!dragOrigin.current) return;
    setOffset({
      x: dragOrigin.current.ox + (clientX - dragOrigin.current.mouseX),
      y: dragOrigin.current.oy + (clientY - dragOrigin.current.mouseY),
    });
  }, []);

  const endDrag = useCallback((clientX, clientY) => {
    if (!dragOrigin.current) return;
    setDragging(false);
    const finalX = dragOrigin.current.ox + (clientX - dragOrigin.current.mouseX);
    const finalY = dragOrigin.current.oy + (clientY - dragOrigin.current.mouseY);
    const dist = Math.sqrt(finalX ** 2 + finalY ** 2);
    if (dist <= snapRadius) {
      onSnap(piece.id);
    } else {
      setOffset(initOffset); // volta ao ponto inicial com spring
    }
    dragOrigin.current = null;
  }, [initOffset, snapRadius, piece.id, onSnap]);

  // Mouse
  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
    const mm = (e) => moveDrag(e.clientX, e.clientY);
    const mu = (e) => { endDrag(e.clientX, e.clientY); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
  };

  // Touch
  const handleTouchStart = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
    const tm = (e) => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); };
    const tu = (e) => { const t = e.changedTouches[0]; endDrag(t.clientX, t.clientY); window.removeEventListener('touchmove', tm); window.removeEventListener('touchend', tu); };
    window.addEventListener('touchmove', tm, { passive: false });
    window.addEventListener('touchend', tu);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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
          ? 'drop-shadow(0 0 20px rgba(200,160,255,0.6))'
          : 'drop-shadow(0 4px 14px rgba(0,0,0,0.5))',
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
      }}
    >
      <svg width={pieceSize} height={pieceSize} viewBox="0 0 400 340" style={{ display: 'block', pointerEvents: 'none' }}>
        <g style={{ clipPath: piece.clipPath }}>
          <path d={HEART_PATH} fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        </g>
      </svg>
      {/* Label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', gap: '3px',
      }}>
        <span style={{ fontSize: `${pieceSize * 0.2}px` }}>{piece.emoji}</span>
        <span style={{ fontSize: `${Math.max(pieceSize * 0.07, 8)}px`, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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

  // Posições iniciais calculadas dinamicamente: 42% da metade da área
  const spread = { x: dims.w * 0.42, y: dims.h * 0.42 };
  const pieceSize = Math.min(dims.w, dims.h) * 0.44; // peça = 44% do menor lado
  const snapRadius = pieceSize * 0.55; // zona de snap generosa

  const getInitOffset = (quadrant) => ({
    x: quadrant[0] * spread.x,
    y: quadrant[1] * spread.y,
  });

  const handleSnap = useCallback((id) => {
    setSnapped(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length === PIECE_DEFS.length) setTimeout(nextStage, 3000);
      return next;
    });
  }, [nextStage]);

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
        height: '100vh',
        overflow: 'hidden',
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
          fontSize: 'clamp(1.1rem, 3.5vw, 2rem)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '0.3rem',
          lineHeight: 1.3,
        }}>
          Junte os pedaços. Reconstituía-se.
        </h2>
        <p style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: '0.25rem' }}>
          Arraste cada fragmento para o centro do coração.
        </p>
        <motion.p
          animate={{ color: snapped.length > 0 ? 'rgba(200,160,255,0.8)' : 'rgba(255,255,255,0.3)' }}
          style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}
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
          maxHeight: '520px',
          flexShrink: 1,
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
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.12)"
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
                  <path d={HEART_PATH} fill="rgba(255,215,0,0.18)" stroke="rgba(255,215,0,0.85)" strokeWidth="3" />
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
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: '2rem' }}>✨</motion.span>
            <p style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', color: 'rgba(255,215,0,0.95)', fontStyle: 'italic', fontWeight: 300, maxWidth: '340px' }}>
              "O que foi quebrado, curado em ouro, brilha mais forte."
            </p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em' }}>

            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Kintsugi;
