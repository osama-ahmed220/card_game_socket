import { Server } from "socket.io";
import { TblCards } from "../entity/TblCards";
import SaveDetailsInterface from "../interfaces/SaveDetailsInterface";
import BaseIO from "./BaseIO";
import Clients from "./Clients";
import Watchers from "./Watchers";

export default class StartIO extends BaseIO {
  clientsInstance = new Clients();
  watchersInstance = new Watchers();
  cards: TblCards[] = [];

  constructor(io: Server) {
    super(io);
    this.onConnection();
    this.getCards()
  }

  getCards = async () => {
    //   setTimeout(async () => {

    //       this.cards = await getRepository(TblCards).find();
    //       console.log('cards', this.cards);
    //   }, 5000);
  };

  onConnection = () => {
    this._io.on("connection", (socket) => {
      this._socket = socket;
      this._socket.on("save_details", (data: SaveDetailsInterface) => {
        this._socketInfo = {
          game_id: data.game_id,
          player_id: data.player_id,
          player_name: data.player_name,
          watcher: data.watcher,
        };
        const game_id = data.game_id;
        this.clientsInstance.newCLient(this._socketInfo);
        console.log("All Connected Clients: ", this.clientsInstance.clients);
        this._socket.join(data.game_id);

        if ("watcher" in data && data.watcher) {
          this.watchersInstance.addNew(game_id, this._socketInfo);
        }
        const gameWatchers = this.watchersInstance.getGameWatchers(game_id);
        if(gameWatchers.length > 0) {
            this._io.to(game_id).emit("watchers_list", gameWatchers);
        }
      });
      this.onSuffle();
    });
  };

  onSuffle = () => {
    // this._socket.on("shuffle", (data: SuffleInterface) => {

    // });
  };
}
