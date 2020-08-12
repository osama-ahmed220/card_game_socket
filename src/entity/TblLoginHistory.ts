import { Column, Entity, Index } from "typeorm";

@Index("p_idd", ["playerId"], {})
@Entity("tbl_login_history", { schema: "khawajat_db" })
export class TblLoginHistory {
  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("varchar", { name: "device_id", length: 255 })
  deviceId: string;

  @Column("int", { name: "activity_status" })
  activityStatus: number;

  @Column("datetime", {
    name: "time_status",
    default: () => "CURRENT_TIMESTAMP",
  })
  timeStatus: Date;

  @Column("int", { name: "device_type", nullable: true })
  deviceType: number | null;
}
