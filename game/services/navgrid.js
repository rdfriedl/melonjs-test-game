import me from "../lib/melon.js";

export const WALLS = {
  EMPTY: 0,
  RIGHT: 1 << 0,
  BOTTOM: 1 << 1,
  LEFT: 1 << 2,
  TOP: 1 << 3,
  NEGATIVE: 1 << 4,
  ALL: 1 | 2 | 4 | 8,
};

const gridSize = new me.Vector2d(0, 0);
const layers = new Map();

export function cellToIndex(cell) {
  return cell.x + cell.y * gridSize.x;
}
export function indexToCell(index) {
  const y = Math.floor(index / gridSize.x);
  const x = index - y * gridSize.x;
  return new me.Vector2d(x, y);
}
function createEmptyGrid(size) {
  return Array(size.x * size.y).fill(WALLS.EMPTY);
}

// grid methods
export function getGridSize() {
  return gridSize.clone();
}
export function setGridSize(v) {
  gridSize.copy(v);
  clearAll();
}
export function clearAll() {
  layers.clear();
}

let compiledGridCache = createEmptyGrid(gridSize);
export function getCompiledGrid() {
  return compiledGridCache;
}
export function compiledGrid() {
  const grid = createEmptyGrid(gridSize);

  // add walls
  for (const [name, walls] of layers) {
    for (let i = 0; i < walls.length; i++) {
      if (!(walls[i] & WALLS.NEGATIVE)) {
        grid[i] = grid[i] | walls[i];
      }
    }
  }

  // apply negatives
  for (const [name, walls] of layers) {
    for (let i = 0; i < walls.length; i++) {
      if (walls[i] & WALLS.NEGATIVE) {
        grid[i] = (grid[i] & walls[i]) ^ grid[i];
      }
    }
  }

  return (compiledGridCache = grid);
}

// layer methods
export function getLayer(layer) {
  if (!layers.has(layer)) {
    layers.set(layer, createEmptyGrid(gridSize));
  }
  return layers.get(layer);
}
export function getLayers() {
  return Array.from(layers);
}
export function deleteLayer(layer) {
  layers.delete(layer);
}
export function clearLayer(layer) {
  layers.set(layer, createEmptyGrid(gridSize));
}

// cell methods
export function getCellWalls(cell, layer) {
  if (layer) {
    const layerGrid = getLayer(layer);
    return layerGrid[cellToIndex(cell)];
  } else {
    const compiled = getCompiledGrid();
    return compiled[cellToIndex(cell)];
  }
}
export function addCellWall(cell, layer, wall = WALLS.EMPTY) {
  if (cell.x < 0 || cell.y < 0 || cell.x >= gridSize.x || cell.y >= gridSize.y)
    return;
  // no sense adding if wall is empty
  if (wall === WALLS.EMPTY) return;
  const layerGrid = getLayer(layer);
  const i = cellToIndex(cell);
  layerGrid[i] = layerGrid[i] | wall;
}

// helper methods
export function canMoveTo(from, to) {
  const fromWalls = getCellWalls(from);
  const toWalls = getCellWalls(to);
  if (from.x < to.x)
    return !(toWalls & WALLS.LEFT) && !(fromWalls & WALLS.RIGHT);
  else if (from.x > to.x)
    return !(toWalls & WALLS.RIGHT) && !(fromWalls & WALLS.LEFT);
  else if (from.y < to.y)
    return !(toWalls & WALLS.TOP) && !(fromWalls & WALLS.BOTTOM);
  else if (from.y > to.y)
    return !(toWalls & WALLS.BOTTOM) && !(fromWalls & WALLS.TOP);
  return true;
}

const v = (x, y) => new me.Vector2d(x, y);
export function setWallsFromTmxLayer(layer, tmxLayer) {
  // clear the layer first
  clearLayer(layer);

  for (let x = 0; x < tmxLayer.layerData.length; x++) {
    const column = tmxLayer.layerData[x];
    for (let y = 0; y < column.length; y++) {
      const tile = column[y];
      if (!tile) continue;
      const props = tile.tileset.TileProperties[tile.tileId];
      if (!props) continue;

      if (props.right) {
        addCellWall(v(x, y), layer, WALLS.RIGHT);
        // addCellWall(v(x + 1, y), layer, WALLS.LEFT);
      }
      if (props.left) {
        addCellWall(v(x, y), layer, WALLS.LEFT);
        // addCellWall(v(x - 1, y), layer, WALLS.RIGHT);
      }
      if (props.bottom) {
        addCellWall(v(x, y), layer, WALLS.BOTTOM);
        // addCellWall(v(x, y + 1), layer, WALLS.TOP);
      }
      if (props.top) {
        addCellWall(v(x, y), layer, WALLS.TOP);
        // addCellWall(v(x, y - 1), layer, WALLS.BOTTOM);
      }
    }
  }

  compiledGrid();
}
