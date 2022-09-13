import seedrandom from "../lib/seedrandom.js";

export function* randomizerGenorator(seed) {
  const rng = new seedrandom(seed);

  while (true) {
    yield rng();
  }
}
