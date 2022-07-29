import me from "../lib/melon.js";

export default class DoorEntity extends me.Entity {
  constructor(x, y, settings) {
    super(x, y, settings);
    this.loadWorld = settings.loadWorld;
    this.to = settings.to;
  }
}
