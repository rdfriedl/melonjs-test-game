import me from "../lib/melon.js";
import * as EasyStar from "../lib/easystar.js";
import { getCompiledGrid, indexToCell, WALLS } from "./navgrid.js";
const { js: Grid } = EasyStar;

function flipBits(v, mask) {
  return ~v & mask;
}

function getCompiledGridInYX() {
  const compiledGrid = getCompiledGrid();
  const grid = [];

  for (let i = 0; i < compiledGrid.length; i++) {
    const { x, y } = indexToCell(i);
    const walls = compiledGrid[i];

    if (!grid[y]) grid[y] = [];
    grid[y][x] = walls;
  }

  return grid;
}

let grid = new Grid();
// every combination except WALLS.ALL, which is 15
grid.setAcceptableTiles(new Array(15).fill(0).map((_, i) => i));

export function updateNavGrid() {
  const gridYX = getCompiledGridInYX();

  // import grid
  grid.setGrid(gridYX);

  //set directional conditions
  grid.removeAllDirectionalConditions();
  for (let y = 0; y < gridYX.length; y++) {
    const row = gridYX[y];
    for (let x = 0; x < row.length; x++) {
      const walls = row[x];
      const openings = flipBits(walls, WALLS.ALL);

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

// navigation methods
export function findNavPath(start, end) {
  return new Promise((res) => {
    grid.findPath(end.x, end.y, start.x, start.y, (rawPoints) => {
      if (rawPoints) {
        const path = rawPoints.map(({ x, y }) => new me.Vector2d(x, y));
        res(simplifyPath(path));
      } else {
        res(null);
      }
    });
  });
}

export function simplifyPath(path) {
  const newPath = [];

  for (let i = 0; i < path.length; i++) {
    const prev = path[i - 1];
    const point = path[i];
    const next = path[i + 1];

    // keep this point if there is no prev or next (start or end).
    // or if the next point dose not align at all with the prev point
    if (!prev || !next || (next.x !== prev.x && next.y !== prev.y)) {
      newPath.push(point);
    }
  }

  return newPath;
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
