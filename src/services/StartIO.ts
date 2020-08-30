import { Server, Socket } from 'socket.io';
import { TblCards } from '../entity/TblCards';
import { CARD_TYPE_NAME } from '../entity/TblCardType';
import cardsData from '../mocks/card_tbl';
import {
  generateGameID,
  generatePlayerID,
  generateWatcherID,
} from '../utils/helpers';
import BaseIO from './BaseIO';
import Clients from './Clients';
import Game, {
  CardsOnTableI,
  GameIterface,
  GameType,
  SHOW_CARDS_ENUM,
} from './Game';
import { PlayerInterface, PlayersType } from './Player';
import Watcher from './Watcher';
import Watchers from './Watchers';

interface SaveDetailsRequestI {
  game_id: number;
  owner_id: number;
  owner_name: string;
  players?: {
    player_id: number;
    player_name: string;
    order_number?: number;
  }[];
  watcher: boolean;
  show_cards?: SHOW_CARDS_ENUM;
}

interface GamePlayeUpdateI {
  game_id: number;
  player_id: number;
  card_id: number;
  game_play_sequence: number;
  round_seq: number;
  player_card: number;
}

const complexCardPoints: { [key: string]: number } = {
  [CARD_TYPE_NAME.DIAMONDS]: -10,
  '11': -25,
  [`12-${CARD_TYPE_NAME.HEARTS}`]: -75,
};

