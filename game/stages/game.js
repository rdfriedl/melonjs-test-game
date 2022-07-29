import me from "../lib/melon.js";

class GameScreen extends me.Stage {
  onResetEvent(mainMap) {
    me.game.world.gravity.set(0, 0);

    me.level.load(mainMap || "hub");
  }

  onDestroyEvent() {
    // unload assets?
  }
}

export default GameScreen;
