import { Column, Entity } from "typeorm";

@Entity("tkt_card_double", { schema: "khawajat_db" })
export class TktCardDouble {
  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("int", { name: "round_id" })
  roundId: number;

  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("int", { name: "card_id" })
  cardId: number;
}
