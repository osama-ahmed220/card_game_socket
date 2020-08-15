export interface UserInterface {
  socket_id?: string;
  player_id: number;
  player_name: string;
}

export default class User implements UserInterface {
  private _socket_id: string;
  private _player_id: number;
  private _player_name: string;

  get socket_id() {
    return this._socket_id;
  }

  set socket_id(socket_id: string) {
    this._socket_id = socket_id;
  }

  get player_id() {
    return this._player_id;
  }

  set player_id(player_id: number) {
    this._player_id = player_id;
  }

  get player_name() {
    return this._player_name;
  }

  set player_name(player_name: string) {
    this._player_name = player_name;
  }
}
