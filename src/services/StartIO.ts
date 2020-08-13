import { Server } from "socket.io";
import { getRepository } from "typeorm";
import { TblCards } from "../entity/TblCards";
import SaveDetailsInterface from "../interfaces/SaveDetailsInterface";
import SuffleInterface from "../interfaces/SuffleInterface";
import BaseIO from "./BaseIO";
import Clients from "./Clients";
import Game, { GameIterface } from "./Game";
import User from "./User";
import Watchers from "./Watchers";

export default class StartIO extends BaseIO {
  clientsInstance = new Clients();
  watchersInstance = new Watchers();
  cards: TblCards[] = [];
  gameBoards: { [key: string]: GameIterface };

  constructor(io: Server) {
    super(io);
    this.onConnection();
    this.onEachCard();
    this.getCards();
  }

  private shuffle() {
    const deck = [...this.cards];
    let count = deck.length;
    while (count) {
      deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
      count -= 1;
    }
    this.cards = [...deck];
  }

  private deal(game: GameIterface, numCards: number = 13) {
    const deck = this.cards;
    const players = game.players;
    Object.keys(players).forEach((playerID) => {
      const player = players[playerID];
      player.cards = [];
      while (player.cards.length !== numCards) {
        player.cards.push(
          deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
        );
      }
    });
  }

  getCards = async () => {
    this.cards = await getRepository(TblCards).find({
      relations: ["cardType"],
    });
    this.shuffle();
    // const game = new Game();
    // const player1 = new Player()
    // player1.player_id = 1;
    // player1.player_name = "osama";
    // const player2 = new Player()
    // player2.player_id = 2;
    // player2.player_name = "Ahmed";
    // const player3 = new Player()
    // player3.player_id = 3;
    // player3.player_name = "Ali";
    // const player4 = new Player()
    // player4.player_id = 4;
    // player4.player_name = "Adeel";

    // game.players = {
    //   [player1.player_id.toString()]: player1,
    //   [player2.player_id.toString()]: player2,
    //   [player3.player_id.toString()]: player3,
    //   [player4.player_id.toString()]: player4,
    // };
    // this.deal(game);
    // Object.keys(game.players).forEach(playerID => {
    //   console.log(`${player1} cards`, game.players[playerID].cards.length);
    // });
  };

  onConnection = () => {
    this._io.on("connection", (socket) => {
      this._socket = socket;
      this._socket.on("save_details", (data: SaveDetailsInterface) => {
        const game = new Game();
        const user = new User();
        user.player_id = parseInt(data.player_id);
        user.player_name = data.player_name;
        user.socket_id = this._socket.id;
        const gameData = game.addUser(
          data.watcher,
          this.gameBoards[data.game_id],
          user
        );
        gameData.game_id = data.game_id;
        if (Object.keys(this.gameBoards).length > 0) {
          // object exists
          if (this.gameBoards[data.game_id]) {
            // game_id exists
            this.gameBoards[data.game_id] = {
              ...gameData,
            };
          } else {
            // game_id not exists
            this.gameBoards = {
              ...this.gameBoards,
              [data.game_id]: {
                ...gameData,
              },
            };
          }
        } else {
          // game object does not exists
          this.gameBoards = {
            [data.game_id]: {
              ...gameData,
            },
          };
        }
        console.log("All Connected Clients: ", [
          ...[this.gameBoards[data.game_id].players],
          ...[this.gameBoards[data.game_id].watchers],
        ]);
        this._socket.join(data.game_id);
        // cards for each player
      });
      // trigger on each round
      this._socket.on("shuffle", () => {
        // get game id by socket.id
        const game_id = this.getGameIDBySocketID();
        const game = this.getGameState();
        if (game && game_id) {
          // shuffle the cards
          this.shuffle();
          // distribute cards to each player
          this.deal(game);
          const playerData = Object.keys(game.players).map(
            (playerID) => ({
              player_id: playerID,
              cards: game.players[playerID].cards
            })
          );
          // set player orders
          playerData.forEach(p => {
            const cards = p.cards;
            const cardIndex = cards.find((card) => card.cardNo === 7 && card.cardType.cardTypeId === 1);
            this.gameBoards[game_id].players[p.player_id].order
          });
          // send these player cards to the front end
          this._io.to(game_id).emit(
            "player_cards",
            playerData
          );
        }
      });
      this._socket.on("each_card_play", (cardID: number) => {
        const game_id = this.getGameIDBySocketID();
        const game = this.getGameState();
        if (game && game_id) {
          // remove card from players cards array
          // const player = this.getPlayer();
          const player = this.getPlayer();
          if (player) {
            const cards = this.getPlayerCards();
            const cardIndex = cards.findIndex((card) => card.cardId === cardID);
            cards.splice(cardIndex, 1);
            // updates cards array in game
            this.gameBoards[game_id].players[player.player_id].cards = [
              ...cards,
            ];
            // send group with update card
            this._io.to(game_id).emit(
              "player_cards",
              {
                player_id: player.player_id,
                cards: this.gameBoards[game_id].players[player.player_id].cards
              }
            );
          }
        }
      });
      this._socket.on("disconnect", async () => {
        const game = this.getGameState();
        if (game) {
          // remove data from game object
          // check wether a player or watcher
          const gameInstance = new Game();
          const removeCLientGame = gameInstance.removeUser(
            game,
            this._socket.id
          );
          const game_id = this.getGameIDBySocketID();
          if (game_id) {
            this.gameBoards = {
              ...this.gameBoards,
              [game_id]: {
                ...removeCLientGame,
              },
            };
            // emit event to let know all room client that a user disconnect
          }
        }
      });
      this.onSuffle();
    });
  };

  onEachCard = () => {
    // this._socket.on("each_card", (data: any) => {
    //   // get game id
    //   // const game_id = this._socketInfo.game_id;
    //   // const player_id = this._socketInfo.player_id;
    //   // const card_id = data.card_id;
    //   // card number
    //   // player id
    // });
  };

  onSuffle = () => {
    this._socket.on("shuffle", (data: SuffleInterface) => {
      console.log("shuffleData", data);
    });
  };

  private getGameIDBySocketID() {
    const game_id = Object.keys(this.gameBoards).find((game_id) => {
      const clientList = {
        ...this.gameBoards[game_id].players,
        ...this.gameBoards[game_id].watchers,
      };
      return Object.keys(clientList).find((clientID) => {
        if (clientID in this.gameBoards[game_id].players) {
          // its a player
          return (
            this._socket.id ===
            this.gameBoards[game_id].players[clientID].socket_id
          );
        }
        if (clientID in this.gameBoards[game_id].watchers) {
          // its a watcher
          return (
            this._socket.id ===
            this.gameBoards[game_id].watchers[clientID].socket_id
          );
        }
        return false;
      });
    });
    return game_id;
  }

  private getGameState() {
    const game_id = this.getGameIDBySocketID();
    if (game_id) {
      return this.gameBoards[game_id];
    }
    return undefined;
  }

  private getPlayer() {
    const game = this.getGameState();
    if (game) {
      const playerID = Object.keys(game.players).find(
        (playerID) => game.players[playerID].socket_id === this._socket.id
      );
      if (playerID) {
        return game.players[playerID];
      }
    }
    return undefined;
  }

  private getPlayerCards() {
    const player = this.getPlayer();
    if (player) {
      return player.cards;
    }
    return [];
  }
}
