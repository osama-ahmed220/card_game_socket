import { Column, Entity, OneToMany } from "typeorm";
import { TblCards } from "./TblCards";

@Entity("tbl_card_type", { schema: "khawajat_db" })
export class TblCardType {
  @Column("varchar", { name: "card_type_name", nullable: true, length: 11 })
  cardTypeName: string | null;

  @Column("int", { primary: true, name: "card_type_id" })
  cardTypeId: number;

  @OneToMany(() => TblCards, (tblCards) => tblCards.cardType)
  tblCards: TblCards[];
}
