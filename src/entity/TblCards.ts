import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TblCardType } from "./TblCardType";

@Index("fkIdx_86", ["cardTypeId"], {})
@Entity("tbl_cards", { schema: "khawajat_db" })
export class TblCards {
  @Column("int", { primary: true, name: "card_id" })
  cardId: number;

  @Column("int", { name: "card_no", nullable: true })
  cardNo: number | null;

  @Column("int", { name: "card_type_id", nullable: true })
  cardTypeId: number | null;

  @ManyToOne(() => TblCardType, (tblCardType) => tblCardType.tblCards, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "card_type_id", referencedColumnName: "cardTypeId" }])
  cardType: TblCardType;
}
