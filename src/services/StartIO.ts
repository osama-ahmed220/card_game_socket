import { Server } from "socket.io";
import { getRepository } from "typeorm";
import { TblCards } from "../entity/TblCards";
import SaveDetailsInterface from "../interfaces/SaveDetailsInterface";
import SuffleInterface from "../interfaces/SuffleInterface";
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
    this.onEachCard();
    this.getCards();
  }

  getCards = async () => {
    this.cards = await getRepository(TblCards).find();
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
        if (gameWatchers.length > 0) {
          this._io.to(game_id).emit("watchers_list", gameWatchers);
        }
        // cards for each player
        
      });
      this.onSuffle();
    });
  };

  onEachCard = () => {
    this._socket.on("each_card", (data: any) => {
      // get game id
      // const game_id = this._socketInfo.game_id;
      // const player_id = this._socketInfo.player_id;
      // const card_id = data.card_id;

      // card number
      // player id

    });
  };

  onSuffle = () => {
    this._socket.on("shuffle", (data: SuffleInterface) => {
      console.log('shuffleData', data);
      
    });
  };
}
