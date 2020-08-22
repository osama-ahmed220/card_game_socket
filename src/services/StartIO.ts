import { Namespace, Server, Socket } from 'socket.io';
import { getRepository } from 'typeorm';
import { TblCards } from '../entity/TblCards';
import {
  generateGameID,
  generatePlayerID,
  generateWatcherID,
} from '../utils/helpers';
import BaseIO from './BaseIO';
import Clients from './Clients';
import Game, { CardsOnTableI, GameIterface, GAME_TYPE } from './Game';
import { PlayerInterface, PlayersType } from './Player';
import Watcher from './Watcher';
import Watchers from './Watchers';

interface SaveDetailsRequestI {
  game_id: number;
  owner_id: number;
  owner_name: string;
  players: {
    player_id: number;
    player_name: string;
    order_number?: number;
  }[];
  watcher: boolean;
  show_cards?: number;
}

interface GamePlayeUpdateI {
  game_id: number;
  player_id: number;
  card_id: number;
  game_play_sequence: number;
  round_seq: number;
  player_card: number;
}

const trixCardPoints: { [key: string]: number } = {
  D: -10,
  '11': -25,
  '12-H': -75,
};

const order_number_calculation: {
  [key: number]: { plus: number; minus: number };
} = {
  1: {
    plus: 0,
    minus: 0,
  },
  2: {
    plus: 3,
    minus: 1,
  },
  3: {
    plus: 2,
    minus: 2,
  },
  4: {
    plus: 1,
    minus: 3,
  },
};

export default class StartIO extends BaseIO {
  clientsInstance = new Clients();
  watchersInstance = new Watchers();
  cards: TblCards[] = [];
  gameBoards: { [key: string]: GameIterface };

