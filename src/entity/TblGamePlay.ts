import { Column, Entity } from "typeorm";

@Entity("tbl_game_play", { schema: "khawajat_db" })
export class TblGamePlay {
  @Column("int", { primary: true, name: "game_play_seq" })
  gamePlaySeq: number;

  @Column("int", { primary: true, name: "game_round_id" })
  gameRoundId: number;

  @Column("int", { name: "player_1_id", nullable: true })
  player_1Id: number | null;

  @Column("int", { name: "player_1_played_card_id", nullable: true })
  player_1PlayedCardId: number | null;

  @Column("datetime", { name: "player_1_played_card_time", nullable: true })
  player_1PlayedCardTime: Date | null;

  @Column("int", { name: "player_2_id", nullable: true })
  player_2Id: number | null;

  @Column("int", { name: "player_2_played_card_id", nullable: true })
  player_2PlayedCardId: number | null;

  @Column("datetime", { name: "player_2_played_card_time", nullable: true })
  player_2PlayedCardTime: Date | null;

  @Column("int", { name: "player_3_id", nullable: true })
  player_3Id: number | null;

  @Column("int", { name: "player_3_played_card_id", nullable: true })
  player_3PlayedCardId: number | null;

  @Column("datetime", { name: "player_3_played_card_time", nullable: true })
  player_3PlayedCardTime: Date | null;

  @Column("int", { name: "player_4_id", nullable: true })
  player_4Id: number | null;

  @Column("int", { name: "player_4_played_card_id", nullable: true })
  player_4PlayedCardId: number | null;

  @Column("datetime", { name: "player_4_played_card_time", nullable: true })
  player_4PlayedCardTime: Date | null;

  @Column("int", { name: "player_1_current_score", nullable: true })
  player_1CurrentScore: number | null;

  @Column("int", { name: "player_2_current_score", nullable: true })
  player_2CurrentScore: number | null;

  @Column("int", { name: "player_3_current_score", nullable: true })
  player_3CurrentScore: number | null;

  @Column("int", { name: "player_4_current_score", nullable: true })
  player_4CurrentScore: number | null;
}
