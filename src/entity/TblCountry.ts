import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tbl_country", { schema: "khawajat_db" })
export class TblCountry {
  @Column("varchar", { name: "country_name_en", length: 45 })
  countryNameEn: string;

  @PrimaryGeneratedColumn({ type: "int", name: "country_id" })
  countryId: number;

  @Column("varchar", { name: "country_name_ar", length: 45 })
  countryNameAr: string;
}
