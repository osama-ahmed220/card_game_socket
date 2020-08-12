import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("fkIdx_89", ["cardId"], {})
@Index("p_id", ["playerId"], {})
@Entity("tbl_game_round_player_cards", { schema: "khawajat_db" })
export class TblGameRoundPlayerCards {
  @PrimaryGeneratedColumn({ type: "int", name: "game_round_p_c_id" })
  gameRoundPCId: number;

  @Column("int", { name: "card_id", nullable: true })
  cardId: number | null;

  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("int", { name: "game_round_id" })
  gameRoundId: number;

  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;
}
