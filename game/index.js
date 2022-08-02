import me from "./lib/melon.js";
import { globalResources, hubWorldResources } from "./resources.js";
import PlayerEntity from "../entities/player.js";
import DoorEntity from "./entities/door.js";
import PlayScreen from "./screens/play.js";
import { loadPack } from "./services/resource-manager.js";
import "./services/world-manager.js";

window.me = me;

me.device.onReady(() => {
  // initialize the display canvas once the device/browser is ready
  if (!me.video.init(480, 256, { parent: "screen", scale: "auto" })) {
    alert("Your browser does not support HTML5 canvas.");
    return;
  }

  // setup game objects
  me.pool.register("Player", PlayerEntity);
  me.pool.register("Door", DoorEntity);

  // setup states
  me.state.set(me.state.PLAY, new PlayScreen());

  // load global game resources
  me.loader.preload(globalResources, () => {
    loadPack(hubWorldResources).then(() => {
      me.state.change(me.state.PLAY, "minifantasy-dungeon");
    });
  });
});

// loadWorld('QmQVWXNKRFBRvekRGh9SrFtffiL59Sk5nJag583N6y4y4z')
// loadWorld('Qmdho6mNHEVeTDTHaXKY7Siq1eScpRwnaGRq2M6D2RC3gn')
