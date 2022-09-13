import { SnappedVec2d } from "../helpers/snapped-vec-2d.js";
import me from "../lib/melon.js";
import { getCellInteraction } from "../services/interactions.js";

const imageFrames = (x, y, w, count) =>
  new Array(count).fill(0).map((_, i) => y * w + x + i);

const MOVE_SPEED = 1;

export default class OldPlayerEntity extends me.Sprite {
  constructor(x, y) {
    // call the constructor
    super(x, y, {
      height: 8,
      width: 8,
      image: "HumanBaseAnimations",
      framewidth: 32,
      frameheight: 32,
      anchorPoint: new me.Vector2d(0.5, 0.5),
    });

    // player can exit the viewport (jumping, falling into a hole, etc.)
    this.alwaysUpdate = true;

    // set the viewport to follow this on both axis, and enable damping
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 1);

    // define a basic walking animation
    this.addAnimation("walk-down-right", imageFrames(0, 21, 16, 4), 100);
    this.addAnimation("walk-down-left", imageFrames(0, 22, 16, 4), 100);
    this.addAnimation("walk-up-right", imageFrames(0, 23, 16, 4), 100);
    this.addAnimation("walk-up-left", imageFrames(0, 24, 16, 4), 100);

    this.addAnimation("idle-down-right", imageFrames(0, 11, 16, 16), 200);
    this.addAnimation("idle-down-left", imageFrames(0, 12, 16, 16), 200);
    this.addAnimation("idle-up-right", imageFrames(0, 13, 16, 16), 200);
    this.addAnimation("idle-up-left", imageFrames(0, 14, 16, 16), 200);
    // set as default
    this.setCurrentAnimation("walk-down-right");

    this.action = "idle";
    this.actionTime = 0;

    this.faceHDirection = "right";
    this.faceVDirection = "down";

    this.navPath = [];
    this.goToPos = null;

    this.cell = new SnappedVec2d(this.pos);
  }

  setCurrentAnimationIfNotSet(animation) {
    if (!this.isCurrentAnimation(animation)) {
      this.setCurrentAnimation(animation);
    }
  }

  setAction(action) {
    if (this.action !== action) {
      this.action = action;
      this.actionTime = 0;
    }
  }

  update(dt) {
    this.actionTime += dt;

    if (this.navPath.length > 0 && this.goToPos == null) {
      this.goToPos = this.navPath.pop();
    }

    if (this.goToPos) {
      const vel = new me.Vector2d(0, 0);
      if (Math.abs(this.goToPos.x - this.pos.x) > MOVE_SPEED) {
        vel.x = Math.sign(this.goToPos.x - this.pos.x) * MOVE_SPEED;
      }

      if (Math.abs(this.goToPos.y - this.pos.y) > MOVE_SPEED) {
        vel.y = Math.sign(this.goToPos.y - this.pos.y) * MOVE_SPEED;
      }

      if (!vel.x && !vel.y) {
        this.pos.setV(this.goToPos);
        this.goToPos = null;
        this.setAction("idle");

        if (this.navPath.length === 0) {
          this.onCompleteNavPath();
        }
      } else {
        this.pos.add(vel);
        this.setAction("walk");

        if (vel.x > 0) {
          this.faceHDirection = "right";
        } else if (vel.x < 0) {
          this.faceHDirection = "left";
        } else if (vel.y > 0) {
          this.faceVDirection = "down";
        } else if (vel.y < 0) {
          this.faceVDirection = "up";
        }

        // if the player is walking horizontally for more than .5 sec switch the direction to down
        if (
          this.action === "walk" &&
          vel.y === 0 &&
          this.actionTime > 100 &&
          this.faceVDirection === "up"
        ) {
          this.faceVDirection = "down";
        }
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

  setNavPath(path) {
    this.navPath = path ?? [];
    this.goToPos = null;
    this.onStartNavPath(this.navPath);
  }

  onStartNavPath() {}
  onCompleteNavPath() {
    const interaction = getCellInteraction(this.cell);

    if (interaction) {
      interaction.callback();
    }
  }

  // onCollision(response, other) {
  //   if (other instanceof DoorEntity) {
  //     if(other.loadWorld){
  //       loadIpfsWorld(other.loadWorld);
  //       return false;
  //     }
  //     if(other.to){
  //       me.level.load(other.to);
  //       return false;
  //     }
  //   }
  //   // if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
  //   //     // makes the other object solid, by substracting the overlap vector to the current position
  //   //     this.pos.sub(response.overlapV);
  //   //     // not solid
  //   //     return false;
  //   // }
  //   // Make the object solid
  //   return false;
  // }
}
