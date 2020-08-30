export interface UserInterface {
  socket_id?: string;
  player_id: number;
  player_name: string;
}

export default class User implements UserInterface {
  socket_id: string;
  player_id: number;
  player_name: string;
}
