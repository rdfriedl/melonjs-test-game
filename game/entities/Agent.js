import me from "../lib/melon.js";
import { SnappedVec2d } from "../helpers/snapped-vec-2d.js";
import { GRID } from "../const/grid.js";
import { canMoveTo } from "../services/navgrid.js";
import CharacterWalkSprite from "./CharacterWalkSprite.js";
import {
  DIRECTION_TO_SIDE,
  getCellInteraction,
  INTERACTION_SIDE,
} from "../services/interactions.js";
import { DIRECTION } from "../const/direction.js";

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

const INPUT_DIRECTION = {
  none: DIRECTION.NONE,
  up: DIRECTION.UP,
  left: DIRECTION.LEFT,
  down: DIRECTION.DOWN,
  right: DIRECTION.RIGHT,
};

export default class AgentEntity extends me.Entity {
  constructor(x, y) {
    super(x, y, { height: GRID, width: GRID });

    this.alwaysUpdate = true;

    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.8);

    this.walk = new CharacterWalkSprite(0, 0, {
      image: "HumanBaseAnimations",
    });

    this.facingDirection = INPUT_DIRECTION.down;
    this.inputDirStack = [];
    this.renderable = this.walk;

    // this.posTween = new me.Tween(this.pos);
    // this.moving = false;
    // this.posTween.onStart(() => this.moving = true)
    // this.posTween.onComplete(() => this.moving = false)

    this.cell = new SnappedVec2d(this.pos);
    this.moveToCell = new me.Vector2d().copy(this.cell);
    this.targetCell = new me.Vector2d().copy(this.cell);

    this._wasInteractionKeyPressed = false;
    this._hasSteppedOnCell = false;
  }

  getInputDirection() {
    for (const [key, dir] of Object.entries(INPUT_DIRECTION)) {
      if (me.input.isKeyPressed(key)) {
        if (!this.inputDirStack.includes(key)) {
          this.inputDirStack.push(key);
        }
      } else if (this.inputDirStack.includes(key)) {
        this.inputDirStack.splice(this.inputDirStack.indexOf(key), 1);
      }
    }

    return (
      INPUT_DIRECTION[this.inputDirStack[this.inputDirStack.length - 1]] ??
      INPUT_DIRECTION.none
    );
  }

  interact() {
    const side = DIRECTION_TO_SIDE[this.facingDirection.clone().scale(-1)];
    const interaction =
      getCellInteraction(this.cell.clone().add(this.facingDirection), side) ||
      getCellInteraction(this.cell, INTERACTION_SIDE.UNDER);
    if (interaction) {
      interaction.callback();
    }
  }
  interactStepOnCell() {
    const interaction = getCellInteraction(this.cell, INTERACTION_SIDE.STAND);
    if (interaction) {
      interaction.callback();
    }
  }

  update(dt) {
    const inputDir = this.getInputDirection();

    // update facing dir
    if (inputDir !== INPUT_DIRECTION.none) {
      this.facingDirection = inputDir;
    }

    const moveToPos = this.moveToCell.clone().scale(GRID).add(halfGrid);
    const distance = new me.Vector2d().copy(this.pos).distance(moveToPos);

    if (distance <= MOVE_SPEED) {
      this.targetCell.copy(this.cell).add(inputDir);

      // step on the cell
      if (!this._hasSteppedOnCell) {
        this.interactStepOnCell();
        this._hasSteppedOnCell = true;
      }

      if (
        (inputDir.x !== 0 && this.pos.y === moveToPos.y) ||
        (inputDir.y !== 0 && this.pos.x === moveToPos.x)
      ) {
        if (canMoveTo(this.cell, this.targetCell)) {
          this.moveToCell.copy(this.targetCell);
          moveToPos.copy(this.moveToCell).scale(GRID).add(halfGrid);
          this._hasSteppedOnCell = false;
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

    if (!this._wasInteractionKeyPressed && me.input.isKeyPressed("confirm")) {
      this.interact();
    }
    this._wasInteractionKeyPressed = me.input.isKeyPressed("confirm");

    super.update(dt);
    return true;
  }
}
