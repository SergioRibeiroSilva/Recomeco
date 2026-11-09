import { describe, it, expect } from 'vitest';
import { HEART_PATH, HEART_VIEWBOX, MOODS, MOOD_LABELS } from './shared';

describe('shared data', () => {
  it('define o path e o viewBox do coração Kintsugi', () => {
    expect(HEART_PATH).toMatch(/^M 200 320.*Z$/);
    expect(HEART_VIEWBOX).toEqual({ width: 400, height: 340 });
  });

  it('mantém os quatro humores sincronizados entre MOODS e MOOD_LABELS', () => {
    expect(MOODS).toHaveLength(4);
    for (const mood of MOODS) {
      expect(mood.id).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.sublabel).toBeTruthy();
      expect(MOOD_LABELS[mood.id]).toEqual({
        word: mood.word,
        tint: mood.tint,
      });
    }
  });
});

