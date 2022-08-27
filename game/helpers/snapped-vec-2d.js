import { GRID } from "../const/map.js";
import me from "../lib/melon.js";

export class SnappedVec2d extends me.Vector2d {
  constructor(vec) {
    super(Math.floor(vec.x / GRID), Math.floor(vec.y / GRID));
    this.vec = vec;

    // attach to the pos update callback
    this._oldFn = vec.onUpdate;
    this._oldScope = vec.scope;
    this.vec.setCallback(this._handleEntityPosUpdate, this);

    this.set(Math.floor(vec.x / GRID), Math.floor(vec.y / GRID));
  }

  _handleEntityPosUpdate(newX, newY, oldX, oldY) {
    const ret = this._oldFn.call(this._oldScope, newX, newY, oldX, oldY);

    // copied from https://github.com/melonjs/melonJS/blob/master/src/math/observable_vector2.js#L85
    let x, y;
    if (ret && "x" in ret) {
      x = ret.x;
    } else {
      x = newX;
    }
    if (ret && "y" in ret) {
      y = ret.y;
    } else {
      y = newY;
    }
    this.set(Math.floor(x / GRID), Math.floor(y / GRID));

    return ret;
  }
}