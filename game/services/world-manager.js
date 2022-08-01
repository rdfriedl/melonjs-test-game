import me from "../lib/melon.js";
import { loadPack } from "./resource-manager.js";

async function loadWorldMetadata(baseURL) {
  const metadata = await fetch(new URL("world.json", baseURL).toString()).then(
    (res) => res.json()
  );

  if (!metadata.resources || !metadata.mainMap) {
    throw new Error("failed to load world");
  }

  const resources = metadata.resources.map((resource) => {
    if (resource.src) {
      return {
        ...resource,
        src: new URL(resource.src, baseURL).toString(),
      };
    }
    return resource;
  });

  const dataUrls = [];
  await Promise.all(
    resources.map(async (resource) => {
      if (resource.src && resource.type === "image") {
        const blob = await fetch(resource.src).then((res) => res.blob());
        const dataUrl = URL.createObjectURL(blob);
        dataUrls.push(dataUrl);
        resource.src = dataUrl;
      }
    })
  );

  const unload = () => {
    for (const dataUrl of dataUrls) {
      URL.revokeObjectURL(dataUrl);
    }
  };

  return {
    ...metadata,
    resources,
    unload,
  };
}

let loadedWorld = null;

export function loadIpfsWorld(ipfsHash) {
  return loadWorld(`https://ipfs.infura.io/ipfs/${ipfsHash}/`);
}

export async function loadWorld(url) {
  me.state.change(me.state.LOADING);
  const world = await loadWorldMetadata(url);

  if (loadedWorld) {
    loadedWorld.unload();
  }
  await loadPack(world.resources);
  me.state.change(me.state.PLAY, world.mainMap);
}

window.loadWorld = loadWorld;
