import { Column, Entity, Index } from "typeorm";

@Index("FK_game_id", ["gameId"], {})
@Entity("tbl_shuffled_cards", { schema: "khawajat_db" })
export class TblShuffledCards {
  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("int", { name: "round_id" })
  roundId: number;

  @Column("datetime", {
    name: "creation_date_time",
    default: () => "CURRENT_TIMESTAMP",
  })
  creationDateTime: Date;

  @Column("text", { name: "player1_cards" })
  player1Cards: string;

  @Column("text", { name: "player2_cards" })
  player2Cards: string;

  @Column("text", { name: "player3_cards" })
  player3Cards: string;

  @Column("text", { name: "player4_cards" })
  player4Cards: string;
}
