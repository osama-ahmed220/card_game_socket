import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblGameType } from "./TblGameType";
import { TblPlayer } from "./TblPlayer";
import { TblGamePlayTwo } from "./TblGamePlayTwo";

@Index("fkIdx_51", ["gameTypeId"], {})
@Index("pidone", ["player1Id"], {})
@Index("pidtwo", ["player2Id"], {})
@Index("pidthree", ["player3Id"], {})
@Index("pid4", ["player4Id"], {})
@Index("createdBy", ["createdBy"], {})
@Entity("tbl_games", { schema: "khawajat_db" })
export class TblGames {
  @PrimaryGeneratedColumn({ type: "int", name: "game_id" })
  gameId: number;

  @Column("varchar", { name: "game_name", nullable: true, length: 45 })
  gameName: string | null;

  @Column("datetime", {
    name: "creation_date_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  creationDateTime: Date | null;

  @Column("int", { name: "player1_id", nullable: true })
  player1Id: number | null;

  @Column("int", { name: "player2_id", nullable: true })
  player2Id: number | null;

  @Column("int", { name: "player3_id", nullable: true })
  player3Id: number | null;

  @Column("int", { name: "player4_id", nullable: true })
  player4Id: number | null;

  @Column("int", { name: "game_type_id", nullable: true })
  gameTypeId: number | null;

  @Column("int", { name: "created_by", nullable: true })
  createdBy: number | null;

  @Column("int", { name: "chat_enable", nullable: true })
  chatEnable: number | null;

  @Column("int", { name: "private_game", nullable: true })
  privateGame: number | null;

  @Column("int", { name: "player1_device_status", nullable: true })
  player1DeviceStatus: number | null;

  @Column("int", { name: "player2_device_status", nullable: true })
  player2DeviceStatus: number | null;

  @Column("int", { name: "player3_device_status", nullable: true })
  player3DeviceStatus: number | null;

  @Column("int", { name: "player4_device_status", nullable: true })
  player4DeviceStatus: number | null;

  @Column("int", { name: "allow_online_game", nullable: true })
  allowOnlineGame: number | null;

  @ManyToOne(() => TblGameType, (tblGameType) => tblGameType.tblGames, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "game_type_id", referencedColumnName: "gameTypeId" }])
  gameType: TblGameType;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblGames, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "playerId" }])
  createdBy2: TblPlayer;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblGames2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "player4_id", referencedColumnName: "playerId" }])
  player: TblPlayer;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblGames3, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "player1_id", referencedColumnName: "playerId" }])
  player2: TblPlayer;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblGames4, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "player3_id", referencedColumnName: "playerId" }])
  player3: TblPlayer;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblGames5, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "player2_id", referencedColumnName: "playerId" }])
  player4: TblPlayer;

  @OneToMany(() => TblGamePlayTwo, (tblGamePlayTwo) => tblGamePlayTwo.game)
  tblGamePlayTwos: TblGamePlayTwo[];
}
