import me from "../lib/melon.js";
import PlayerEntity from "../entities/player.js";
import {
  calculate as calculateLevelNav,
  findNavPath,
  convertPathToLevelCords,
} from "../services/pathfinder.js";
import { GRID } from "../const/map.js";
import { WALLS, getCellWalls } from "../services/navgrid.js";

class PlayScreen extends me.Stage {
  onResetEvent() {
    me.game.world.gravity.set(0, 0);

    this.cursor = new me.Sprite(0, 0, {
      image: "cursor",
      anchorPoint: { x: 0, y: 0 },
      width: 8,
      height: 8,
    });
    this.cursor.isPersistent = true;
    me.game.world.addChild(this.cursor);

    // register on mouse event
    me.input.registerPointerEvent(
      "pointermove",
      me.game.viewport,
      (event) => {
        const cord = this.getNavCellFromGlobalCord(
          event.gameWorldX,
          event.gameWorldY
        );
        this.cursor.pos.set(cord.x * GRID, cord.y * GRID);

        const walls = getCellWalls(cord);

        if (walls !== WALLS.ALL) {
          this.cursor.tint.setColor(255, 255, 255);
        } else {
          this.cursor.tint.setColor(255, 128, 128);
        }
      },
      false
    );

    me.input.registerPointerEvent(
      "pointerdown",
      me.game.viewport,
      async (event) => {
        const player = this.getPlayer();
        if (player) {
          const targetCell = this.getNavCellFromGlobalCord(
            event.gameWorldX,
            event.gameWorldY
          );
          const playerCell = player.cell.clone();

          const walls = getCellWalls(targetCell);
          if (walls === WALLS.ALL) return;

          const navPath = await findNavPath(playerCell, targetCell);
          player.setNavPath(convertPathToLevelCords(navPath));
        }
      }
    );

    me.event.on(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }

  getPlayer() {
    return me.game.world.children.find((el) => el instanceof PlayerEntity);
  }

  getNavCellFromGlobalCord(x, y) {
    return new me.Vector2d(Math.floor(x / GRID), Math.floor(y / GRID));
  }

  onGameUpdate() {
    // TODO: find a getter way to keep the cursor above the map
    me.game.world.moveToTop(this.cursor);

    calculateLevelNav();
  }

  onDestroyEvent() {
    me.event.off(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }
}

export default PlayScreen;
