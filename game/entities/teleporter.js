import me from "../lib/melon.js";

export default class TeleporterEntity extends me.Sprite {
  constructor(x, y, settings) {
    console.log(settings);
    super(x, y, {
      image: "teleporter",
      anchorPoint: new me.Vector2d(0, 0),
    });
  }
}
