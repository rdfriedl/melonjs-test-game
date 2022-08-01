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

    // player can exit the viewport (jumping, falling into a hole, etc.)
    this.alwaysUpdate = true;

    // set the viewport to follow this on both axis, and enable damping
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 1);

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

  setCurrentAnimationIfNotSet(animation){
    if (!this.isCurrentAnimation(animation)) {
      this.setCurrentAnimation(animation);
    }
  }

  update(dt) {
    if(this.navPath.length > 0 && this.goToPos == null){
      this.goToPos = this.navPath.pop();
    }

    if(this.goToPos){
      const vel = new me.Vector2d(0,0);
      if(Math.abs(this.goToPos.x - this.pos.x) > 4){
        vel.x = Math.sign(this.goToPos.x-this.pos.x) * 4;
      }

      if(Math.abs(this.goToPos.y - this.pos.y) > 4){
        vel.y = Math.sign(this.goToPos.y-this.pos.y) * 4;
      }

      if(!vel.x && !vel.y){
        this.pos.setV(this.goToPos);
        this.goToPos = null;
      }
      else {
        this.pos.add(vel);

        if(vel.x > 0){
          this.setCurrentAnimationIfNotSet('walk-right')
        }
        else if(vel.x < 0){
          this.setCurrentAnimationIfNotSet('walk-left')
        }
        else if(vel.y > 0){
          this.setCurrentAnimationIfNotSet('walk-down')
        }
        else if(vel.y < 0){
          this.setCurrentAnimationIfNotSet('walk-up')
        }
      }

      super.update(dt);
      return true;
    }

    return false;
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
