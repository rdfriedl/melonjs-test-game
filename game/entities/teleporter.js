import { GRID } from "../const/map.js";
import me from "../lib/melon.js";
import {
  clearInteraction,
  setCellInteraction,
  SIDES,
} from "../services/interactions.js";
import { loadLevel } from "../services/level-manager.js";

export default class TeleporterEntity extends me.Sprite {
  constructor(x, y, settings) {
    super(x, y, {
      image: "teleporter",
      anchorPoint: new me.Vector2d(0, 0),
    });

    this.cell = new me.Vector2d(x + GRID, y + GRID).div(GRID).floor();
    setCellInteraction(this.cell, SIDES.ALL, () => {
      loadLevel("islands/small");
    });
  }

  onDestroyEvent() {
    clearInteraction(this.cell);
  }
}
