import { GRID } from "../const/grid.js";
import { SnappedVec2d } from "../helpers/snapped-vec-2d.js";
import me from "../lib/melon.js";
import { getCellInteraction } from "../services/interactions.js";
// import { loadIpfsWorld } from "../services/world-manager.js";
// import DoorEntity from "./door.js";

const imageFrames = (x, y, w, count) =>
  new Array(count).fill(0).map((_, i) => y * w + x + i);

const MOVE_SPEED = 1;

export default class CharacterWalkSprite extends me.Sprite {
  constructor(x, y, settings) {
    super(x, y, {
      height: GRID,
      width: GRID,
      framewidth: 32,
      frameheight: 32,
      anchorPoint: new me.Vector2d(0.5, 0.5),
      ...settings,
    });

    // define a basic walking animation
    this.addAnimation("walk-down-right", imageFrames(0, 21, 16, 4), 100);
    this.addAnimation("walk-down-left", imageFrames(0, 22, 16, 4), 100);
    this.addAnimation("walk-up-right", imageFrames(0, 23, 16, 4), 100);
    this.addAnimation("walk-up-left", imageFrames(0, 24, 16, 4), 100);

    this.addAnimation("idle-down-right", imageFrames(0, 11, 16, 16), 200);
    this.addAnimation("idle-down-left", imageFrames(0, 12, 16, 16), 200);
    this.addAnimation("idle-up-right", imageFrames(0, 13, 16, 16), 200);
    this.addAnimation("idle-up-left", imageFrames(0, 14, 16, 16), 200);

    this.action = "idle";
    this.actionTime = 0;

    this.faceHDirection = "right";
    this.faceVDirection = "down";

    this.moved = new me.Vector2d(0, 0);
  }

  setCurrentAnimationIfNotSet(animation) {
    if (!this.isCurrentAnimation(animation)) {
      this.setCurrentAnimation(animation);
    }
  }

  changeAction(action) {
    if (this.action !== action) {
      this.action = action;
      this.actionTime = 0;
    }
  }

  update(dt) {
    this.actionTime += dt;

    if (!this.moved.x && !this.moved.y) {
      this.changeAction("idle");
    } else {
      this.changeAction("walk");

      if (this.moved.x > 0) {
        this.faceHDirection = "right";
      } else if (this.moved.x < 0) {
        this.faceHDirection = "left";
      }
      if (this.moved.y > 0) {
        this.faceVDirection = "down";
      } else if (this.moved.y < 0) {
        this.faceVDirection = "up";
      }

      // if the player is walking horizontally for more than .5 sec switch the direction to down
      if (
        this.action === "walk" &&
        this.moved.y === 0 &&
        this.actionTime > 100 &&
        this.faceVDirection === "up"
      ) {
        this.faceVDirection = "down";
      }
    }

    // if player has been idling for > 1 second change direction
    if (
      this.action === "idle" &&
      this.actionTime > 100 &&
      this.faceVDirection === "up"
    ) {
      this.faceVDirection = "down";
    }

    this.setCurrentAnimationIfNotSet(
      [this.action, this.faceVDirection, this.faceHDirection].join("-")
    );

    super.update(dt);
    return true;
  }
}
