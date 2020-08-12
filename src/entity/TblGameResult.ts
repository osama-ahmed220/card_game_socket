import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("fkIdx_130", ["gameId"], {})
@Entity("tbl_game_result", { schema: "khawajat_db" })
export class TblGameResult {
  @PrimaryGeneratedColumn({ type: "int", name: "game_result_id" })
  gameResultID: number;
  
  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;

  @Column("int", { name: "player_1_final_score", nullable: true })
  player_1FinalScore: number | null;

  @Column("int", { name: "player_2_final_score", nullable: true })
  player_2FinalScore: number | null;

  @Column("int", { name: "player_3_final_score", nullable: true })
  player_3FinalScore: number | null;

  @Column("int", { name: "player_4_final_score", nullable: true })
  player_4FinalScore: number | null;
}
