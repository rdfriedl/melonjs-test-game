import me from "./lib/melon.js";
import * as navGridService from "./services/navgrid.js";
import * as interactionsService from "./services/interactions.js";
import * as levelManager from "./services/level-manager.js";

window.me = me;
window.debug = {
  interactionsService,
  navGridService,
  levelManager,
  get player() {
    return me.state.current()?.getPlayer();
  },
};
