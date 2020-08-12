import { Column, Entity, Index } from "typeorm";

@Index("fkIdx_67", ["gameTypeId"], {})
@Entity("tbl_game_sub_type", { schema: "khawajat_db" })
export class TblGameSubType {
  @Column("int", { primary: true, name: "game_sub_type_id" })
  gameSubTypeId: number;

  @Column("varchar", {
    name: "game_sub_type_name_en",
    nullable: true,
    length: 45,
  })
  gameSubTypeNameEn: string | null;

  @Column("varchar", {
    name: "game_sub_type_name_ar",
    nullable: true,
    length: 45,
  })
  gameSubTypeNameAr: string | null;

  @Column("int", { name: "game_type_id", nullable: true })
  gameTypeId: number | null;
}
