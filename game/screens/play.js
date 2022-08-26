import me from "../lib/melon.js";
import PlayerEntity from "../entities/player.js";
import {
  calculate as calculateLevelNav,
  findNavPath,
  convertPathToLevelCords,
  updateNavGrid,
} from "../services/pathfinder.js";
import { NAV_LAYER } from "../const/map.js";
import { getCellInteraction } from "../services/interactions.js";
import {
  WALLS,
  getCellWalls,
  setGridSize,
  setWallsFromTmxLayer,
} from "../services/navgrid.js";
import { NAV_LAYERS } from "../const/nav.js";

class PlayScreen extends me.Stage {
  onResetEvent(mainMap) {
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
        const level = me.level.getCurrentLevel();
        const cord = this.getNavCellFromGlobalCord(
          event.gameWorldX,
          event.gameWorldY
        );
        this.cursor.pos.set(
          cord.x * level.tilewidth,
          cord.y * level.tileheight
        );

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
          const playerCell = this.getNavCellFromGlobalCord(
            player.pos.x,
            player.pos.y
          );

          const walls = getCellWalls(targetCell);
          if (walls === WALLS.ALL) return;

          const navPath = await findNavPath(playerCell, targetCell);
          player.setNavPath(convertPathToLevelCords(navPath));

          const interaction = getCellInteraction(targetCell);
          if (interaction) {
            interaction.callback();
          }
        }
      }
    );

    this.loadLevel(mainMap);

    me.event.on(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }

  loadLevel(name) {
    if (!name) throw new Error("no level name");

    const tmx = me.loader.getTMX(name);
    const levelSize = new me.Vector2d(
      parseInt(tmx.width),
      parseInt(tmx.height)
    );

    // resize the nav grid
    setGridSize(levelSize);

    // load the level
    me.level.load(name, {
      onLoaded: () => {
        // find the map nav layer
        const navLayer = me.level
          .getCurrentLevel()
          .layers.find((layer) => layer.name === NAV_LAYER);

        if (navLayer) {
          navLayer.alpha = 0;
          setWallsFromTmxLayer(NAV_LAYERS.MAP_NAV, navLayer);
        }

        // update the nav grid
        updateNavGrid();

        // move the cursor to the top
        setTimeout(() => {
          me.game.world.moveToTop(this.cursor);
        }, 100);
      },
    });
  }

  getPlayer() {
    return me.game.world.children.find((el) => el instanceof PlayerEntity);
  }

  getNavCellFromGlobalCord(x, y) {
    const level = me.level.getCurrentLevel();
    return new me.Vector2d(
      Math.floor(x / level.tilewidth),
      Math.floor(y / level.tileheight)
    );
  }

  onGameUpdate() {
    calculateLevelNav();
  }

  onDestroyEvent() {
    me.event.off(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }
}

export default PlayScreen;
