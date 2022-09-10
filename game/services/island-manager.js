import SeedRandom from "../lib/seedrandom.js";

const GRAPH_URL = "http://localhost:5000";

const islandCache = new Map();
const tunnelCache = new Map();

export function getIsland(id) {
  return islandCache.get(id);
}
export function getTunnel(id) {
  return tunnelCache.get(id);
}

export async function loadTunnel(id) {
  if (tunnelCache.has(id)) return tunnelCache.get(id);

  const channelData = await fetch(new URL(`/channel/${id}`, GRAPH_URL)).then(
    (res) => res.json()
  );

  const tunnel = new Tunnel(channelData);
  tunnelCache.set(id, tunnel);
  return tunnel;
}
export async function loadIsland(id) {
  if (islandCache.has(id)) return islandCache.get(id);

  const nodeData = await fetch(new URL(`/node/${id}`, GRAPH_URL)).then((res) =>
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
