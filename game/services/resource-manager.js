import me from "../lib/melon.js";

let loadedResources = [];

export function loadPack(resources) {
  return new Promise((res) => {
    for (const resource of loadedResources) {
      me.loader.unload(resource);
    }

    loadedResources = resources;
    me.loader.preload(resources, () => res());
  });
}
