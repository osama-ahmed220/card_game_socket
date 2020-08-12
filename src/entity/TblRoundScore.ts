import { Column, Entity } from "typeorm";

@Entity("tbl_round_score", { schema: "khawajat_db" })
export class TblRoundScore {
  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;

  @Column("int", { name: "round_seq", nullable: true })
  roundSeq: number | null;

  @Column("int", { name: "game_play_sequence", nullable: true })
  gamePlaySequence: number | null;

  @Column("datetime", {
    name: "play_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  playTime: Date | null;

  @Column("int", { name: "player1_score" })
  player1Score: number;

  @Column("int", { name: "player2_score" })
  player2Score: number;

  @Column("int", { name: "player3_score" })
  player3Score: number;

  @Column("int", { name: "player4_score" })
  player4Score: number;
}
