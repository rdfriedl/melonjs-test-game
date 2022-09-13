import { randomizerGenorator } from "../helpers/randomizer.js";
import me from "../lib/melon.js";
import { islandMaps } from "../resources.js";

function* randomQueue(arr = [], rng = Math.random) {
  let available = [...arr];

  while (available.length > 0) {
    const entry = available[Math.floor(rng() * available.length)];
    available = available.filter((e) => e !== entry);
    yield entry;
  }
}

function islandMapGetTunnelDoors(mapName) {
  const tmx = me.loader.getTMX(mapName);

  return tmx.layers
    .filter((layer) => layer.type === "objectgroup")
    .map((layer) => layer.objects)
    .reduce((a, b) => a.concat(b), [])
    .filter((object) => object.name === "tunnel");
}

export function generateIsland(island) {
  if (!island.loaded) throw new Error("island not loaded");
  const randomizer = randomizerGenorator(island.id);
  const rng = () => randomizer.next().value;

  const map = islandMaps[Math.floor(rng() * islandMaps.length)].name;
  const doors = islandMapGetTunnelDoors(map);

  const doorQueue = randomQueue(doors, rng);
  const connections = [];
  for (const tunnel of island.tunnels) {
    const door = doorQueue.next().value;

    connections.push({
      doorId: door?.id,
      tunnelId: tunnel.id,
    });
  }

  return {
    map,
    connections,
  };
}

export function generateTunnel() {}
