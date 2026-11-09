import { describe, it, expect } from 'vitest';
import { wrapText, clampLines } from './text';

// Contexto falso: cada caractere mede 10px
const ctx = { measureText: (t) => ({ width: t.length * 10 }) };

describe('wrapText', () => {
  it('mantém o texto curto em uma linha', () => {
    expect(wrapText(ctx, 'olá mundo', 200)).toEqual(['olá mundo']);
  });

  it('quebra por palavras quando passa da largura', () => {
    expect(wrapText(ctx, 'um dois três quatro', 90)).toEqual(['um dois', 'três', 'quatro']);
  });

  it('corta palavras maiores que a largura por caractere', () => {
    expect(wrapText(ctx, 'abcdefghij', 50)).toEqual(['abcde', 'fghij']);
  });

  it('ignora espaços extras e texto vazio', () => {
    expect(wrapText(ctx, '   ', 100)).toEqual([]);
  });
});

describe('clampLines', () => {
  it('não altera quando cabe', () => {
    expect(clampLines(ctx, ['a', 'b'], 3, 100)).toEqual(['a', 'b']);
  });

  it('limita as linhas e adiciona reticências na última', () => {
    expect(clampLines(ctx, ['a', 'b', 'c'], 2, 100)).toEqual(['a', 'b…']);
  });

  it('encurta a última linha para caber com as reticências', () => {
    expect(clampLines(ctx, ['aaaa', 'bbbbbb', 'c'], 2, 50)).toEqual(['aaaa', 'bbbb…']);
  });
});
