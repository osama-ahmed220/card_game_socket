import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("player_id", ["playerId"], {})
@Index("game_iddd", ["gameId"], {})
@Entity("tbl_game_chat", { schema: "khawajat_db" })
export class TblGameChat {
  @PrimaryGeneratedColumn({ type: "int", name: "game_chat_id" })
  gameChatId: number;

  @Column("int", { name: "chat_type", nullable: true })
  chatType: number | null;

  @Column("varchar", { name: "chat_content", nullable: true, length: 45 })
  chatContent: string | null;

  @Column("datetime", {
    name: "chate_date_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  chateDateTime: Date | null;

  @Column("int", { name: "player_id", nullable: true })
  playerId: number | null;

  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;
}
