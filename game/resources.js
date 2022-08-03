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
function map(basePath) {
  return [
    {
      name: me.utils.file.getBasename(basePath),
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
  ...map("maps/iceland-test"),
  ...map("maps/minifantasy-dungeon"),

  ...tileset("tilesets/Minifantasy_Walls"),
  ...tileset("tilesets/Minifantasy_Dungeon/Minifantasy_DungeonCliffTiles"),
  ...tileset("tilesets/Minifantasy_Dungeon/Minifantasy_DungeonDoorTiles"),
  ...tileset("tilesets/Minifantasy_Dungeon/Minifantasy_DungeonFloorTiles"),
  ...tileset("tilesets/Minifantasy_Dungeon/Minifantasy_DungeonProps"),
  ...tileset("tilesets/Minifantasy_Dungeon/Minifantasy_DungeonPropsShadows"),
  ...tileset("tilesets/Minifantasy_Dungeon/Minifantasy_DungeonWallTiles"),
  ...tileset(
    "tilesets/Minifantasy_Dungeon/Minifantasy_DungeonWallTilesetShadows"
  ),
  ...tileset('tilesets/Minifantasy_IcyWilderness/Minifantasy_IcyWildernessAllTiles'),
  ...tileset('tilesets/Minifantasy_IcyWilderness/Minifantasy_IcyWildernessAllTilesShadows')
];

export const globalResources = [
  // player
  ...image("sprites/Human/Minifantasy_CreaturesHumanBaseWalk"),
  ...image("sprites/Human/Minifantasy_CreaturesHumanBaseAnimations"),

  // cursor
  { name: "cursor", type: "image", src: "sprites/cursor.png" },
];
