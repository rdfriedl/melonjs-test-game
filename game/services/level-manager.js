import me from "../lib/melon.js";
import { GRID } from "../const/grid.js";
import { NAV_LAYER } from "../const/map.js";
import { NAV_LAYERS } from "../const/nav.js";
import { updateNavGrid } from "./pathfinder.js";
import * as worldManager from "./world-manager.js";
import * as navGridService from "./navgrid.js";
import AgentEntity from "../entities/Agent.js";
import { generateIsland } from "./level-generator.js";

export async function loadLevel(name) {
  if (!name) throw new Error("no level name");

  return new Promise((res) => {
    const tmx = me.loader.getTMX(name);
    const levelSize = new me.Vector2d(
      parseInt(tmx.width),
      parseInt(tmx.height)
    );

    // resize the nav grid
    navGridService.setGridSize(levelSize);

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
          navGridService.setWallsFromTmxLayer(NAV_LAYERS.MAP_NAV, navLayer);
        }

        // update the nav grid
        navGridService.compiledGrid();
        updateNavGrid();

        mapContainer.currentTransform.scale(1);
        me.game.world.addChild(mapContainer);

        res();
      },
    });
  });
}

let loaded = null;

export function getDoorTunnelId(doorId) {
  if (loaded instanceof worldManager.Island) {
    const generated = generateIsland(loaded);

    return generated.connections.find((conn) => conn.doorId === String(doorId))
      ?.tunnelId;
  }
}

export function tmpSkipTunnel(tunnelId) {
  const tunnel = worldManager.getTunnel(tunnelId);
  const otherIslandId = tunnel.islandIds.find((id) => id !== loaded.id);
  if (otherIslandId) {
    return loadIsland(otherIslandId);
  }
}

export async function loadIsland(id) {
  const island = await worldManager.loadIsland(id);
  loaded = island;

  const generated = generateIsland(island);
  console.info("Loading island", id, generated);
  await loadLevel(generated.map);

  const size = navGridService.getGridSize();
  let spawn = null;
  while (!spawn) {
    // TODO: use the islands rng for spawn point
    const cell = new me.Vector2d(
      Math.floor(Math.random() * size.x),
      Math.floor(Math.random() * size.y)
    );
    const walls = navGridService.getCellWalls(cell);

    if (walls === navGridService.WALLS.EMPTY) {
      spawn = cell;
    }
  }

  console.log("spawning player at", spawn);
  const player = new AgentEntity(spawn.x * GRID, spawn.y * GRID, {});
  const playerLevel = me.game.world.children.find(
    (obj) => obj.name === "player" && obj instanceof me.Container
  );

  if (playerLevel) {
    playerLevel.addChild(player);
  } else {
    console.error("Missing player level");
    me.game.world.addChild(player);
  }

  // only keep things that are connected to this island
  worldManager.pruneCache(island);
}
