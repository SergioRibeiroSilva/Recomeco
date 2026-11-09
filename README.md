# Recomeço

Uma jornada gentil, em seis etapas, para quem precisa recomeçar depois de uma perda ou de um fim.

1. **Intro**: escolha como você está se sentindo.
2. **Narrativa**: pequenas frases e perguntas para refletir.
3. **Kintsugi**: junte as peças de um coração (arraste, ou use Enter/Espaço para encaixar).
4. **Respiração**: dissipe a névoa e faça dois ciclos de respiração guiada.
5. **Fortalecimento**: plante três intenções.
6. **Final**: receba um cartão de "Alvorecer" para guardar como imagem.

## Privacidade

Nada é enviado para servidores. O estado vive só na memória do navegador, e a imagem do cartão é gerada no próprio aparelho. As fontes são servidas pelo próprio app (sem Google Fonts).

> Este app é um acolhimento, não substitui apoio profissional.

## Desenvolvimento

Requer Node 22.13 ou mais recente.

```bash
npm install
npm run dev      # servidor local
npm run lint     # ESLint
npm test         # Vitest
npm run build    # build de produção em dist/
npm run preview  # serve o build
```

## Stack

React 19, Vite, framer-motion, lucide-react, canvas-confetti. Estilos em `src/styles/theme.css` (tokens e classes) e inline nos componentes.

## Estrutura

```
src/
  App.jsx                  gerência de etapas e camadas
  context/                 estado da jornada (JourneyContext, useJourney)
  components/stages/       as seis etapas
  components/              fundo, partículas, barra de progresso, DawnCard
  data/, utils/            constantes e helpers (com testes)
```

## Deploy

Push na `main` roda lint, testes e build, e publica no GitHub Pages (`.github/workflows/deploy.yml`). O `base` do Vite é `/Recomeco/`; se o repositório for renomeado, ajuste `vite.config.js` e as URLs em `index.html`.
