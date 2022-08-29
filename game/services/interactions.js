import { DIRECTION } from "../const/direction.js";

export const INTERACTION_SIDE = {
  NONE: 0,
  RIGHT: 1,
  LEFT: 2,
  UP: 4,
  DOWN: 8,
  UNDER: 16,
  ALL: 1 | 2 | 4 | 8 | 16,
};

export const DIRECTION_TO_SIDE = {
  [DIRECTION.UP]: INTERACTION_SIDE.UP,
  [DIRECTION.DOWN]: INTERACTION_SIDE.DOWN,
  [DIRECTION.LEFT]: INTERACTION_SIDE.LEFT,
  [DIRECTION.RIGHT]: INTERACTION_SIDE.RIGHT,
};

const cells = new Map();

const getKey = (v) => [v.x, v.y].join(",");

export function clearAllInteractions() {
  cells.clear();
}
export function clearInteraction(v) {
  cells.delete(getKey(v));
}

export function setCellInteraction(v, sides = INTERACTION_SIDE.NONE, callback) {
  cells.set(getKey(v), { sides, callback });
}

export function listInteractions() {
  return Array.from(cells);
}
export function getCellInteraction(v, side = INTERACTION_SIDE.ALL) {
  const interaction = cells.get(getKey(v));
  if (interaction && interaction.sides & side) {
    return interaction;
  }
  return null;
}
