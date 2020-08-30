import { PlayersType } from './Player';
import { UserInterface } from './User';
import { WatchersType } from './Watcher';

export enum GAME_TYPE {
  COMPLEX,
  TRIX,
}

export type GameType = 'trix' | 'complex';

export enum SHOW_CARDS_ENUM {
  ALL = 0,
  ONE = 1,
  NONE = 2,
}

interface RoundAndSequenceInterface {
  card_id: number;
  player_id: number;
}

type RoundAndSequenceType = RoundAndSequenceInterface[][][];

export interface CardsOnTableI {
  sequence_number: number;
  player_id: number;
  card_id: number;
}

export interface GameIterface {
  socket_id: string;
  game_id: number;
  owner_id: number;
  owner_name: string;
  game_type: GameType;
  show_cards: SHOW_CARDS_ENUM;
  sequence_number: number;
  round_number: number;
  players: PlayersType;
  watchers: WatchersType;
  roundAndSequence: RoundAndSequenceType;
  player_turn: number;
  next_round_start_with: number;
  cards_on_table: CardsOnTableI[];
  sequence_cards: CardsOnTableI[][];
}

// const roundData = [
//   [
//     // 4 round
//     [
//       // 13 sequence
//       {
//         card_id: 1,
//         player_id: 1,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//     ],
//     [
//       {
//         card_id: 1,
//         player_id: 1,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//     ],
//     [
//       {
//         card_id: 1,
//         player_id: 1,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//     ],
//     [
//       {
//         card_id: 1,
//         player_id: 1,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//       {
//         card_id: 38,
//         player_id: 2,
//       },
//     ],
//   ],
// ];

export default class Game implements GameIterface {
  socket_id: string;
  game_id: number;
  owner_id: number;
  owner_name: string;
  game_type: GameType;
  show_cards: SHOW_CARDS_ENUM = SHOW_CARDS_ENUM.NONE;
  sequence_number: number = 0;
  round_number: number = 0;
  players: PlayersType = {};
  watchers: WatchersType = {};
  roundAndSequence: RoundAndSequenceType = [];
  player_turn: number = 1;
  next_round_start_with: number = 1;
  cards_on_table: CardsOnTableI[] = [];
  sequence_cards: CardsOnTableI[][] = [];

  addUser(isWatcher: boolean, gameData: GameIterface, user: UserInterface) {
    if (isWatcher) {
      gameData.watchers = {
        ...gameData.watchers,
        [user.player_id]: user,
      };
    } else {
      if (Object.keys(gameData.players).length < 4) {
        gameData.players = {
          ...gameData.players,
          [user.player_id]: user,
        };
      }
    }
    return gameData;
  }

  removeUser(gameData: GameIterface, socketID: string) {
    const clientList = {
      ...gameData.players,
      ...gameData.watchers,
    };
    for (let i = 0; i < Object.keys(clientList).length; i++) {
      const clientID = Object.keys(clientList)[i];
      if (clientID in gameData.players || clientID in gameData.watchers) {
        if (
          gameData.players[clientID] &&
          socketID === gameData.players[clientID].socket_id
        ) {
          delete gameData.players[clientID];
          break;
        }
        if (
          gameData.watchers[clientID] &&
          socketID === gameData.watchers[clientID].socket_id
        ) {
          delete gameData.watchers[clientID];
          break;
        }
      }
    }
    return gameData;
  }
}
