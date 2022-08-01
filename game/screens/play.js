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
      const x = Math.floor(event.gameWorldX/32)*32;
      const y = Math.floor(event.gameWorldY/32)*32;
      this.cursor.pos.set(x,y);

      const tileMap = me.level.getCurrentLevel();
      const navLayer = tileMap.getLayers().find(layer => layer.name === 'nav');
      if(navLayer){
        const tile = navLayer.getTile(x,y);

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
        const level = me.level.getCurrentLevel();
        const w = level.tilewidth;
        const h = level.tileheight;
        const start = new me.Vector2d(Math.floor(event.gameWorldX/w),Math.floor(event.gameWorldY/h));
        const end = new me.Vector2d(player.pos.x, player.pos.y).div(w, h).floorSelf();

        this.playerPath = await this.findNavPath(start, end);
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

  createNavGrid(){
    const navLayer = this.getNavLayer();

    if(navLayer){
      this.navGrid = new Grid();
      this.navGrid.setGrid(navLayer.layerData.map(arr => arr.map(tile => 0+!!tile)))
      this.navGrid.setAcceptableTiles([0]);
    }
  }
  async findNavPath(start, end){
    return new Promise((res) => {
      if(!this.navGrid) return null;

      this.navGrid.findPath(start.x, start.y, end.x, end.y, (path) => {
        res(path);
      })
    })
  }

  onGameUpdate(){
    if(this.navGrid){
      this.navGrid.calculate();
    }

    const player = this.getPlayer();
    if(player && this.playerPath && this.playerPath.length > 0){
      const level = me.level.getCurrentLevel();
      const w = level.tilewidth;
      const h = level.tileheight;
      const newPos = this.playerPath.pop();

      player.pos.set(newPos.x, newPos.y).scale(w, h).add(new me.Vector2d(8,8));
    }
  }

  onDestroyEvent() {
    me.event.off(me.event.GAME_UPDATE, this.onGameUpdate, this);
  }
}

export default PlayScreen;
