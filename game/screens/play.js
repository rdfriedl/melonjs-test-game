import me from "../lib/melon.js";
import { calculate as calculateLevelNav } from "../services/pathfinder.js";
// import AgentEntity from "../entities/Agent.js";

class PlayScreen extends me.Stage {
  onResetEvent() {
    me.game.world.gravity.set(0, 0);

    // bind keys
    me.input.bindKey(me.input.KEY.UP, "up");
    me.input.bindKey(me.input.KEY.DOWN, "down");
    me.input.bindKey(me.input.KEY.LEFT, "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.W, "up");
    me.input.bindKey(me.input.KEY.S, "down");
    me.input.bindKey(me.input.KEY.A, "left");
    me.input.bindKey(me.input.KEY.D, "right");

    me.input.bindKey(me.input.KEY.X, "attack");
    me.input.bindKey(me.input.KEY.F, "attack");

    me.input.bindKey(me.input.KEY.Z, "alt");
    me.input.bindKey(me.input.KEY.Q, "alt");

    me.input.bindKey(me.input.KEY.C, "confirm");
    me.input.bindKey(me.input.KEY.E, "confirm");

    me.event.on(me.event.GAME_UPDATE, this.onGameUpdate, this);

    // this.agent = new AgentEntity(0,0);
    // this.agent.isPersistent = true;

    // me.game.world.addChild(this.agent);
    // me.game.viewport.follow(this.agent, me.game.viewport.AXIS.BOTH, 1);
  }

  getAgent() {
    // return this.agent;
    // return me.game.world.children.find((el) => el instanceof AgentEntity);
  }

  onGameUpdate() {
    calculateLevelNav();
  }

  onDestroyEvent() {
    me.event.off(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }
}

export default PlayScreen;
