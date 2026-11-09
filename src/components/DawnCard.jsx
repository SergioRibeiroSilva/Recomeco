import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Download, Maximize2, X } from 'lucide-react';
import { useJourney } from '../context/journeyContextObject';
import { HEART_PATH, MOOD_LABELS } from '../data/shared';
import { wrapText, clampLines } from '../utils/text';

const W = 1080;
const H = 1920;
const SERIF = "Fraunces, Georgia, 'Times New Roman', serif";
const SANS = "'Nunito Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";
const MAX_INTENTIONS = 6;

const drawCard = async ({ mood, intentions, date }) => {
  try {
    await Promise.all([
      document.fonts.load(`italic 500 44px Fraunces`),
      document.fonts.load(`italic 400 38px Fraunces`),
      document.fonts.load(`500 44px Fraunces`),
      document.fonts.load(`700 28px 'Nunito Sans'`),
    ]);
  } catch { /* usa fontes de fallback */ }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Fundo: do creme matinal ao pêssego do amanhecer
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f6efe4');
  bg.addColorStop(0.55, '#f0d9c3');
  bg.addColorStop(0.85, '#e3b296');
  bg.addColorStop(1, '#d99a7c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Luz suave do sol nascente
  const sun = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, 900);
  sun.addColorStop(0, 'rgba(255,240,215,0.55)');
  sun.addColorStop(1, 'rgba(255,240,215,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Coração Kintsugi: argila com fissuras de ouro antigo
  const heartW = 470;
  const scale = heartW / 400;
  ctx.save();
  ctx.translate((W - heartW) / 2, 140);
  ctx.scale(scale, scale);
  const heart = new Path2D(HEART_PATH);
  ctx.fillStyle = '#ecd3c4';
  ctx.fill(heart);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#a9772f';
  ctx.stroke(heart);
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(200, 60); ctx.lineTo(188, 130); ctx.lineTo(214, 190); ctx.lineTo(196, 320);
  ctx.moveTo(40, 150); ctx.lineTo(120, 168); ctx.lineTo(200, 190); ctx.lineTo(290, 170); ctx.lineTo(360, 150);
  ctx.stroke();
  ctx.restore();

  // Título
  ctx.fillStyle = '#8a4730';
  ctx.font = `700 38px ${SANS}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '12px';
  ctx.fillText('ALVORECER', W / 2, 690);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // Frase do arco de transformação
  const intro = mood
    ? `Hoje cheguei com o coração ${mood.word}, uni meus pedaços em ouro e escolhi cultivar:`
    : 'Hoje recomecei. Uni meus pedaços em ouro e escolhi cultivar:';
  const maxW = W - 150;
  ctx.fillStyle = '#3b2f2a';
  ctx.font = `italic 500 54px ${SERIF}`;
  let y = 790;
  for (const l of wrapText(ctx, intro, maxW)) {
    ctx.fillText(l, W / 2, y);
    y += 74;
  }

  // Intenções (sementes)
  y += 40;
  const list = intentions.slice(0, MAX_INTENTIONS);
  ctx.font = `500 52px ${SERIF}`;
  const maxLines = list.length <= 3 ? 2 : 1;
  for (const item of list) {
    const lines = clampLines(ctx, wrapText(ctx, item.text, maxW - 60), maxLines, maxW - 60);
    // Semente decorativa
    ctx.fillStyle = '#a95b40';
    ctx.beginPath();
    ctx.arc(W / 2, y - 16, 9, 0, Math.PI * 2);
    ctx.fill();
    y += 44;
    ctx.fillStyle = '#3b2f2a';
    for (const l of lines) {
      ctx.fillText(l, W / 2, y);
      y += 66;
    }
    y += 22;
  }

  // Rodapé: data e assinatura
  ctx.fillStyle = '#2b211d';
  ctx.font = `700 40px ${SANS}`;
  ctx.fillText(date, W / 2, H - 130);
  ctx.font = `italic 400 38px ${SERIF}`;
  ctx.fillText('O sol sempre volta.', W / 2, H - 76);

  return canvas;
};

const canvasToBlob = (canvas) =>
  new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

const DawnCard = () => {
  const { userMood, intentions } = useJourney();
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const renderedCanvasRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      // Mantém o foco dentro do diálogo (único controle focável é o botão Fechar)
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [open]);

  const mood = MOOD_LABELS[userMood] || null;
  const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const build = useCallback(
    () => drawCard({ mood, intentions, date }),
    [mood, intentions, date],
  );

  useEffect(() => {
    let cancelled = false;
    renderedCanvasRef.current = null; // invalida o cache quando mood/intenções mudam
    build()
      .then((canvas) => {
        if (!cancelled) {
          renderedCanvasRef.current = canvas;
          setPreview(canvas.toDataURL('image/png'));
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('Não foi possível criar a imagem neste aparelho. Tente novamente mais tarde.');
      });
    return () => { cancelled = true; };
  }, [build]);

  const handleSave = async () => {
    let blob;
    try {
      const canvas = renderedCanvasRef.current ?? (await build());
      renderedCanvasRef.current = canvas;
      blob = await canvasToBlob(canvas);
    } catch {
      blob = null;
    }
    if (!blob) {
      setStatus('Não foi possível gerar a imagem. Tente novamente.');
      return;
    }
    const file = new File([blob], 'alvorecer-recomeco.png', { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Meu Alvorecer' });
        setStatus('Lembrança compartilhada.');
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // pessoa cancelou
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alvorecer-recomeco.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Lembrança salva no seu dispositivo.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
    >
      {preview && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ampliar cartão de Alvorecer"
          style={{ position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'zoom-in' }}
        >
          <img
            src={preview}
            alt="Cartão de Alvorecer com seu humor inicial e as intenções que você plantou"
            style={{
              display: 'block',
              height: 'min(62vh, 560px)',
              maxWidth: '88vw',
              aspectRatio: `${W} / ${H}`,
              borderRadius: '18px',
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-soft)',
            }}
          />
          <span style={{
            position: 'absolute', right: 10, bottom: 10, display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(20,14,30,0.7)', color: '#fbf4ea', borderRadius: 999,
            padding: '6px 12px', fontSize: 'var(--font-tiny)', backdropFilter: 'blur(6px)',
          }}>
            <Maximize2 size={14} aria-hidden="true" /> Toque para ampliar
          </span>
        </button>
      )}
      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cartão de Alvorecer ampliado"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,6,16,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            aria-label="Fechar"
            ref={closeRef}
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', top: 14, right: 14, width: 44, height: 44, borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>
          <img
            src={preview}
            alt="Cartão de Alvorecer ampliado"
            style={{ maxHeight: '94vh', maxWidth: '96vw', objectFit: 'contain', borderRadius: 16 }}
          />
        </div>,
        document.body,
      )}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleSave}
        disabled={!preview}
        className="btn btn-primary"
      >
        <Download size={18} strokeWidth={2} aria-hidden="true" />
        Guardar lembrança (imagem)
      </motion.button>
      <p aria-live="polite" style={{ fontSize: 'var(--font-tiny)', color: 'var(--text-secondary)', minHeight: '1em' }}>
        {status || 'A imagem é criada no seu aparelho. Nada é enviado.'}
      </p>
    </motion.div>
  );
};

export default DawnCard;
