import { Column, Entity } from "typeorm";

@Entity("tbl_emoji", { schema: "khawajat_db" })
export class TblEmoji {
  @Column("varchar", { name: "emojoi_path", length: 45 })
  emojoiPath: string;

  @Column("int", { primary: true, name: "emoji_id" })
  emojiId: number;
}
