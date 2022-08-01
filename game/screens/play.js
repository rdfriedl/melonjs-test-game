import me from "../lib/melon.js";
import { js as Grid } from "../lib/easystar.js";
import PlayerEntity from "../entities/player.js";

class PlayScreen extends me.Stage {
  onResetEvent(mainMap) {
    me.game.world.gravity.set(0, 0);

    this.cursor = new me.Sprite(0, 0, {
      image: 'cursor',
      anchorPoint: {x: 0, y: 0},
    });
    this.cursor.isPersistent = true;
    me.game.world.addChild(this.cursor);

    // register on mouse event
    me.input.registerPointerEvent("pointermove", me.game.viewport, (event) => {
      const cord = this.getNavCellFromGlobalCord(event.gameWorldX, event.gameWorldY);
      this.cursor.pos.set(cord.x*32, cord.y*32);

      const navLayer = this.getNavLayer();
      if(navLayer){
        const tile = navLayer.cellAt(cord.x, cord.y);

        const canNavigate = !tile;
        if(canNavigate){
          this.cursor.tint.setColor(255, 255, 255);
        }
        else {
          this.cursor.tint.setColor(255, 128, 128);
        }
      }
    }, false);


    me.input.registerPointerEvent("pointerdown", me.game.viewport, async (event) => {
      const player = this.getPlayer();
      if(player){
        const cord = this.getNavCellFromGlobalCord(event.gameWorldX, event.gameWorldY);
        const navLayer = this.getNavLayer();
        const tile = navLayer.cellAt(cord.x, cord.y);
        if(tile) return;

        const start = cord.clone();
        const end = this.getNavCellFromGlobalCord(player.pos.x, player.pos.y);

        const navPath = await this.findNavPath(start, end);
        player.setNavPath(navPath);
      }
    });

    this.loadLevel(mainMap);

    me.event.on(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }

  loadLevel(name = 'hub'){
    me.level.load(name || "hub", {
      onLoaded: () => {
        // hive nav layer and create nav grid
        const navLayer = this.getNavLayer();
        if(navLayer){
          navLayer.alpha = 0;
          this.createNavGrid();
        }

        // move the cursor to the top
        setTimeout(() => {
          me.game.world.moveToTop(this.cursor);
        }, 100);
      },
    });
  }

  getNavLayer(){
    return me.level.getCurrentLevel().layers.find(layer => layer.name === 'nav');
  }
  getPlayer(){
    return me.game.world.children.find(el => el instanceof PlayerEntity)
  }

  getNavCellFromGlobalCord(x,y){
    const level = me.level.getCurrentLevel();
    return new me.Vector2d(Math.floor(x/level.tilewidth), Math.floor(y / level.tileheight))
  }
  createNavGrid(){
    const navLayer = this.getNavLayer();

    if(navLayer){
      this.navGrid = new Grid();
      // flip the grid since tiled exports in x/y and the grid wants y/x
      const navGridData = [];
      for (let x = 0; x < navLayer.layerData.length; x++) {
        const column = navLayer.layerData[x];
        for (let y = 0; y < column.length; y++) {
          const tile = column[y];
          (navGridData[y] = navGridData[y] || [])[x] = 0+!!tile;
        }
      }
      this.navGrid.setGrid(navGridData)
      this.navGrid.setAcceptableTiles([0]);
    }
  }
  async findNavPath(start, end){
    return new Promise((res) => {
      if(!this.navGrid) return null;

      const level = me.level.getCurrentLevel();
      this.navGrid.findPath(start.x, start.y, end.x, end.y, (path) => {
        if(!path) return null;

        const pathInGlobalCords = path.map(point => new me.Vector2d(point.x+0.5, point.y+0.5).scale(level.tilewidth, level.tileheight));
        res(pathInGlobalCords);
      })
    })
  }

  onGameUpdate(){
    if(this.navGrid){
      this.navGrid.calculate();
    }
  }

  onDestroyEvent() {
    me.event.off(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }
}

export default PlayScreen;
