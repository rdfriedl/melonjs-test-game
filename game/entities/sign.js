import me from "../lib/melon.js";
import { GRID } from "../const/map.js";
import {
  clearInteraction,
  setCellInteraction,
  SIDES,
} from "../services/interactions.js";
import { addCellWall, WALLS } from "../services/navgrid.js";
import { NAV_LAYERS } from "../const/nav.js";

export default class SignEntity extends me.Sprite {
  constructor(x, y, settings) {
    super(x, y, {
      image: "sign",
      anchorPoint: new me.Vector2d(0, 0),
    });

    this.cell = new me.Vector2d(x, y).div(GRID).floor();

    setCellInteraction(this.cell, SIDES.ALL, () => alert("hello world"));
    addCellWall(this.cell, NAV_LAYERS.SIGNS, WALLS.ALL);
  }

  onDestroyEvent() {
    clearInteraction(this.cell);
  }
}
