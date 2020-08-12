import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tbl_player_friends", { schema: "khawajat_db" })
export class TblPlayerFriends {
  @PrimaryGeneratedColumn({ type: "int", name: "player_friends_id" })
  playerFreidnsID: number;

  @Column("int", { name: "player_id", nullable: true })
  playerId: number | null;

  @Column("int", { name: "friend_id", nullable: true })
  friendId: number | null;

  @Column("int", { name: "acceptance_status", nullable: true })
  acceptanceStatus: number | null;

  @Column("datetime", { name: "add_time", default: () => "CURRENT_TIMESTAMP" })
  addTime: Date;
}
