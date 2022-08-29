import { GRID } from "../const/grid.js";
import me from "../lib/melon.js";

export default class TunnelEntity extends me.Sprite {
  constructor(x, y, settings) {
    super(x, y, {
      image: "tunnel",
      anchorPoint: new me.Vector2d(0, 0),
      width: GRID,
      height: GRID * 2,
    });
  }
}
