// A shuffled copy (Fisher-Yates); the input is left alone. The random source is a parameter so tests can fix it.
export function shuffle<T>(
  items: readonly T[],
  random: () => number = Math.random
): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
