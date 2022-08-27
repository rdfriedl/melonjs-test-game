import me from "./lib/melon.js";
import * as navGridService from "./services/navgrid.js";
import * as interactionsService from "./services/interactions.js";
import * as levelManager from "./services/level-manager.js";
import * as ambossService from "./services/amboss.js";
import seedrandom from "./lib/seedrandom.js";

window.me = me;
window.debug = {
  interactionsService,
  navGridService,
  levelManager,
  ambossService,
  seedrandom,
  get player() {
    return me.state.current()?.getPlayer();
  },
};
