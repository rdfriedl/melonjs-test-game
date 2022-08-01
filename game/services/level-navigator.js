import me from "../lib/melon.js";
import * as EasyStar from "../lib/easystar.js";
const { js: Grid } = EasyStar;

function flipBits(v, mask) {
  return ~v & mask;
}

export const WALLS = {
  EMPTY: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 4,
  TOP: 8,
  ALL: 1 | 2 | 4 | 8,
};

function flipXYtoYX(arr) {
  // flip the grid since tiled exports in x/y and the grid wants y/x
  const newArr = [];
  for (let x = 0; x < arr.length; x++) {
    const column = arr[x];
    for (let y = 0; y < column.length; y++) {
      (newArr[y] = newArr[y] || [])[x] = column[y];
    }
  }
  return newArr;
}

let columns = 0;
let rows = 0;
let walls = [];
let grid = new Grid();
// every combination except WALLS.ALL, which is 15
grid.setAcceptableTiles(new Array(15).fill(0).map((_, i) => i));

export function resetWalls(width, height) {
  walls = [];
  rows = height;
  columns = width;
  for (let y = 0; y < height; y++) {
    walls[y] = [];
    for (let x = 0; x < width; x++) {
      walls[y][x] = WALLS.EMPTY;
    }
  }
}
export function getCellWalls(x, y) {
  return walls[y]?.[x] ?? WALLS.EMPTY;
}
export function addCellWall(x, y, wall = WALLS.EMPTY) {
  if (x < 0 || y < 0 || x >= columns || y >= rows) return;
  walls[y][x] = (walls[y][x] ?? 0) | wall;
}

export function addWallsFromLayer(layer) {
  for (let x = 0; x < layer.layerData.length; x++) {
    const column = layer.layerData[x];
    for (let y = 0; y < column.length; y++) {
      addCellWall(x, y, WALLS.EMPTY);

      const tile = column[y];
      if (!tile) continue;
      const props = tile.tileset.TileProperties[tile.tileId];
      if (!props) continue;

      if (props.right) {
        addCellWall(x, y, WALLS.RIGHT);
        addCellWall(x + 1, y, WALLS.LEFT);
      }
      if (props.left) {
        addCellWall(x, y, WALLS.LEFT);
        addCellWall(x - 1, y, WALLS.RIGHT);
      }
      if (props.bottom) {
        addCellWall(x, y, WALLS.BOTTOM);
        addCellWall(x, y + 1, WALLS.TOP);
      }
      if (props.top) {
        addCellWall(x, y, WALLS.TOP);
        addCellWall(x, y - 1, WALLS.BOTTOM);
      }
    }
  }
}

export function loadWallsFromLayer(layer) {
  if (!layer) return;

  grid.removeAllDirectionalConditions();
  resetWalls(layer.cols, layer.rows);
  addWallsFromLayer(layer);
  updateNavGrid();
}

export function updateNavGrid() {
  // import grid
  grid.setGrid(walls);

  //set directional conditions
  grid.removeAllDirectionalConditions();
  for (let y = 0; y < walls.length; y++) {
    const row = walls[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      const openings = flipBits(cell, WALLS.ALL);

      const accessibleFrom = [];
      if (openings & WALLS.RIGHT) {
        accessibleFrom.push(EasyStar.RIGHT);
      }
      if (openings & WALLS.LEFT) {
        accessibleFrom.push(EasyStar.LEFT);
      }
      if (openings & WALLS.TOP) {
        accessibleFrom.push(EasyStar.TOP);
      }
      if (openings & WALLS.BOTTOM) {
        accessibleFrom.push(EasyStar.BOTTOM);
      }
      grid.setDirectionalCondition(x, y, accessibleFrom);
    }
  }
}

export function findNavPath(start, end) {
  return new Promise((res) => {
    grid.findPath(start.x, start.y, end.x, end.y, (path) => {
      if (path) {
        res(path.map(({ x, y }) => new me.Vector2d(x, y)));
      } else {
        res(null);
      }
    });
  });
}

export function convertPathToLevelCords(path) {
  if (!path) return null;
  const level = me.level.getCurrentLevel();
  const center = new me.Vector2d(level.tilewidth, level.tileheight).scale(0.5);
  return path.map((point) =>
    point.scale(level.tilewidth, level.tileheight).add(center)
  );
}

export function calculate() {
  grid.calculate();
}
