const GRAPH_URL = "http://localhost:5000";

const worldCache = new Map();
const tunnelCache = new Map();

function getConnectedNodes(worldOrTunnel, levels = 2, nodes = new Set()) {
  if (worldOrTunnel instanceof World) {
    for (const tunnel of worldOrTunnel.tunnels) {
      if (tunnel && !nodes.has(tunnel)) {
        nodes.add(tunnel);
        if (levels > 0) getConnectedNodes(tunnel, levels - 1, nodes);
      }
    }
  } else if (worldOrTunnel instanceof Tunnel) {
    for (const world of worldOrTunnel.connections) {
      if (world && !nodes.has(world)) {
        nodes.add(world);
        if (levels > 0) getConnectedNodes(world, levels - 1, nodes);
      }
    }
  }
  return nodes;
}
export function pruneCache(worldOrTunnel, levels = 2) {
  const keep = getConnectedNodes(worldOrTunnel, levels);

  Array.from(worldCache.values)
    .filter((world) => !keep.includes(world))
    .forEach((world) => worldCache.delete(world.id));
  Array.from(tunnelCache.values)
    .filter((world) => !keep.includes(world))
    .forEach((world) => tunnelCache.delete(world.id));
}

export function getWorld(id) {
  return worldCache.get(id);
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
export async function loadWorld(id) {
  if (worldCache.has(id)) return worldCache.get(id);

  const nodeData = await fetch(createUrl(`/node/${id}`)).then((res) =>
    res.json()
  );

  const world = new World(nodeData);
  worldCache.set(id, world);
  return world;
}

export class World {
  constructor(nodeData) {
    this.id = nodeData.pubKey;
    this.name = nodeData.alias;

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

export class Tunnel {
  constructor(channelData) {
    this.id = channelData.id;
    this.worldIds = channelData.nodes;
  }

  get connections() {
    return this.worldIds.map((id) => getWorld(id));
  }

  get loaded() {
    return !this.worldIds.some((id) => !getWorld(id));
  }

  async loadConnections() {
    for (const id of this.worldIds) {
      await loadWorld(id);
    }
  }
}
