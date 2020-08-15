import { PlayersType } from './Player';
import { UserInterface } from './User';
import { WatchersType } from './Watcher';

export enum GAME_TYPE {
  COMPLEX,
  TRIX,
}

export enum SHOW_CARDS_ENUM {
  ALL,
  ONE,
  NONE,
}

interface RoundAndSequenceInterface {
  card_id: number;
  player_id: number;
}

type RoundAndSequenceType = RoundAndSequenceInterface[][][];

export interface GameIterface {
  socket_id: string;
  game_id: number;
  owner_id: number;
  owner_name: string;
  game_type: GAME_TYPE;
  show_cards: SHOW_CARDS_ENUM;
  sequence_number: number;
  round_number: number;
  players: PlayersType;
  watchers: WatchersType;
  roundAndSequence: RoundAndSequenceType;
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
  private _socket_id: string;
  private _game_id: number;
  private _owner_id: number;
  private _owner_name: string;
  private _game_type: GAME_TYPE = GAME_TYPE.COMPLEX;
  private _show_cards: SHOW_CARDS_ENUM = SHOW_CARDS_ENUM.NONE;
  private _sequence_number: number = 1;
  private _round_number: number = 1;
  private _players: PlayersType;
  private _watchers: WatchersType;
  private _roundAndSequence: RoundAndSequenceType = [];

  get socket_id() {
    return this._socket_id;
  }

  set socket_id(socket_id: string) {
    this._socket_id = socket_id;
  }

  get game_id() {
    return this._game_id;
  }

  set game_id(game_id: number) {
    this._game_id = game_id;
  }

  get owner_id() {
    return this._owner_id;
  }

  set owner_id(owner_id: number) {
    this._owner_id = owner_id;
  }

  get owner_name() {
    return this._owner_name;
  }

  set owner_name(owner_name: string) {
    this._owner_name = owner_name;
  }

  get game_type() {
    return this._game_type;
  }

  set game_type(game_type: GAME_TYPE) {
    this._game_type = game_type;
  }

  get show_cards() {
    return this._show_cards;
  }

  set show_cards(show_cards: SHOW_CARDS_ENUM) {
    this._show_cards = show_cards;
  }

  get sequence_number() {
    return this._sequence_number;
  }

  set sequence_number(sequence_number: number) {
    this._sequence_number = sequence_number;
  }

  get round_number() {
    return this._round_number;
  }

  set round_number(round_number: number) {
    this._round_number = round_number;
  }

  get players() {
    return this._players;
  }

  set players(players: PlayersType) {
    this._players = players;
  }

  get watchers() {
    return this._watchers;
  }

  set watchers(watchers: WatchersType) {
    this._watchers = watchers;
  }

  get roundAndSequence() {
    return this._roundAndSequence;
  }

  set roundAndSequence(roundAndSequence: RoundAndSequenceType) {
    this._roundAndSequence = roundAndSequence;
  }

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
