import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TblPlayer } from "./TblPlayer";

@Index("playerIddd", ["playerId"], {})
@Entity("tbl_device_details", { schema: "khawajat_db" })
export class TblDeviceDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "device_details_id" })
  deviceDetailsID: number;

  @Column("varchar", { name: "device_id", length: 255 })
  deviceId: string;

  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("int", { name: "remember_me_status" })
  rememberMeStatus: number;

  @ManyToOne(() => TblPlayer, (tblPlayer) => tblPlayer.tblDeviceDetails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "player_id", referencedColumnName: "playerId" }])
  player: TblPlayer;
}
