// Path do coração usado no Kintsugi e no Cartão de Alvorecer (viewBox 0 0 400 340)
export const HEART_PATH =
  'M 200 320 C 200 320 40 220 40 120 C 40 60 80 20 130 20 C 160 20 185 40 200 60 C 215 40 240 20 270 20 C 320 20 360 60 360 120 C 360 220 200 320 200 320 Z';

export const HEART_VIEWBOX = { width: 400, height: 340 };

// Dados unificados de humor (usados em Intro e DawnCard)
export const MOODS = [
  {
    id: 'triste',
    word: 'triste',
    label: 'Triste',
    sublabel: 'E tudo bem estar triste.',
    bg: '#e3eaf0',
    border: '#8ca3b5',
    tint: '#4f6b80',
  },
  {
    id: 'confuso',
    word: 'confuso',
    label: 'Confuso',
    sublabel: 'Sem saber o que sentir.',
    bg: '#e9e4ee',
    border: '#a79bb5',
    tint: '#6b5c80',
  },
  {
    id: 'exaurido',
    word: 'exausto',
    label: 'Exausto',
    sublabel: 'Sem energia pra nada.',
    bg: '#f3e0d5',
    border: '#c98b6e',
    tint: '#9a4f36',
  },
  {
    id: 'esperancoso',
    word: 'esperançoso',
    label: 'Esperançoso',
    sublabel: 'Querendo recomeçar.',
    bg: '#e1e9d8',
    border: '#8fae8b',
    tint: '#4f6b45',
  },
];

export const MOOD_LABELS = Object.fromEntries(
  MOODS.map(({ id, word, tint }) => [id, { word, tint }]),
);
