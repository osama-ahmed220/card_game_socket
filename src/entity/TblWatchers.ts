import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("fkIdx_143", ["gameId"], {})
@Index("watcherId", ["watcherId"], {})
@Entity("tbl_watchers", { schema: "khawajat_db" })
export class TblWatchers {
  @PrimaryGeneratedColumn({ type: "int", name: "watchers_id" })
  watchersID: number;
  
  @Column("int", { name: "watcher_id" })
  watcherId: number;

  @Column("datetime", {
    name: "start_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  startTime: Date | null;

  @Column("datetime", {
    name: "end_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  endTime: Date | null;

  @Column("int", { name: "game_id", nullable: true })
  gameId: number | null;
}