const complexDoubledCardPoints: {
  [key: string]: {
    eater: number;
    owner: number;
  };
} = {
  '11': {
    eater: -50,
    owner: 25,
  },
  [`12-${CARD_TYPE_NAME.HEARTS}`]: {
    eater: -150,
    owner: 75,
  },
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
  gameBoards: { [key: string]: GameIterface } = {};

  constructor(io: Server) {
    super(io);
    this.onConnection();
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
    const deck = [...this.cards];
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
    this.cards = cardsData;
    // this.cards = await getRepository(TblCards).find({
    //   relations: ['cardType'],
    // });
    this.shuffle();
  };

  private _generateGame(data: SaveDetailsRequestI) {
    const game = new Game();
    game.game_id = data.game_id;
    game.owner_id = data.owner_id;
    game.owner_name = data.owner_name;
    (data.players || []).forEach(({ player_id, player_name, order_number }) => {
      const generatedPlayerID = generatePlayerID(player_id);
      game.players[generatedPlayerID] = {
        player_id,
        player_name,
        order_number,
      };
    });
    return game;
  }

  private _reOrderPlayers(players: PlayersType) {
    let order_number = 1;
    for (let i = 0; i < Object.keys(players).length; i++) {
      const playerGeneratedID = Object.keys(players)[i];
      const found = players[playerGeneratedID].cards?.findIndex(
        (card) =>
          card.cardNo === 6 &&
          card.cardType.cardTypeName === CARD_TYPE_NAME.HEARTS
      );
      if (found !== -1) {
        order_number = players[playerGeneratedID].order_number || 1;
        break;
      }
    }
    if (order_number > 1) {
      for (let i = 0; i < Object.keys(players).length; i++) {
        const playerGeneratedID = Object.keys(players)[i];
        const player = players[playerGeneratedID];
        if (player.order_number) {
          const orderNumberCalucationObject =
            order_number_calculation[order_number];
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
    }
    return players;
  }

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

  private _calculateSequenceScore(
    game: GameIterface,
    maxCardPlayer: PlayerInterface
  ) {
    let playerScore = 0;
    const generatedGameID = generateGameID(game.game_id);
    for (let i = 0; i < game.cards_on_table.length; i++) {
      const cards_on_table_obj = game.cards_on_table[i];
      const cardID = cards_on_table_obj.card_id;
      const foundCard = this.cards.find(({ cardId }) => cardID === cardId);
      const generatedPlayerID = generatePlayerID(cards_on_table_obj.player_id);
      const cardOwnerPlayer = game.players[generatedPlayerID];
      if (foundCard) {
        if (
          foundCard.cardType.cardTypeName &&
          foundCard.cardType.cardTypeName in complexCardPoints
        ) {
          // diamonds
          playerScore =
            playerScore + complexCardPoints[foundCard.cardType.cardTypeName];
        }
        if (
          foundCard.cardNo &&
          (foundCard.cardNo.toString() in complexCardPoints ||
            foundCard.cardNo.toString() in complexDoubledCardPoints)
        ) {
          // all queens
          if (cardOwnerPlayer.is_double) {
            const complexDoubledCardPoint =
              complexDoubledCardPoints[foundCard.cardNo.toString()];
            if (maxCardPlayer.player_id !== cardOwnerPlayer.player_id) {
              cardOwnerPlayer.sequence_score = complexDoubledCardPoint.owner;
              cardOwnerPlayer.total_score =
                (cardOwnerPlayer.total_score || 0) +
                cardOwnerPlayer.sequence_score;
              this._io.to(generatedGameID).emit('player_sequenced_score', {
                player_id: cardOwnerPlayer.player_id,
                sequence_score: cardOwnerPlayer.sequence_score,
              });
              game.players[generatedPlayerID] = {
                ...cardOwnerPlayer,
              };
            }
            playerScore = playerScore + complexDoubledCardPoint.eater;
          }
          playerScore =
            playerScore + complexCardPoints[foundCard.cardNo.toString()];
        }
        const logicKey = `${foundCard.cardNo}-${foundCard.cardType.cardTypeName}`;
        if (
          foundCard.cardNo &&
          foundCard.cardType.cardTypeName &&
          (logicKey in complexCardPoints ||
            logicKey in complexDoubledCardPoints)
        ) {
          // king of heart
          if (cardOwnerPlayer.is_double) {
            const complexDoubledCardPoint = complexDoubledCardPoints[logicKey];
            if (maxCardPlayer.player_id !== cardOwnerPlayer.player_id) {
              cardOwnerPlayer.sequence_score = complexDoubledCardPoint.owner;
              cardOwnerPlayer.total_score =
                (cardOwnerPlayer.total_score || 0) +
                cardOwnerPlayer.sequence_score;
              this._io.to(generatedGameID).emit('player_sequenced_score', {
                player_id: cardOwnerPlayer.player_id,
                sequence_score: cardOwnerPlayer.sequence_score,
              });
              game.players[generatedPlayerID] = {
                ...cardOwnerPlayer,
              };
            }
            playerScore = playerScore + complexDoubledCardPoint.eater;
          }
          playerScore = playerScore + complexCardPoints[logicKey];
        }
      }
    }
    return {
      playerScore,
      game,
    };
  }

  private _getPlayerByOrderNumber(
    players: { [key: string]: PlayerInterface },
    order_number: number = 1
  ) {
    for (let i = 0; i < Object.keys(players).length; i++) {
      const player = players[Object.keys(players)[i]];
      if (player.order_number && player.order_number === order_number) {
        return player;
      }
    }
    return null;
  }

  private _manageCardsOnTable(game: GameIterface, data: GamePlayeUpdateI) {
    const generatedGameID = generateGameID(game.game_id);
    const newCardOnTable = {
      sequence_number: game.sequence_number,
      player_id: data.player_id,
      card_id: data.card_id,
    };
    game.cards_on_table.push(newCardOnTable);
    this._io.to(generatedGameID).emit('new_card_on_table', newCardOnTable);
    const currentPlayerGeneratedID = generatePlayerID(data.player_id);
    const currentPlayer = game.players[currentPlayerGeneratedID];
    if (currentPlayer.order_number && currentPlayer.order_number === 4) {
      game.player_turn = 1;
    } else {
      game.player_turn = currentPlayer.order_number! + 1;
    }
    if (game.game_type === 'complex') {
      if (game.cards_on_table.length === 4) {
        const maxCardPlayed = this._getHighestPlayedCardPlayerID(
          game.cards_on_table
        );
        const generatedPlayerID = generatePlayerID(
          (maxCardPlayed as CardsOnTableI).player_id
        );
        const player = game.players[generatedPlayerID];
        const { playerScore, ...rest } = this._calculateSequenceScore(
          game,
          player
        );
        game = rest.game;
        game.player_turn = player.order_number!;
        player.sequence_score = -15 + playerScore;
        player.total_score =
          player.total_score && player.sequence_score
            ? player.total_score + player.sequence_score
            : 0;
        game.players[generatedPlayerID] = {
          ...player,
        };
        this._io.to(generatedGameID).emit('player_sequenced_score', {
          player_id: player.player_id,
          sequence_score: player.sequence_score,
        });
        // }
        game.sequence_cards.push(game.cards_on_table);
        game.cards_on_table = [];
        game.sequence_number = game.sequence_number + 1;
      }
    }
    if (game.game_type === 'trix') {
    }
    if (game.sequence_number === 13) {
      // round complete
      this._io.to(generatedGameID).emit(
        'players_score',
        Object.keys(game.players).map((key) => ({
          player_id: game.players[key].player_id,
          total_score: game.players[key].total_score,
        }))
      );
      const completedRoundPlayerGeneratedID = generatePlayerID(
        this._getPlayerByOrderNumber(game.players, game.next_round_start_with)!
          .player_id
      );
      const completedRoundPlayer =
        game.players[completedRoundPlayerGeneratedID];
      if (game.game_type === 'complex') {
        completedRoundPlayer.isComplexCompleted = true;
      } else {
        completedRoundPlayer.isTrixCompleted = true;
      }
      if (
        completedRoundPlayer.isComplexCompleted &&
        completedRoundPlayer.isTrixCompleted &&
        completedRoundPlayer.order_number &&
        completedRoundPlayer.order_number !== 4
      ) {
        game.next_round_start_with = completedRoundPlayer.order_number + 1;
      }
      game.player_turn = game.next_round_start_with;
      game.round_number = game.round_number + 1;
      if (game.round_number < 8) {
        game = this._onShuffle(game);
      }
    }
    if (game.round_number === 8) {
      // game completed
    } else {
      this._io.to(generatedGameID).emit('next_player_turn', game.player_turn);
    }
    return game;
  }

  private _onShuffle(game: GameIterface) {
    const generatedGameID = generateGameID(game.game_id);
    this.shuffle();
    let players = this.deal(game.players);
    if (game.round_number === 0) {
      players = {
        ...this._reOrderPlayers(players),
      };
      // const firstPlayerByOrderNumber = this._getPlayerByOrderNumber(players, 1);
      // if (firstPlayerByOrderNumber) {
      //   // game.next_round_start_with = firstPlayerByOrderNumber.order_number!;
      //   game.player_turn = firstPlayerByOrderNumber.order_number!;
      // }
    }
    game.players = {
      ...players,
    };
    this._io.to(generatedGameID).emit(
      'shuffled',
      Object.keys(players).map((playerGeneratedID) => ({
        player_id: players[playerGeneratedID].player_id,
        cards: players[playerGeneratedID].cards,
        order_number: players[playerGeneratedID].order_number,
      }))
    );
    return game;
  }

  private _isGameExists(game_id: number, socket?: Socket) {
    const generatedGameID = generateGameID(game_id);
    if (!this.gameBoards || !(generatedGameID in this.gameBoards)) {
      if (socket) {
        socket.emit('error', 'Game does not exists.');
      }
      return false;
    }
    return this.gameBoards[generatedGameID];
  }

  onConnection = () => {
    this._io.on('connection', (socket) => {
      socket.on('save_details', (data: SaveDetailsRequestI) => {
        console.log('data', data);
        const generatedGameID = generateGameID(data.game_id);
        let game: GameIterface;
        if (data.watcher) {
          // get game
          if (!this._isGameExists(data.game_id, socket)) {
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
        } else {
          const isGameExists = this._isGameExists(data.game_id);
          if (!isGameExists) {
            game = this._generateGame(data);
          } else {
            game = isGameExists;
          }
        }
        socket.join(generatedGameID);

        if (data.show_cards !== undefined) {
          game.show_cards = data.show_cards;
        }
        if (game.watchers && Object.keys(game.watchers).length > 0) {
          this._io.to(generatedGameID).emit(
            'watchers_list',
            Object.keys(game.watchers).map(
              (watcherGeneratedID) => game.watchers[watcherGeneratedID]
            )
          );
        }

        const whole_state = {
          game_id: game.game_id,
          round_number: game.round_number,
          sequence_number: game.sequence_number,
          cards_on_table: game.cards_on_table,
          players: Object.keys(game.players).map(
            (playerKey) => game.players[playerKey]
          ),
        };

        socket.emit('whole_state', whole_state);

        this.gameBoards[generatedGameID] = {
          ...game,
        };
      });

      socket.on('shuffle', (data: { game_id: number }) => {
        let game = this._isGameExists(data.game_id, socket);
        if (!game) {
          return;
        }
        const generatedGameID = generateGameID(game.game_id);
        game = this._onShuffle(game);
        this.gameBoards[generatedGameID] = {
          ...game,
        };
      });

      socket.on(
        'game_type',
        (data: { game_id: number; game_type: GameType; player_id: number }) => {
          let game = this._isGameExists(data.game_id, socket);
          if (!game) {
            return;
          }
          const generatedGameID = generateGameID(data.game_id);
          const generatedPlayerID = generatePlayerID(data.player_id);
          if (!(generatedPlayerID in game.players)) {
            socket.emit('error', 'player does not exists');
            return;
          }
          const player = game.players[generatedPlayerID];
          if (data.game_type === 'complex' && player.isComplexCompleted) {
            socket.emit('error', 'player already completed complex');
            return;
          }
          if (data.game_type === 'trix' && player.isTrixCompleted) {
            socket.emit('error', 'player already completed trix');
            return;
          }
          game.game_type = data.game_type;
          this._io.to(generatedGameID).emit('player_selected_game_type', {
            player_id: player.player_id,
            game_type: game.game_type,
          });
          this.gameBoards[generatedGameID] = {
            ...game,
          };
        }
      );

      socket.on(
        'is_double',
        (data: {
          game_id: number;
          player_id: number;
          is_double: boolean;
          doubled_card_id: number;
        }) => {
          let game = this._isGameExists(data.game_id, socket);
          if (!game) {
            return;
          }
          const generatedGameID = generateGameID(game.game_id);
          const generatedPlayerID = generatePlayerID(data.player_id);
          if (!(generatedPlayerID in game.players)) {
            socket.emit('error', 'player does not exists');
            return;
          }
          const player = game.players[generatedPlayerID];
          if (data.is_double) {
            // if (!data.is_double) {
            //   return;
            // }
            let doubledCard: TblCards | undefined;
            if (!data.doubled_card_id) {
              socket.emit('error', 'provide card id');
              return;
            } else {
              doubledCard = this.cards.find(
                ({ cardId }) => cardId === data.doubled_card_id
              );
            }
            if (!doubledCard) {
              socket.emit('error', 'card is missing');
              return;
            }
            if (doubledCard.cardNo !== 11) {
              if (doubledCard.cardNo !== 12) {
                socket.emit('error', 'wrong card');
                return;
              } else if (
                doubledCard.cardType.cardTypeName !== CARD_TYPE_NAME.HEARTS
              ) {
                socket.emit('error', 'wrong card');
                return;
              }
            }
            if (!player.cards || player.cards.length < 13) {
              socket.emit('error', 'shuffle cards is not distributed yet.');
              return;
            }
            if (
              !player.cards.find(({ cardId }) => cardId === doubledCard?.cardId)
            ) {
              socket.emit(
                'error',
                'player does not have this card in the distributed deck.'
              );
              return;
            }
            // if (player.selectedGameType && player.selectedGameType === 'trix') {
            //   socket.emit('error', 'player selected game is trix');
            //   return;
            // }
            // if (player.isComplexCompleted) {
            //   socket.emit('error', 'player complex game is completed.');
            //   return;
            // }
            // complex
            if (game.sequence_number !== 0) {
              socket.emit('error', 'game is already in running state');
              return;
            }
            player.doubled_card = doubledCard;
            this._io.to(generatedGameID).emit('player_doubled_card', {
              player_id: player.player_id,
              doubled_card: player.doubled_card,
            });
          }
          player.is_double = data.is_double;
          game.players[generatedPlayerID] = {
            ...player,
          };
          this.gameBoards[generatedGameID] = {
            ...game,
          };
        }
      );

      socket.on('game_play_update', (data: GamePlayeUpdateI) => {
        const generatedGameID = generateGameID(data.game_id);
        let game = this.gameBoards[generatedGameID];
        game = this._manageCardsOnTable(game, data);
        this.gameBoards[generatedGameID] = {
          ...game,
        };
      });
    });
  };
}
