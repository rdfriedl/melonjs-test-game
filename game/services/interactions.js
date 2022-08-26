export const SIDES = {
  NONE: 0,
  RIGHT: 1,
  LEFT: 2,
  UP: 4,
  DOWN: 8,
  CENTER: 16,
  ALL: 1 | 2 | 4 | 8 | 16,
};

const cells = new Map();

const getKey = (v) => [v.x, v.y].join(",");

export function clearAllInteractions() {
  cells.clear();
}
export function clearInteractions(v) {
  cells.delete(getKey(v));
}

export function setCellInteraction(v, sides = SIDES.NONE, callback) {
  cells.set(getKey(v), { sides, callback });
}

export function listInteractions() {
  return Array.from(cells);
}
export function getCellInteraction(v, side = SIDES.ALL) {
  const interaction = cells.get(getKey(v));
  if (interaction && interaction.sides & side) {
    return interaction;
  }
  return null;
}
