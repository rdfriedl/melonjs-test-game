import me from "../lib/melon.js";
import * as islandManager from "./island-manager.js";
import { islandMaps } from "../resources.js";
import * as levelManager from "./level-manager.js";
import * as navGridService from "./navgrid.js";
import AgentEntity from "../entities/Agent.js";
import { GRID } from "../const/grid.js";

export async function loadIsland(id) {
  const island = await islandManager.loadIsland(id);

  const map =
    islandMaps[Math.floor(island.rng.getNumber(0) * islandMaps.length)];

  await levelManager.loadLevel(map.name);

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
}
