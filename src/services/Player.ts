import { TblCards } from "../entity/TblCards";
import User, { UserInterface } from "./User";

export interface PlayerInterface extends UserInterface {
    cards: TblCards[];
    order: number;
    total_score: number;
    sequence_score: number;
}

export default class Player extends User implements PlayerInterface {
    private _cards: TblCards[];
    private _order: number;
    private _total_score: number;
    private _sequence_score: number;

    get cards() {
        return this._cards;
    }

    set cards(cards: TblCards[]) {
        this._cards = cards;
    }

    get order() {
        return this._order;
    }

    set order(order: number) {
        this._order = order;
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
}