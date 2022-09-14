import { DIRECTION } from "../const/direction.js";
import { GRID } from "../const/grid.js";
import { NAV_LAYERS } from "../const/nav.js";
import me from "../lib/melon.js";
import {
  INTERACTION_SIDE,
  setCellInteraction,
} from "../services/interactions.js";
import { getDoorTunnelId, tmpSkipTunnel } from "../services/level-manager.js";
import { addCellWall, WALLS } from "../services/navgrid.js";

export default class TunnelEntity extends me.Sprite {
  constructor(x, y, settings) {
    super(x, y, {
      image: "tunnel",
      anchorPoint: new me.Vector2d(0, 0),
      width: GRID,
      height: GRID * 2,
    });

    this.doorId = settings.id;
    this.cell = new me.Vector2d().copy(this.pos).div(GRID).floorSelf();
    this.tunnelId = getDoorTunnelId(this.doorId);

    if (this.tunnelId) {
      setCellInteraction(
        this.cell.clone().add(DIRECTION.DOWN),
        INTERACTION_SIDE.STAND,
        () => tmpSkipTunnel(this.tunnelId)
      );
      addCellWall(
        this.cell.clone().add(DIRECTION.DOWN),
        NAV_LAYERS.TUNNELS,
        WALLS.BOTTOM | WALLS.NEGATIVE
      );
      addCellWall(
        this.cell.clone().add(DIRECTION.DOWN).add(DIRECTION.DOWN),
        NAV_LAYERS.TUNNELS,
        WALLS.TOP | WALLS.NEGATIVE
      );
    } else {
      this.isRenderable = false;
    }
  }
}
