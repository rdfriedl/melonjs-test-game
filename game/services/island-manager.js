import SeedRandom from "../lib/seedrandom.js";

const GRAPH_URL = "http://localhost:5000";

const islandCache = new Map();
const tunnelCache = new Map();

function getConnectedNodes(islandOrTunnel, levels = 2, nodes = new Set()) {
  if (islandOrTunnel instanceof Island) {
    for (const tunnel of islandOrTunnel.tunnels) {
      if (tunnel && !nodes.has(tunnel)) {
        nodes.add(tunnel);
        if (levels > 0) getConnectedNodes(tunnel, levels - 1, nodes);
      }
    }
  } else if (islandOrTunnel instanceof Tunnel) {
    for (const island of islandOrTunnel.connections) {
      if (island && !nodes.has(island)) {
        nodes.add(island);
        if (levels > 0) getConnectedNodes(island, levels - 1, nodes);
      }
    }
  }
  return nodes;
}
export function pruneCache(islandOrTunnel, levels = 2) {
  const keep = getConnectedNodes(islandOrTunnel, levels);

  Array.from(islandCache.values)
    .filter((island) => !keep.includes(island))
    .forEach((island) => islandCache.delete(island.id));
  Array.from(tunnelCache.values)
    .filter((tunnel) => !keep.includes(tunnel))
    .forEach((tunnel) => tunnelCache.delete(tunnel.id));
}

export function getIsland(id) {
  return islandCache.get(id);
}
export function getTunnel(id) {
  return tunnelCache.get(id);
}

export function createUrl(url) {
  return new URL(url, GRAPH_URL).toString();
}
export async function loadTunnel(id) {
  if (tunnelCache.has(id)) return tunnelCache.get(id);

  const channelData = await fetch(createUrl(`/channel/${id}`)).then((res) =>
    res.json()
  );

  const tunnel = new Tunnel(channelData);
  tunnelCache.set(id, tunnel);
  return tunnel;
}
export async function loadIsland(id) {
  if (islandCache.has(id)) return islandCache.get(id);

  const nodeData = await fetch(createUrl(`/node/${id}`)).then((res) =>
    res.json()
  );

  const island = new Island(nodeData);
  islandCache.set(id, island);
  return island;
}

class Randomizer {
  constructor(seed) {
    this.seedRandom = new SeedRandom(seed);
    this.numbers = [];
  }

  getNumber(index) {
    if (index >= this.numbers.length) {
      for (let i = this.numbers.length; i <= index; i++) {
        this.numbers.push(this.seedRandom());
      }
    }

    return this.numbers[index];
  }
}

class Island {
  constructor(nodeData) {
    this.id = nodeData.pubKey;
    this.name = nodeData.alias;
    this.rng = new Randomizer(this.id);

    this.tunnelIds = nodeData.channels.map((channel) => channel.id);

    for (const channelData of nodeData.channels) {
      if (!tunnelCache.has(channelData.id)) {
        const tunnel = new Tunnel(channelData);
        tunnelCache.set(channelData.id, tunnel);
      }
    }
  }

  get tunnels() {
    return this.tunnelIds.map((id) => getTunnel(id));
  }

  get loaded() {
    return !this.tunnelIds.some((id) => !getTunnel(id));
  }

  async loadConnections() {
    for (const id of this.tunnelIds) {
      await loadTunnel(id);
    }
  }
}

class Tunnel {
  constructor(channelData) {
    this.id = channelData.id;
    this.islandIds = channelData.nodes;
    this.rng = new Randomizer(this.id);
  }

  get connections() {
    return this.islandIds.map((id) => getIsland(id));
  }

  get loaded() {
    return !this.islandIds.some((id) => !getIsland(id));
  }

  async loadConnections() {
    for (const id of this.islandIds) {
      await loadIsland(id);
    }
  }
}
