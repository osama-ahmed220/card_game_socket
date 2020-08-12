import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("fkIdx_59", ["playerId"], {})
@Index("fkIdx_70", ["gameSubTypeId"], {})
@Index("game_idddd", ["gameId"], {})
@Entity("tbl_game_round", { schema: "khawajat_db" })
export class TblGameRound {
  @PrimaryGeneratedColumn({ type: "int", name: "game_round_id" })
  gameRoundId: number;

  @Column("int", { name: "round_seq", nullable: true })
  roundSeq: number | null;

  @Column("int", { name: "player_id", nullable: true })
  playerId: number | null;

  @Column("int", { name: "game_sub_type_id", nullable: true })
  gameSubTypeId: number | null;

  @Column("datetime", {
    name: "round_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  roundTime: Date | null;

  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;
}
