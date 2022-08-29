import me from "../lib/melon.js";
import { SnappedVec2d } from "../helpers/snapped-vec-2d.js";
import { GRID } from "../const/grid.js";
import { canMoveTo } from "../services/navgrid.js";
import CharacterWalkSprite from "./CharacterWalkSprite.js";

const MOVE_SPEED = GRID / 12;
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

const INPUT_DIRECTIONS = {
  none: new me.Vector2d(0, 0),
  up: new me.Vector2d(0, -1),
  left: new me.Vector2d(-1, 0),
  down: new me.Vector2d(0, 1),
  right: new me.Vector2d(1, 0),
};

export default class AgentEntity extends me.Entity {
  constructor(x, y) {
    super(x, y, { height: GRID, width: GRID });

    this.alwaysUpdate = true;

    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 1);

    this.walk = new CharacterWalkSprite(0, 0, {
      image: "HumanBaseAnimations",
    });

    this.inputDirStack = [];
    this.renderable = this.walk;

    // this.posTween = new me.Tween(this.pos);
    // this.moving = false;
    // this.posTween.onStart(() => this.moving = true)
    // this.posTween.onComplete(() => this.moving = false)

    this.cell = new SnappedVec2d(this.pos);
    this.moveToCell = new me.Vector2d().copy(this.cell);
    this.targetCell = new me.Vector2d().copy(this.cell);
  }

  getInputDirection() {
    for (const [key, dir] of Object.entries(INPUT_DIRECTIONS)) {
      if (me.input.isKeyPressed(key)) {
        if (!this.inputDirStack.includes(key)) {
          this.inputDirStack.push(key);
        }
      } else if (this.inputDirStack.includes(key)) {
        this.inputDirStack.splice(this.inputDirStack.indexOf(key), 1);
      }
    }
    console.log(this.inputDirStack);

    return (
      INPUT_DIRECTIONS[this.inputDirStack[this.inputDirStack.length - 1]] ??
      INPUT_DIRECTIONS.none
    );
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

    // if (!this.moving) {
    //   this.targetCell.copy(this.cell).add(inputDir);

    //   if (inputDir.length() && canMoveTo(this.cell, this.targetCell)) {
    //     this.posTween.to(this.targetCell.clone().scale(GRID).add(halfGrid), {
    //       easing: me.Tween.Easing.Linear.None,
    //       duration: 100,
    //       autoStart: true
    //     });
    //   }
    // }

    const moved = moveVec2d(this.pos, moveToPos, MOVE_SPEED);
    this.walk.moved.copy(moved);

    super.update(dt);
    return true;
  }
}
