export function* randomQueue(arr = [], rng = Math.random) {
  let available = [...arr];

  while (available.length > 0) {
    const entry = available[Math.floor(rng() * available.length)];
    available = available.filter((e) => e !== entry);
    yield entry;
  }
}
