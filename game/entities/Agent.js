import me from "../lib/melon.js";
import { SnappedVec2d } from "../helpers/snapped-vec-2d.js";
import { GRID } from "../const/map.js";
import { canMoveTo } from "../services/navgrid.js";
import CharacterWalkSprite from "./CharacterWalkSprite.js";

const MOVE_SPEED = 0.8;
const halfGrid = new me.Vector2d(GRID, GRID).scale(0.5);

function moveVec2d(vec, to, speed) {
  const diff = to.clone().sub(vec);
  if (diff.x !== 0) {
    if (Math.abs(diff.x) < speed) {
      vec.x = to.x;
    } else {
      vec.x += Math.sign(diff.x) * speed;
    }
  }
  if (diff.y !== 0) {
    if (Math.abs(diff.y) < speed) {
      vec.y = to.y;
    } else {
      vec.y += Math.sign(diff.y) * speed;
    }
  }
  return new me.Vector2d(Math.sign(diff.x), Math.sign(diff.y));
}

export default class AgentEntity extends me.Entity {
  constructor(x, y) {
    super(x, y, { height: GRID, width: GRID });

    this.alwaysUpdate = true;

    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 1);

    this.walk = new CharacterWalkSprite(0, 0, {
      image: "HumanBaseAnimations",
    });

    this.renderable = this.walk;

    this.cell = new SnappedVec2d(this.pos);
    this.moveToCell = new me.Vector2d().copy(this.cell);
    this.targetCell = new me.Vector2d().copy(this.cell);
  }

  getInputDirection() {
    const dir = new me.Vector2d(0, 0);
    if (me.input.isKeyPressed("left")) dir.x = -1;
    else if (me.input.isKeyPressed("right")) dir.x = 1;
    else if (me.input.isKeyPressed("up")) dir.y = -1;
    else if (me.input.isKeyPressed("down")) dir.y = 1;

    return dir;
  }

  update(dt) {
    const inputDir = this.getInputDirection();

    const moveToPos = this.moveToCell.clone().scale(GRID).add(halfGrid);
    const distance = new me.Vector2d().copy(this.pos).distance(moveToPos);

    if (distance <= MOVE_SPEED) {
      this.targetCell.copy(this.cell).add(inputDir);

      if (
        (inputDir.x !== 0 && this.pos.y === moveToPos.y) ||
        (inputDir.y !== 0 && this.pos.x === moveToPos.x)
      ) {
        if (canMoveTo(this.cell, this.targetCell)) {
          this.moveToCell.copy(this.targetCell);
          moveToPos.copy(this.moveToCell).scale(GRID).add(halfGrid);
        }
      }
    }

    const moved = moveVec2d(this.pos, moveToPos, MOVE_SPEED);
    this.walk.moved.copy(moved);

    super.update(dt);
    return true;
  }
}
