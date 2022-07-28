import me from "../lib/melon.js";

export default class PlayerEntity extends me.Entity {
  constructor(x, y, settings) {
    // call the constructor
    // dont pass the settings in from the map
    super(x, y, {height: 16, width: 24});

    // set a "player object" type
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;

    // player can exit the viewport (jumping, falling into a hole, etc.)
    this.alwaysUpdate = true;

    this.body.setMaxVelocity(4, 4);
    this.body.setFriction(1, 1);

    this.dying = false;

    // set the viewport to follow this renderable on both axis, and enable damping
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.1);

    // enable keyboard
    me.input.bindKey(me.input.KEY.LEFT, "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.UP, "up");
    me.input.bindKey(me.input.KEY.DOWN, "down");

    me.input.bindKey(me.input.KEY.A, "left");
    me.input.bindKey(me.input.KEY.D, "right");
    me.input.bindKey(me.input.KEY.W, "up");
    me.input.bindKey(me.input.KEY.S, "down");

    this.renderable = new me.Sprite(0, 0, {
      image: "Male-01-1",
      framewidth: 32,
      frameheight: 32,
      anchorPoint: new me.Vector2d(0.5, 0.5),
    });

    // define a basic walking animatin
    this.renderable.addAnimation("walk-down", [0, 1, 2]);
    this.renderable.addAnimation("walk-left", [3, 4, 5]);
    this.renderable.addAnimation("walk-right", [6, 7, 8]);
    this.renderable.addAnimation("walk-up", [9, 10, 11]);
    // set as default
    this.renderable.setCurrentAnimation("walk-down");

    // set the renderable position to bottom center
    this.anchorPoint.set(0.5, 0);
  }

  /**
   ** update the force applied
   */
  update(dt) {
    if (me.input.isKeyPressed("up")) {
      this.body.force.y = -this.body.maxVel.y;
      if (!this.renderable.isCurrentAnimation("walk-up")) {
        this.renderable.setCurrentAnimation("walk-up");
      }
    } else if (me.input.isKeyPressed("down")) {
      this.body.force.y = this.body.maxVel.y;
      if (!this.renderable.isCurrentAnimation("walk-down")) {
        this.renderable.setCurrentAnimation("walk-down");
      }
    } else if (me.input.isKeyPressed("left")) {
      this.body.force.x = -this.body.maxVel.x;
      if (!this.renderable.isCurrentAnimation("walk-left")) {
        this.renderable.setCurrentAnimation("walk-left");
      }
    } else if (me.input.isKeyPressed("right")) {
      this.body.force.x = this.body.maxVel.x;
      if (!this.renderable.isCurrentAnimation("walk-right")) {
        this.renderable.setCurrentAnimation("walk-right");
      }
    }

    // check if we moved (an "idle" animation would definitely be cleaner)
    if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
      super.update(dt);
      return true;
    }
    return false;
  }

  /**
   * colision handler
   */
  onCollision(response, other) {
    // if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
    //     // makes the other object solid, by substracting the overlap vector to the current position
    //     this.pos.sub(response.overlapV);
    //     console.log(response.overlapV);
    //     // not solid
    //     return false;
    // }
    // Make the object solid
    return true;
  }
}
