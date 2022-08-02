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
  // images
  // { name: "doors", type: "image", src: "tilesets/doors.png" },
  // { name: "walls", type: "image", src: "tilesets/walls.png" },
  // { name: "TX Plant", type: "image", src: "tilesets/TX Plant.png" },
  // { name: "TX Player", type: "image", src: "tilesets/TX Player.png" },
  // { name: "TX Props", type: "image", src: "tilesets/TX Props.png" },
  // {
  //   name: "TX Shadow Plant",
  //   type: "image",
  //   src: "tilesets/TX Shadow Plant.png",
  // },
  // { name: "TX Shadow", type: "image", src: "tilesets/TX Shadow.png" },
  // { name: "TX Struct", type: "image", src: "tilesets/TX Struct.png" },
  // {
  //   name: "TX Tileset Grass",
  //   type: "image",
  //   src: "tilesets/TX Tileset Grass.png",
  // },
  // {
  //   name: "TX Tileset Stone Ground",
  //   type: "image",
  //   src: "tilesets/TX Tileset Stone Ground.png",
  // },
  // {
  //   name: "TX Tileset Wall",
  //   type: "image",
  //   src: "tilesets/TX Tileset Wall.png",
  // },

  // maps
  // { name: "hub", type: "tmx", src: "maps/main.tmx" },
  // { name: "right", type: "tmx", src: "maps/right.tmx" },

  // tilesets
  // { name: "doors", type: "tsx", src: "tilesets/doors.tsx" },
  // { name: "walls", type: "tsx", src: "tilesets/walls.tsx" },
  // { name: "Tileset Grass", type: "tsx", src: "tilesets/Tileset Grass.tsx" },
  // { name: "Tileset Wall", type: "tsx", src: "tilesets/Tileset Wall.tsx" },
  // { name: "Struct", type: "tsx", src: "tilesets/Struct.tsx" },
  // { name: "Shadow", type: "tsx", src: "tilesets/Shadow.tsx" },
  // { name: "Props", type: "tsx", src: "tilesets/Props.tsx" },
  // { name: "Plant", type: "tsx", src: "tilesets/Plant.tsx" },
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
];

export const globalResources = [
  // player
  ...image("sprites/Human/Minifantasy_CreaturesHumanBaseWalk"),
  ...image("sprites/Human/Minifantasy_CreaturesHumanBaseAnimations"),

  // cursor
  { name: "cursor", type: "image", src: "sprites/cursor.png" },
];
