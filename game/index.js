import me from "./lib/melon.js";
import { globalResources, hubWorldResources } from "./resources.js";
import PlayScreen from "./screens/play.js";
import { loadPack } from "./services/resource-manager.js";
import TeleporterEntity from "./entities/teleporter.js";
import TunnelEntity from "./entities/tunnel.js";
import AgentEntity from "./entities/Agent.js";
import SignEntity from "./entities/sign.js";
import * as levelManager from "./services/level-manager.js";

import "./debug.js";

me.device.onReady(() => {
  // initialize the display canvas once the device/browser is ready
  if (
    !me.video.init(8 * 16 * 2, 8 * 9 * 2, {
      parent: "screen",
      scale: "auto",
      scaleMethod: "fill-max",
    })
  ) {
    alert("Your browser does not support HTML5 canvas.");
    return;
  }

  // setup game objects
  me.pool.register("Player", AgentEntity);
  me.pool.register("sign", SignEntity);

  // island doors
  me.pool.register("tunnel", TunnelEntity);
  me.pool.register("tel", TeleporterEntity);

  // empty objects for dungeon doors
  me.pool.register("up", me.Entity);
  me.pool.register("down", me.Entity);
  me.pool.register("right", me.Entity);
  me.pool.register("left", me.Entity);

  // setup states
  me.state.set(me.state.PLAY, new PlayScreen());

  // add a keyboard shortcut to toggle Fullscreen mode on/off
  me.input.bindKey(me.input.KEY.F, "toggleFullscreen");
  me.event.on(me.event.KEYDOWN, (action) => {
    // toggle fullscreen on/off
    if (action === "toggleFullscreen") {
      me.device.requestFullscreen();
    } else {
      me.device.exitFullscreen();
    }
  });

  // load global game resources
  me.loader.preload(globalResources, () => {
    loadPack(hubWorldResources).then(() => {
      me.state.change(me.state.PLAY);

      levelManager.loadWorld(
        "036f589d623dac023d77f1914f6ea99e79c69b808b03ca728d1c1d50565a3afb43"
      );
    });
  });
});
