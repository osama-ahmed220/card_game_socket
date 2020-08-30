import { TblCards } from '../entity/TblCards';
import User, { UserInterface } from './User';

export interface PlayerInterface extends UserInterface {
  cards?: TblCards[];
  order_number?: number;
  total_score?: number;
  sequence_score?: number;
  is_double?: boolean;
  doubled_card?: TblCards;
  isTrixCompleted?: boolean;
  isComplexCompleted?: boolean;
}

export type PlayersType = { [key: string]: PlayerInterface };

export default class Player extends User implements PlayerInterface {
  cards: TblCards[];
  order_number: number;
  total_score: number = 0;
  sequence_score: number = 0;
  is_double: boolean = false;
  doubled_card: TblCards;
  isTrixCompleted: boolean = false;
  isComplexCompleted: boolean = false;
}
