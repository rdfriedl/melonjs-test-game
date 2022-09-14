import { randomQueue } from "../helpers/random-queue.js";
import { randomizerGenorator } from "../helpers/randomizer.js";
import me from "../lib/melon.js";
import { islandMaps } from "../resources.js";

function getIslandMapTunnelDoors(mapName) {
  const tmx = me.loader.getTMX(mapName);

  return tmx.layers
    .filter((layer) => layer.type === "objectgroup" && layer.objects)
    .map((layer) => layer.objects)
    .reduce((a, b) => a.concat(b), [])
    .filter((object) => object.name === "tunnel");
}

export function generateWorld(world) {
  if (!world.loaded) throw new Error("world not fully loaded");
  const randomizer = randomizerGenorator(world.id);
  const rng = () => randomizer.next().value;

  const islandQueue = randomQueue(islandMaps, rng);

  const islands = [];
  let totalsDoors = 0;
  while (true) {
    const { done, value: map } = islandQueue.next();
    if (done) break;

    const doors = getIslandMapTunnelDoors(map.name).map((obj) => ({
      id: obj.id,
    }));

    islands.push({
      map: map.name,
      doors,
    });

    totalsDoors += doors.length;
    if (totalsDoors > world.tunnelIds.length) {
      // there are enough doors for every tunnel. stop creating islands
      break;
    }
  }

  const allDoors = islands.reduce(
    (doors, island) => doors.concat(island.doors),
    []
  );
  const doorQueue = randomQueue(allDoors, rng);

  for (const tunnel of world.tunnels) {
    const door = doorQueue.next().value;

    door.tunnelId = tunnel.id;
  }

  return {
    id: world.id,
    islands,
  };
}
