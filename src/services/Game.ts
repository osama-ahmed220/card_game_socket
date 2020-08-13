import { PlayerInterface } from "./Player";
import { UserInterface } from "./User";
import { WatcherInterface } from "./Watcher";

export interface GameIterface {
  game_id: string;
  sequence_number: number;
  round_number: number;
  players: { [key: string]: PlayerInterface };
  watchers: { [key: string]: WatcherInterface };
}

export default class Game implements GameIterface {
  private _game_id: string;
  private _sequence_number: number;
  private _round_number: number;
  private _players: { [key: string]: PlayerInterface };
  private _watchers: { [key: string]: WatcherInterface };

  get game_id() {
    return this._game_id;
  }

  set game_id(game_id: string) {
    this._game_id = game_id;
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

  set players(players: { [key: string]: PlayerInterface }) {
    this._players = players;
  }

  get watchers() {
    return this._watchers;
  }

  set watchers(watchers: { [key: string]: WatcherInterface }) {
    this._watchers = watchers;
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
