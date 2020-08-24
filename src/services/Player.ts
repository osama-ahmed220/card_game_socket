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
  private _cards: TblCards[];
  private _order_number: number;
  private _total_score: number = 0;
  private _sequence_score: number = 0;
  private _is_double: boolean = false;
  private _doubled_card: TblCards;
  private _isTrixCompleted: boolean = false;
  private _isComplexCompleted: boolean = false;

  get cards() {
    return this._cards;
  }

  set cards(cards: TblCards[]) {
    this._cards = cards;
  }

  get order_number() {
    return this._order_number;
  }

  set order_number(order_number: number) {
    this._order_number = order_number;
  }

  get total_score() {
    return this._total_score;
  }

  set total_score(total_score: number) {
    this._total_score = total_score;
  }

  get sequence_score() {
    return this._sequence_score;
  }

  set sequence_score(sequence_score: number) {
    this._sequence_score = sequence_score;
  }

  get is_double() {
    return this._is_double;
  }

  set is_double(is_double: boolean) {
    this._is_double = is_double;
  }

  get doubled_card() {
    return this._doubled_card;
  }

  set doubled_card(doubled_card: TblCards) {
    this._doubled_card = doubled_card;
  }

  get isTrixCompleted() {
    return this._isTrixCompleted;
  }

  set isTrixCompleted(isTrixCompleted: boolean) {
    this._isTrixCompleted = isTrixCompleted;
  }

  get isComplexCompleted() {
    return this._isComplexCompleted;
  }

  set isComplexCompleted(isComplexCompleted: boolean) {
    this._isComplexCompleted = isComplexCompleted;
  }
}
