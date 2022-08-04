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
  return [
    {
      name: name ?? me.utils.file.getBasename(basePath),
      type: "tmx",
      src: basePath + ".tmx",
    },
  ];
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
  ...map("maps/islands/plains-1", "islands/plains-1"),
  ...map("maps/iceland-test"),
  ...map("maps/minifantasy-dungeon"),

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

  // ForgottenPlains
  ...tileset("tilesets/ForgottenPlains/ForgottenPlainsTiles"),
  ...tileset("tilesets/ForgottenPlains/ForgottenPlainsProps"),
];

export const globalResources = [
  // player
  // ...image("sprites/Human/HumanBaseWalk"),
  ...image("sprites/Human/HumanBaseAnimations"),

  // cursor
  { name: "cursor", type: "image", src: "sprites/cursor.png" },
];
