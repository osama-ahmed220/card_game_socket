import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  token: string;
}
