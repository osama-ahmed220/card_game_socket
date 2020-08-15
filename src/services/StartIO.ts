import { Server } from 'socket.io';
import { getRepository } from 'typeorm';
import { TblCards } from '../entity/TblCards';
import SuffleInterface from '../interfaces/SuffleInterface';
import {
  generateGameID,
  generatePlayerID,
  generateWatcherID,
} from '../utils/helpers';
import BaseIO from './BaseIO';
import Clients from './Clients';
import Game, { GameIterface } from './Game';
import { PlayersType } from './Player';
import Watcher from './Watcher';
import Watchers from './Watchers';

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

  private deal(players: PlayersType, numCards: number = 13) {
    const deck = this.cards;
    Object.keys(players).forEach((playerID) => {
      players[playerID].cards = [];
      while (players[playerID].cards?.length !== numCards) {
        players[playerID].cards?.push(
          deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
        );
      }
    });
    return players;
  }

  getCards = async () => {
    this.cards = await getRepository(TblCards).find({
      relations: ['cardType'],
    });
    this.shuffle();
    // const game = new Game();
    // const player1 = new Player();
    // player1.player_id = 1;
    // player1.player_name = 'osama';
    // const player2 = new Player();
    // player2.player_id = 2;
    // player2.player_name = 'Ahmed';
    // const player3 = new Player();
    // player3.player_id = 3;
    // player3.player_name = 'Ali';
    // const player4 = new Player();
    // player4.player_id = 4;
    // player4.player_name = 'Adeel';

    // game.players = {
    //   [player1.player_id.toString()]: player1,
    //   [player2.player_id.toString()]: player2,
    //   [player3.player_id.toString()]: player3,
    //   [player4.player_id.toString()]: player4,
    // };
    // this.deal(game);
    // Object.keys(game.players).forEach((playerID) => {
    //   console.log(`${player1} cards`, game.players[playerID].cards.length);
    // });
  };

  // private isGameExists(generatedGameID: string): boolean {
  //   return !!(generatedGameID in this.gameBoards);
  // }

  // private reOrderPlayers(
  //   players: { [key: string]: PlayerInterface },
  //   lastOrderNumber: number
  // ) {
  //   const order_number = lastOrderNumber;
  //   Object.keys(players).forEach((playerID) => {
  //     const inneerPlayer = players[playerID];
  //     if (order_number === 2 && inneerPlayer.order_number === 3) {
  //       players[playerID].order_number = 2;
  //     }
  //     if (order_number === 2 && inneerPlayer.order_number === 4) {
  //       players[playerID].order_number = 3;
  //     }
  //     if (order_number === 2 && inneerPlayer.order_number === 1) {
  //       players[playerID].order_number = 4;
  //     }

  //     if (order_number === 3 && inneerPlayer.order_number === 4) {
  //       players[playerID].order_number = 2;
  //     }
  //     if (order_number === 3 && inneerPlayer.order_number === 1) {
  //       players[playerID].order_number = 3;
  //     }
  //     if (order_number === 3 && inneerPlayer.order_number === 2) {
  //       players[playerID].order_number = 4;
  //     }

  //     if (order_number === 4 && inneerPlayer.order_number === 1) {
  //       players[playerID].order_number = 2;
  //     }
  //     if (order_number === 4 && inneerPlayer.order_number === 2) {
  //       players[playerID].order_number = 3;
  //     }
  //     if (order_number === 4 && inneerPlayer.order_number === 3) {
  //       players[playerID].order_number = 4;
  //     }
  //   });
  //   return players;
  // }

  // private suffleReorderAndAssigned(players: {
  //   [key: string]: PlayerInterface;
  // }) {
  //   this.shuffle();
  //   players = this.deal(players);
  //   // now create an order_number
  //   let order_number = 1;
  //   Object.keys(players).forEach((playerID) => {
  //     const isSeventhOfheartExists = players[playerID].cards.findIndex(
  //       (card) => card.cardNo === 7 && card.cardType.cardTypeId === 1
  //     );
  //     order_number = players[playerID].order_number;
  //     if (isSeventhOfheartExists != -1 && order_number !== 1) {
  //       // order 1
  //       players[playerID].order_number = 1;
  //     }
  //   });
  //   players = this.reOrderPlayers(players, order_number);
  //   return players;
  // }

  onConnection = () => {
    this._io.on('connection', (socket) => {
      this._socket = socket;

      this._socket.on(
        'save_details',
        (data: {
          game_id: number;
          owner_id: number;
          owner_name: string;
          players: {
            player_id: number;
            player_name: string;
          }[];
          watcher: boolean;
        }) => {
          const generatedGameID = generateGameID(data.game_id);
          this._socket.join(generatedGameID);
          if (data.watcher) {
            // get game
            if (!(generatedGameID in this.gameBoards)) {
              this._socket.emit('error', 'Game does not exists.');
              return;
            }
            const generatedWatcherID = generateWatcherID(data.owner_id);
            const watcher = new Watcher();
            watcher.player_id = data.owner_id;
            watcher.player_name = data.owner_name;
            watcher.socket_id = this._socket.id;
            this.gameBoards[generatedGameID].watchers = {
              ...this.gameBoards[generatedGameID].watchers,
              [generatedWatcherID]: watcher,
            };
            // emit whole data to this socker
            // this._socket.emit('whole_state', this.gameBoards[generatedGameID]);
            // or
            if (
              Object.keys(this.gameBoards[generatedGameID].watchers).length > 0
            ) {
              this._io.in(generatedGameID).emit(
                'watchers_list',
                Object.keys(this.gameBoards[generatedGameID].watchers).map(
                  (watcherGeneratedID) =>
                    this.gameBoards[generatedGameID].watchers[
                      watcherGeneratedID
                    ]
                )
              );
            }
            return;
          }
          let game: GameIterface;
          if (!(generatedGameID in this.gameBoards)) {
            game = new Game();
            game.game_id = data.game_id;
            game.owner_id = data.owner_id;
            game.owner_name = data.owner_name;
            data.players.forEach(({ player_id, player_name }) => {
              const generatedPlayerID = generatePlayerID(player_id);
              game.players[generatedPlayerID] = {
                player_id,
                player_name,
              };
            });
          }
        }
      );

      this._socket.on(
        'shuffle',
        (data: { game_id: number; round_id: number }) => {
          const generatedGameID = generateGameID(data.game_id);
          this.shuffle();
          const game = this.gameBoards[generatedGameID];
          const players = this.deal(game.players);
          this.gameBoards[generatedGameID].players = {
            ...players,
          };
          const shuffled_cards_res: any = {
            game_id: game.game_id,
            round_id: game.round_number,
          };
          Object.keys(players).forEach((playerGeneratedID, index) => {
            shuffled_cards_res[`player_${index + 1}`] =
              players[playerGeneratedID].cards;
          });
          this._io.to(generatedGameID).emit('shuffled', shuffled_cards_res);
        }
      );

      this._socket.on(
        'game_play_update',
        (data: {
          game_id: number;
          player_id: number;
          game_play_sequence: number;
          round_seq: number;
          player_card: number;
        }) => {}
      );

      // add watcher
      // socketID, gameID, watcherID, watcherName
      //
      // game start
      // socketID
      // gameID
      // game type
      // trix, complex
      // players
      // player1
      // playerID, playerName, isDouble
      // player2
      // playerID, playerName, isDouble
      // player3
      // playerID, playerName, isDouble
      // player4
      // playerID, playerName, isDouble
      // cardsShowType (all cards show, one person cards show or no card show)
      // shuffle
      //
      // play each card
      // sequence complete
      // round complete

      // machine events
      // this._socket.on(
      //   'game_start',
      //   (data: {
      //     game_id: number;
      //     game_type: string;
      //     show_cards: string;
      //     players: {
      //       player_id: number;
      //       player_name: string;
      //       order_number: number;
      //     }[];
      //   }) => {
      //     const generatedGameID = generateGameID(data.game_id);
      //     if (!this.isGameExists(generatedGameID)) {
      //       const game = new Game();
      //       game.game_type =
      //         data.game_type === 'complex' ? GAME_TYPE.COMPLEX : GAME_TYPE.TRIX;
      //       game.socket_id = this._socket.id;
      //       game.show_cards =
      //         data.show_cards === 'all'
      //           ? SHOW_CARDS_ENUM.ALL
      //           : data.show_cards === 'none'
      //           ? SHOW_CARDS_ENUM.NONE
      //           : SHOW_CARDS_ENUM.ONE;
      //       data.players.forEach((p) => {
      //         const generatedPlayerID = generatePlayerID(p.player_id);
      //         const player = new Player();
      //         player.player_id = p.player_id;
      //         player.player_name = p.player_name;
      //         player.order_number = p.order_number;
      //         game.players[generatedPlayerID] = player;
      //       });
      //       // now create an order_number
      //       game.players = this.suffleReorderAndAssigned(game.players);
      //       this.gameBoards = {
      //         ...this.gameBoards,
      //         [generatedGameID]: game,
      //       };
      //     }
      //     this._socket.join(generatedGameID);
      //     this._io
      //       .to(generatedGameID)
      //       .emit('start_game', this.gameBoards[generatedGameID]);
      //   }
      // );

      // this._socket.on(
      //   'is_double',
      //   (data: { game_id: number; player_id: number; is_double: boolean }) => {
      //     this.gameBoards[generateGameID(data.game_id)].players[
      //       generatePlayerID(data.player_id)
      //     ].is_double = !!data.is_double;
      //   }
      // );

      // this._socket.on(
      //   'each_card_play',
      //   (data: { game_id: number; player_id: number; card_id: number }) => {
      //     const generatedGameID = generateGameID(data.game_id);
      //     const game = this.gameBoards[generatedGameID];
      //     const generatedPlayerID = generatePlayerID(data.player_id);
      //     const player = game.players[generatedPlayerID];
      //     const playedCard = player.cards.find(
      //       (card) => card.cardId === data.card_id
      //     );
      //     if (playedCard) {
      //       const roundAndSequenceLength = game.roundAndSequence.length;
      //       const roundAndSequenceSelectedIndex = roundAndSequenceLength - 1;
      //       if (roundAndSequenceLength <= 0) {
      //         // first card
      //         this.gameBoards[generatedGameID].roundAndSequence.push([
      //           [
      //             {
      //               card_id: playedCard.cardId,
      //               player_id: player.player_id,
      //             },
      //           ],
      //         ]);
      //       } else {
      //         if (roundAndSequenceLength > 3) {
      //           // last round
      //           const round = this.gameBoards[generatedGameID].roundAndSequence[
      //             roundAndSequenceSelectedIndex
      //           ];
      //           const roundLength = round.length;
      //           const roundCurrentIndex = roundLength - 1;
      //           if (roundLength <= 0) {
      //             // first sequence
      //             this.gameBoards[generatedGameID].roundAndSequence[
      //               roundAndSequenceSelectedIndex
      //             ].push([
      //               {
      //                 card_id: playedCard.cardId,
      //                 player_id: player.player_id,
      //               },
      //             ]);
      //           } else {
      //             if (roundLength > 12) {
      //               // last sequence
      //             } else {
      //             }
      //           }
      //         } else {
      //         }
      //       }
      //     }
      //   }
      // );

      // // new or first round start
      // this._socket.on('shuffle', (data: { game_id: number }) => {
      //   // i know the orders of the players here
      //   const generatedGameID = generateGameID(data.game_id);
      //   const game = this.gameBoards[generatedGameID];
      //   game.players = this.suffleReorderAndAssigned(game.players);
      //   // might be one round complete
      //   this._io.to(generatedGameID).emit('suffled_cards', game.players);
      // });

      // this._socket.on('save_details', (data: SaveDetailsInterface) => {
      //   const game = new Game();
      //   const user = new User();
      //   user.player_id = parseInt(data.player_id);
      //   user.player_name = data.player_name;
      //   user.socket_id = this._socket.id;
      //   const gameData = game.addUser(
      //     data.watcher,
      //     this.gameBoards[data.game_id],
      //     user
      //   );
      //   gameData.game_id = data.game_id;
      //   if (Object.keys(this.gameBoards).length > 0) {
      //     // object exists
      //     if (this.gameBoards[data.game_id]) {
      //       // game_id exists
      //       this.gameBoards[data.game_id] = {
      //         ...gameData,
      //       };
      //     } else {
      //       // game_id not exists
      //       this.gameBoards = {
      //         ...this.gameBoards,
      //         [data.game_id]: {
      //           ...gameData,
      //         },
      //       };
      //     }
      //   } else {
      //     // game object does not exists
      //     this.gameBoards = {
      //       [data.game_id]: {
      //         ...gameData,
      //       },
      //     };
      //   }
      //   console.log('All Connected Clients: ', [
      //     ...[this.gameBoards[data.game_id].players],
      //     ...[this.gameBoards[data.game_id].watchers],
      //   ]);
      //   this._socket.join(data.game_id);
      //   // cards for each player
      // });
      // trigger on each round
      // this._socket.on('shuffle', () => {
      //   // get game id by socket.id
      //   const game_id = this.getGameIDBySocketID();
      //   const game = this.getGameState();
      //   if (game && game_id) {
      //     // shuffle the cards
      //     this.shuffle();
      //     // distribute cards to each player
      //     game.players = this.deal(game.players);
      //     const playerData = Object.keys(game.players).map((playerID) => ({
      //       player_id: playerID,
      //       cards: game.players[playerID].cards,
      //     }));
      //     // set player orders
      //     playerData.forEach((p) => {
      //       // const cards = p.cards;
      //       // const cardIndex = cards.find(
      //       //   (card) => card.cardNo === 7 && card.cardType.cardTypeId === 1
      //       // );
      //       this.gameBoards[game_id].players[p.player_id].order_number;
      //     });
      //     // send these player cards to the front end
      //     this._io.to(game_id).emit('player_cards', playerData);
      //   }
      // });
      // this._socket.on('each_card_play', (cardID: number) => {
      //   const game_id = this.getGameIDBySocketID();
      //   const game = this.getGameState();
      //   if (game && game_id) {
      //     // remove card from players cards array
      //     // const player = this.getPlayer();
      //     const player = this.getPlayer();
      //     if (player) {
      //       const cards = this.getPlayerCards();
      //       const cardIndex = cards.findIndex((card) => card.cardId === cardID);
      //       cards.splice(cardIndex, 1);
      //       // updates cards array in game
      //       this.gameBoards[game_id].players[player.player_id].cards = [
      //         ...cards,
      //       ];
      //       // send group with update card
      //       this._io.to(game_id).emit('player_cards', {
      //         player_id: player.player_id,
      //         cards: this.gameBoards[game_id].players[player.player_id].cards,
      //       });
      //     }
      //   }
      // });
      this._socket.on('disconnect', async () => {
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
    this._socket.on('shuffle', (data: SuffleInterface) => {
      console.log('shuffleData', data);
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
