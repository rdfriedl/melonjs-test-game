import me from "./lib/melon.js";

function tileset(basePath) {
  return [
    {
      name: me.utils.file.getBasename(basePath),
      type: "image",
      src: basePath + ".png",
    },
    {
      name: me.utils.file.getBasename(basePath),
      type: "tsx",
      src: basePath + ".tsx",
    },
  ];
}
function map(basePath, name) {
  return {
    name: name ?? me.utils.file.getBasename(basePath),
    type: "tmx",
    src: basePath + ".tmx",
  };
}
function islandMap(filename) {
  return map(`maps/islands/${filename}`, `islands/${filename}`);
}
function dungeonMap(filename) {
  return map(`maps/dungeon/${filename}`, `dungeon/${filename}`);
}
function image(basePath) {
  return [
    {
      name: me.utils.file.getBasename(basePath),
      type: "image",
      src: basePath + ".png",
    },
  ];
}

export const hubWorldResources = [
  ...tileset("tilesets/Walls"),
  // Dungeon
  ...tileset("tilesets/Dungeon/DungeonCliffTiles"),
  ...tileset("tilesets/Dungeon/DungeonDoorTiles"),
  ...tileset("tilesets/Dungeon/DungeonFloorTiles"),
  ...tileset("tilesets/Dungeon/DungeonProps"),
  ...tileset("tilesets/Dungeon/DungeonPropsShadows"),
  ...tileset("tilesets/Dungeon/DungeonWallTiles"),
  ...tileset("tilesets/Dungeon/DungeonWallTilesetShadows"),
  // IcyWilderness
  ...tileset("tilesets/IcyWilderness/IcyWilderness_AllTiles"),
  ...tileset("tilesets/IcyWilderness/IcyWilderness_AllTilesShadows"),

  // ShipsAndDocks
  ...tileset("tilesets/ShipsAndDocks/ShipsAndDocks_Docks"),
  ...tileset("tilesets/ShipsAndDocks/ShipsAndDocks_Props"),

  // ForgottenPlains
  ...tileset("tilesets/ForgottenPlains/ForgottenPlainsTiles"),
  ...tileset("tilesets/ForgottenPlains/ForgottenPlainsProps"),
];

export const islandMaps = [islandMap("plains-1"), islandMap("small")];
export const dungeonMaps = [
  dungeonMap("bottom-right-1"),
  dungeonMap("bottom-top-1"),
  dungeonMap("left-right-1"),
  dungeonMap("left-up-right-1"),
];
export const maps = [...islandMaps, ...dungeonMaps];

export const globalResources = [
  // player
  // ...image("sprites/Human/HumanBaseWalk"),
  ...image("sprites/Human/HumanBaseAnimations"),

  // cursor
  { name: "cursor", type: "image", src: "sprites/cursor.png" },
  { name: "tunnel", type: "image", src: "sprites/tunnel.png" },
  { name: "sign", type: "image", src: "sprites/sign.png" },
  { name: "teleporter", type: "image", src: "sprites/teleporter.png" },

  ...maps,
];
