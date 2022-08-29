import me from "../lib/melon.js";
import { NAV_LAYER } from "../const/map.js";
import { NAV_LAYERS } from "../const/nav.js";
import { setGridSize, setWallsFromTmxLayer } from "./navgrid.js";
import { updateNavGrid } from "./pathfinder.js";

export function loadLevel(name) {
  if (!name) throw new Error("no level name");

  const tmx = me.loader.getTMX(name);
  const levelSize = new me.Vector2d(parseInt(tmx.width), parseInt(tmx.height));

  // resize the nav grid
  setGridSize(levelSize);

  // load the level
  const mapContainer = new me.Container(0, 0);
  me.level.load(name, {
    // container: mapContainer,
    flatten: false,
    onLoaded: () => {
      // find the map nav layer
      const navLayer = me.level
        .getCurrentLevel()
        .layers.find((layer) => layer.name === NAV_LAYER);

      if (navLayer) {
        navLayer.alpha = 0;
        setWallsFromTmxLayer(NAV_LAYERS.MAP_NAV, navLayer);
      }

      // update the nav grid
      updateNavGrid();

      mapContainer.currentTransform.scale(1);
      me.game.world.addChild(mapContainer);
    },
  });
}

class World {
  constructor(pubKey) {
    this.pubKey = pubKey;
    this.loaded = false;
    this.channels = [];
  }
}

class Channel {
  constructor(longId, nodeA, nodeB) {
    this.id = longId;
  }
}
