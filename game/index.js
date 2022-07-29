import me from "./lib/melon.js";
import resources from "./resources.js";
import PlayerEntity from "../entities/player.js";
import { getNodeChannels, getPopularNodes } from "../services/amboss.js";

window.me = me;

me.device.onReady(function () {
  // initialize the display canvas once the device/browser is ready
  if (!me.video.init(910, 512, { parent: "screen", scale: "auto" })) {
    alert("Your browser does not support HTML5 canvas.");
    return;
  }

  me.loader.preload(resources, () => {
    me.pool.register("player", PlayerEntity);

    me.game.world.gravity.set(0, 0);

    me.level.load("main-map");
  });

  getPopularNodes().then(async (data) => {
    console.log(data);

    const channels = await getNodeChannels(data[0]);
    console.log(channels);
  })
});