  constructor(io: Server) {
    super(io);
    this.onConnection();
    // this.getCards();
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

  private _generateGame(data: SaveDetailsRequestI) {
    const game = new Game();
    game.game_id = data.game_id;
    game.owner_id = data.owner_id;
    game.owner_name = data.owner_name;
    data.players.forEach(({ player_id, player_name, order_number }) => {
      const generatedPlayerID = generatePlayerID(player_id);
      game.players[generatedPlayerID] = {
        player_id,
        player_name,
        order_number,
      };
    });
    return game;
  }

  private _emitWatchersListToAll(to: Socket | Namespace, game: GameIterface) {
    if (Object.keys(game.watchers).length > 0) {
      to.emit(
        'watchers_list',
        Object.keys(game.watchers).map(
          (watcherGeneratedID) => game.watchers[watcherGeneratedID]
        )
      );
    }
  }

  private _reOrderPlayers(players: PlayersType) {
    let order_number = 1;
    for (let i = 0; i < Object.keys(players).length; i++) {
      const playerGeneratedID = Object.keys(players)[i];
      const found = players[playerGeneratedID].cards?.findIndex(
        (card) => card.cardNo === 6 && card.cardType.cardTypeName === 'H'
      );
      if (found !== -1) {
        order_number = players[playerGeneratedID].order_number || 1;
        break;
      }
    }
    for (let i = 0; i < Object.keys(players).length; i++) {
      const playerGeneratedID = Object.keys(players)[i];
      const player = players[playerGeneratedID];
      if (player.order_number) {
        const orderNumberCalucationObject =
          order_number_calculation[player.order_number];
        if (player.order_number >= order_number) {
          // minus
          player.order_number =
            player.order_number - orderNumberCalucationObject.minus;
        } else {
          // plus
          player.order_number =
            player.order_number + orderNumberCalucationObject.plus;
        }
      }
    }
    return players;
  }

  // private _emitCardsOnTable(to: Socket | Namespace, game: GameIterface) {
  //   to.emit('cards_on_table', game);
  // }

  // private _emitSequenceScore(to: Socket | Namespace, game: GameIterface) {
  //   to.emit('seq_score', game);
  // }

  private _getMaxCard(cardsOnTable: { player_id: number; card_id: number }[]) {
    return cardsOnTable.findIndex((cardObTable) => {
      const foundCard = this.cards.find(
        ({ cardNo }) =>
          cardNo ===
          Math.max(
            ...cardsOnTable.map(({ card_id }) => {
              const cardNOArr = this.cards.find(
                ({ cardId }) => cardId === card_id
              );
              return cardNOArr && cardNOArr.cardNo ? cardNOArr.cardNo : 0;
            })
          )
      );
      return foundCard ? foundCard.cardId === cardObTable.card_id : false;
    });
  }

  private _getHighestPlayedCardPlayerID(cards_on_table: CardsOnTableI[]) {
    const maxCardIndex = this._getMaxCard(cards_on_table);
    if (maxCardIndex !== -1) {
      return cards_on_table[maxCardIndex];
    }
    return false;
  }

  private _calculateSequenceScore(cards_on_table: CardsOnTableI[]) {
    let playerScore = 0;
    for (let i = 0; i < cards_on_table.length; i++) {
      const cardID = cards_on_table[i].card_id;
      const foundCard = this.cards.find(({ cardId }) => cardID === cardId);
      if (foundCard) {
        if (
          foundCard.cardType.cardTypeName &&
          foundCard.cardType.cardTypeName in trixCardPoints
        ) {
          // diamonds
          playerScore =
            playerScore + trixCardPoints[foundCard.cardType.cardTypeName];
        }
        if (foundCard.cardNo && foundCard.cardNo.toString() in trixCardPoints) {
          // all queens
          playerScore =
            playerScore + trixCardPoints[foundCard.cardNo.toString()];
        }
        if (
          foundCard.cardNo &&
          foundCard.cardType.cardTypeName &&
          `${foundCard.cardNo}-${foundCard.cardType.cardTypeName}` in
            trixCardPoints
        ) {
          // king of heart
          playerScore =
            playerScore +
            trixCardPoints[
              `${foundCard.cardNo}-${foundCard.cardType.cardTypeName}`
            ];
        }
      }
    }
    return playerScore;
  }

  private _manageCardsOnTable(game: GameIterface, data: GamePlayeUpdateI) {
    if (game.cards_on_table.length === 4) {
      const maxCardPlayed = this._getHighestPlayedCardPlayerID(
        game.cards_on_table
      );
      if (maxCardPlayed) {
        const generatedPlayerID = generatePlayerID(maxCardPlayed.player_id);
        const playerScore = this._calculateSequenceScore(game.cards_on_table);
        const player = game.players[generatedPlayerID];
        player.sequence_score = -15 + playerScore;
        player.total_score =
          player.total_score && player.sequence_score
            ? player.total_score + player.sequence_score
            : 0;
        game.players[generatedPlayerID] = {
          ...player,
        };
      }
      // sequence completed
      if (game.sequence_number === 13) {
        game.sequence_number = 0;
        game.round_number = game.round_number + 1;
      } else {
        game.sequence_number = game.sequence_number + 1;
      }
      game.sequence_cards.push(game.cards_on_table);
      game.cards_on_table = [];
    } else {
      game.cards_on_table.push({
        sequence_number: game.sequence_number,
        player_id: data.player_id,
        card_id: data.card_id,
      });
    }
    return game;
  }

  private _onShuffle(data: { game_id: number }) {
    const generatedGameID = generateGameID(data.game_id);
    this.shuffle();
    const game = this.gameBoards[generatedGameID];
    let players = this.deal(game.players);
    if (game.round_number === 0) {
      players = {
        ...this._reOrderPlayers(players),
      };
    }
    game.players = {
      ...players,
    };
    const playerShuffleCards: PlayerInterface[] = Object.keys(players).map(
      (playerGeneratedID) => ({
        player_id: players[playerGeneratedID].player_id,
        player_name: players[playerGeneratedID].player_name,
        cards: players[playerGeneratedID].cards,
        order_number: players[playerGeneratedID].order_number,
      })
    );
    this._io.to(generatedGameID).emit('shuffled', playerShuffleCards);
    return game;
  }

  onConnection = () => {
    this._io.on('connection', (socket) => {
      // socket = socket;

      // socket.on('test', () => {
      //   console.log('socket', socket.id);
      // });

      // socket.on('test2', () => {
      //   console.log('socketID', socket.id);
      // });

      socket.on('save_details', (data: SaveDetailsRequestI) => {
        const generatedGameID = generateGameID(data.game_id);
        socket.join(generatedGameID);
        let game: GameIterface;
        if (data.watcher) {
          // get game
          if (!(generatedGameID in this.gameBoards)) {
            socket.emit('error', 'Game does not exists.');
            return;
          }
          const generatedWatcherID = generateWatcherID(data.owner_id);
          game = this.gameBoards[generatedGameID];
          const watcher = new Watcher();
          watcher.player_id = data.owner_id;
          watcher.player_name = data.owner_name;
          watcher.socket_id = socket.id;
          game.watchers = {
            ...game.watchers,
            [generatedWatcherID]: watcher,
          };
          // emit whole data to this socker
          // socket.emit('whole_state', this.gameBoards[generatedGameID]);
          // or
        } else {
          if (!(generatedGameID in this.gameBoards)) {
            game = this._generateGame(data);
          } else {
            game = this.gameBoards[generatedGameID];
          }
        }

        if (data.show_cards !== undefined) {
          game.show_cards = data.show_cards;
        }

        this._emitWatchersListToAll(this._io.to(generatedGameID), game);

        socket.emit('whole_state', {
          round_number: game.round_number,
          sequence_number: game.sequence_number,
          cards_on_table: game.cards_on_table,
          players: game.players,
        });

        // this._emitCardsOnTable(socket, game);

        // this._emitSequenceScore(this._io.to(generatedGameID), game);

        this.gameBoards[generatedGameID] = {
          ...game,
        };
      });

      socket.on('shuffle', (data: { game_id: number }) => {
        const generatedGameID = generateGameID(data.game_id);
        const game = this._onShuffle(data);
        this.gameBoards[generatedGameID] = {
          ...game,
        };
      });

      socket.on('game_type', (data: { game_id: number; type: GAME_TYPE }) => {
        const generatedGameID = generateGameID(data.game_id);
        const game = this.gameBoards[generatedGameID];
        game.game_type =
          data.type === GAME_TYPE.COMPLEX ? GAME_TYPE.COMPLEX : GAME_TYPE.TRIX;
      });

      socket.on('game_play_update', (data: GamePlayeUpdateI) => {
        const generatedGameID = generateGameID(data.game_id);
        // socket.to(generatedGameID).emit('card_received', data);
        let game = this.gameBoards[generatedGameID];
        // game = this._manageCardsOnTable(game, data);
        if (game.sequence_number === 13) {
          // round complete
          // const lastRoundNumber = game.round_number;
          game = this._manageCardsOnTable(game, data);
          if (game.round_number < 8) {
            // shuffle the cards the
            game = this._onShuffle({ game_id: game.game_id });
          }
        } else {
          game = this._manageCardsOnTable(game, data);
        }
        this.gameBoards[generatedGameID] = {
          ...game,
        };
      });

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
      // socket.on(
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
      //       game.socket_id = socket.id;
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
      //     socket.join(generatedGameID);
      //     this._io
      //       .to(generatedGameID)
      //       .emit('start_game', this.gameBoards[generatedGameID]);
      //   }
      // );

      // socket.on(
      //   'is_double',
      //   (data: { game_id: number; player_id: number; is_double: boolean }) => {
      //     this.gameBoards[generateGameID(data.game_id)].players[
      //       generatePlayerID(data.player_id)
      //     ].is_double = !!data.is_double;
      //   }
      // );

      // socket.on(
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
      // socket.on('shuffle', (data: { game_id: number }) => {
      //   // i know the orders of the players here
      //   const generatedGameID = generateGameID(data.game_id);
      //   const game = this.gameBoards[generatedGameID];
      //   game.players = this.suffleReorderAndAssigned(game.players);
      //   // might be one round complete
      //   this._io.to(generatedGameID).emit('suffled_cards', game.players);
      // });

      // socket.on('save_details', (data: SaveDetailsInterface) => {
      //   const game = new Game();
      //   const user = new User();
      //   user.player_id = parseInt(data.player_id);
      //   user.player_name = data.player_name;
      //   user.socket_id = socket.id;
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
      //   socket.join(data.game_id);
      //   // cards for each player
      // });
      // trigger on each round
      // socket.on('shuffle', () => {
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
      // socket.on('each_card_play', (cardID: number) => {
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
      // socket.on('disconnect', async () => {
      //   const game = this.getGameState();
      //   if (game) {
      //     // remove data from game object
      //     // check wether a player or watcher
      //     const gameInstance = new Game();
      //     const removeCLientGame = gameInstance.removeUser(
      //       game,
      //       socket.id
      //     );
      //     const game_id = this.getGameIDBySocketID();
      //     if (game_id) {
      //       this.gameBoards = {
      //         ...this.gameBoards,
      //         [game_id]: {
      //           ...removeCLientGame,
      //         },
      //       };
      //       // emit event to let know all room client that a user disconnect
      //     }
      //   }
      // });
    });
  };

  // private getGameIDBySocketID() {
  //   const game_id = Object.keys(this.gameBoards).find((game_id) => {
  //     const clientList = {
  //       ...this.gameBoards[game_id].players,
  //       ...this.gameBoards[game_id].watchers,
  //     };
  //     return Object.keys(clientList).find((clientID) => {
  //       if (clientID in this.gameBoards[game_id].players) {
  //         // its a player
  //         return (
  //           socket.id ===
  //           this.gameBoards[game_id].players[clientID].socket_id
  //         );
  //       }
  //       if (clientID in this.gameBoards[game_id].watchers) {
  //         // its a watcher
  //         return (
  //           socket.id ===
  //           this.gameBoards[game_id].watchers[clientID].socket_id
  //         );
  //       }
  //       return false;
  //     });
  //   });
  //   return game_id;
  // }

  // private getGameState() {
  //   const game_id = this.getGameIDBySocketID();
  //   if (game_id) {
  //     return this.gameBoards[game_id];
  //   }
  //   return undefined;
  // }

  // private getPlayer() {
  //   const game = this.getGameState();
  //   if (game) {
  //     const playerID = Object.keys(game.players).find(
  //       (playerID) => game.players[playerID].socket_id === socket.id
  //     );
  //     if (playerID) {
  //       return game.players[playerID];
  //     }
  //   }
  //   return undefined;
  // }

  // private getPlayerCards() {
  //   const player = this.getPlayer();
  //   if (player) {
  //     return player.cards;
  //   }
  //   return [];
  // }
}
