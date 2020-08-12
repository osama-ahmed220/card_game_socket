import { Column, Entity, OneToMany } from "typeorm";
import { TblGames } from "./TblGames";

@Entity("tbl_game_type", { schema: "khawajat_db" })
export class TblGameType {
  @Column("int", { primary: true, name: "game_type_id" })
  gameTypeId: number;

  @Column("varchar", { name: "game_type_name_en", nullable: true, length: 45 })
  gameTypeNameEn: string | null;

  @Column("varchar", { name: "game_type_name_ar", nullable: true, length: 45 })
  gameTypeNameAr: string | null;

  @OneToMany(() => TblGames, (tblGames) => tblGames.gameType)
  tblGames: TblGames[];
}
