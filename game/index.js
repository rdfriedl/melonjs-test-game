import me from "./lib/melon.js";
import resources from "./resources.js";
import PlayerEntity from "../entities/player.js";

window.me = me;

me.device.onReady(function () {
  // initialize the display canvas once the device/browser is ready
  if (!me.video.init(910, 512, { parent: "screen", scale: "auto" })) {
    alert("Your browser does not support HTML5 canvas.");
    return;
  }

  me.game.world.gravity.set(0, 0);
  me.pool.register("player", PlayerEntity);

  me.loader.preload(resources, () => {
    // me.level.load("main-map");
  });
});


async function loadWorld(ipfsHash){
  const baseURL = `https://ipfs.infura.io/ipfs/${ipfsHash}/`
  const metadata = await fetch(new URL('world.json', baseURL).toString()).then(res => res.json());

  if(!metadata.resources || !metadata.mainMap){
    throw new Error("failed to load world");
  }

  const resources = metadata.resources.map(resource => {
    if(resource.src){
      return {
        ...resource,
        src: new URL(resource.src, baseURL).toString()
      }
    }
    return resource;
  });

  const dataUrls = [];
  await Promise.all(resources.map(async (resource) => {
    if(resource.src && resource.type === 'image'){
      const blob = await fetch(resource.src).then(res => res.blob());
      const dataUrl = URL.createObjectURL(blob);
      dataUrls.push(dataUrl);
      resource.src = dataUrl;
    }
  }))

  me.loader.preload(resources, () => {
    me.level.load(metadata.mainMap);
  });

  return () => {
    console.log('unloading resources');
    for (const resource of resources) {
      me.loader.unload(resource);
    }

    console.log('revoking dataUrls');
    for (const dataUrl of dataUrls) {
      URL.revokeObjectURL(dataUrl);
    }
  }
}

window.loadWorld = loadWorld;
