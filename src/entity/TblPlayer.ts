import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblDeviceDetails } from "./TblDeviceDetails";
import { TblGames } from "./TblGames";
import { TblGamePlayTwo } from "./TblGamePlayTwo";

@Index("fkIdx_46", ["countryId"], {})
@Entity("tbl_player", { schema: "khawajat_db" })
export class TblPlayer {
  @PrimaryGeneratedColumn({ type: "int", name: "player_id" })
  playerId: number;

  @Column("varchar", { name: "first_name", nullable: true, length: 45 })
  firstName: string | null;

  @Column("varchar", { name: "last_name", nullable: true, length: 45 })
  lastName: string | null;

  @Column("varchar", { name: "username", nullable: true, length: 45 })
  username: string | null;

  @Column("varchar", { name: "photo_path", nullable: true, length: 45 })
  photoPath: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 45 })
  password: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 45 })
  email: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 45 })
  phone: string | null;

  @Column("datetime", {
    name: "creation_date_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  creationDateTime: Date | null;

  @Column("int", { name: "country_id", nullable: true })
  countryId: number | null;

  @Column("varchar", { name: "device_id", nullable: true, length: 255 })
  deviceId: string | null;

  @Column("int", { name: "profile_creation_channel", nullable: true })
  profileCreationChannel: number | null;

  @Column("varchar", { name: "gender", nullable: true, length: 255 })
  gender: string | null;

  @OneToMany(
    () => TblDeviceDetails,
    (tblDeviceDetails) => tblDeviceDetails.player
  )
  tblDeviceDetails: TblDeviceDetails[];

  @OneToMany(() => TblGames, (tblGames) => tblGames.createdBy2)
  tblGames: TblGames[];

  @OneToMany(() => TblGames, (tblGames) => tblGames.player)
  tblGames2: TblGames[];

  @OneToMany(() => TblGames, (tblGames) => tblGames.player2)
  tblGames3: TblGames[];

  @OneToMany(() => TblGames, (tblGames) => tblGames.player3)
  tblGames4: TblGames[];

  @OneToMany(() => TblGames, (tblGames) => tblGames.player4)
  tblGames5: TblGames[];

  @OneToMany(() => TblGamePlayTwo, (tblGamePlayTwo) => tblGamePlayTwo.player)
  tblGamePlayTwos: TblGamePlayTwo[];
}
