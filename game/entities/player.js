import me from "../lib/melon.js";
import { loadIpfsWorld } from "../services/world-manager.js";
import DoorEntity from "./door.js";

export default class PlayerEntity extends me.Sprite {
  constructor(x, y, settings) {
    // call the constructor
    // dont pass the settings in from the map
    super(x, y, {
      height: 32,
      width: 32,
      image: "Male-01-1",
      framewidth: 32,
      frameheight: 32,
      anchorPoint: new me.Vector2d(0.5, 0.5),
     });

    // set a "player object" type
    // this.body.collisionType = me.collision.types.PLAYER_OBJECT;

    // player can exit the viewport (jumping, falling into a hole, etc.)
    this.alwaysUpdate = true;
    // this.isKinematic = true;

    // this.body.setMaxVelocity(4, 4);
    // this.body.setFriction(1, 1);

    // set the viewport to follow this renderable on both axis, and enable damping
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 1);

    // enable keyboard
    // me.input.bindKey(me.input.KEY.LEFT, "left");
    // me.input.bindKey(me.input.KEY.RIGHT, "right");
    // me.input.bindKey(me.input.KEY.UP, "up");
    // me.input.bindKey(me.input.KEY.DOWN, "down");

    // me.input.bindKey(me.input.KEY.A, "left");
    // me.input.bindKey(me.input.KEY.D, "right");
    // me.input.bindKey(me.input.KEY.W, "up");
    // me.input.bindKey(me.input.KEY.S, "down");

    // this.renderable = new me.Sprite(0, 0, {
    //   image: "Male-01-1",
    //   framewidth: 32,
    //   frameheight: 32,
    //   anchorPoint: new me.Vector2d(0.5, 0.5),
    // });

    // this.renderable.isKinematic = true;

    // define a basic walking animatin
    this.addAnimation("walk-down", [0, 1, 2]);
    this.addAnimation("walk-left", [3, 4, 5]);
    this.addAnimation("walk-right", [6, 7, 8]);
    this.addAnimation("walk-up", [9, 10, 11]);
    // set as default
    this.setCurrentAnimation("walk-down");

    this.navPath = [];
    this.goToPos = null;
  }

  /**
   ** update the force applied
   */
  update(dt) {
    if(this.navPath.length > 0 && this.goToPos == null){
      this.goToPos = this.navPath.pop();
    }

    if(this.goToPos){
      const vel = new me.Vector2d(0,0);
      if(Math.abs(this.goToPos.x - this.pos.x) > 4){
        this.pos.x += Math.sign(this.goToPos.x-this.pos.x) * 4;
      }
      else {
        this.pos.x = this.goToPos.x;
      }

      if(Math.abs(this.goToPos.y - this.pos.y) > 4){
        this.pos.y += Math.sign(this.goToPos.y-this.pos.y) * 4;
      }
      else {
        this.pos.y = this.goToPos.y;
      }

      if(this.pos.x === this.goToPos.x && this.pos.y === this.goToPos.y){
        this.goToPos = null;
      }
    }
    // if (me.input.isKeyPressed("up")) {
    //   this.body.force.y = -this.body.maxVel.y;
    //   if (!this.renderable.isCurrentAnimation("walk-up")) {
    //     this.renderable.setCurrentAnimation("walk-up");
    //   }
    // } else if (me.input.isKeyPressed("down")) {
    //   this.body.force.y = this.body.maxVel.y;
    //   if (!this.renderable.isCurrentAnimation("walk-down")) {
    //     this.renderable.setCurrentAnimation("walk-down");
    //   }
    // } else if (me.input.isKeyPressed("left")) {
    //   this.body.force.x = -this.body.maxVel.x;
    //   if (!this.renderable.isCurrentAnimation("walk-left")) {
    //     this.renderable.setCurrentAnimation("walk-left");
    //   }
    // } else if (me.input.isKeyPressed("right")) {
    //   this.body.force.x = this.body.maxVel.x;
    //   if (!this.renderable.isCurrentAnimation("walk-right")) {
    //     this.renderable.setCurrentAnimation("walk-right");
    //   }
    // }

    // // check if we moved (an "idle" animation would definitely be cleaner)
    // if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
    //   super.update(dt);
    //   return true;
    // }
    // return false;
  }

  setNavPath(path){
    this.navPath = path;
  }

  /**
   * colision handler
   */
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
  //   //     console.log(response.overlapV);
  //   //     // not solid
  //   //     return false;
  //   // }
  //   // Make the object solid
  //   return false;
  // }
}
