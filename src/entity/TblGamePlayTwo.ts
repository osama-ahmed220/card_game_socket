import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TblGames } from "./TblGames";
import { TblPlayer } from "./TblPlayer";

@Index("pidd", ["playerId"], {})
@Index("gidd", ["gameId"], {})
@Entity("tbl_game_play_two", { schema: "khawajat_db" })
export class TblGamePlayTwo {
  @Column("int", { name: "game_play_sequence" })
  gamePlaySequence: number;

  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("int", { name: "player_card" })
  playerCard: number;

  @Column("datetime", {
    name: "time_played",
    default: () => "CURRENT_TIMESTAMP",
  })
  timePlayed: Date;

  @Column("int", { name: "player_score", nullable: true })
  playerScore: number | null;

  @Column("int", { name: "round_seq", nullable: true })
  roundSeq: number | null;

  @ManyToOne(() => TblGames, (tblGames) => tblGames.tblGamePlayTwos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "game_id", referencedColumnName: "gameId" }])
  game: TblGames;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblGamePlayTwos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "player_id", referencedColumnName: "playerId" }])
  player: TblPlayer;
}
