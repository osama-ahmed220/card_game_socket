import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import BaseMethods from './shared/baseMethods';
import { Skill } from './Skill';
import { Stack } from './Stack';

@Entity()
export class StackSkill extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  stackID: string;

  @Column()
  skillID: string;

  async stack(stackID: string | null = null): Promise<Stack> {
    return BaseMethods.getRelationData(Stack, stackID ? stackID : this.stackID);
  }

  async skill(skillID: string | null = null): Promise<Skill | null> {
    return BaseMethods.getRelationData(Skill, skillID ? skillID : this.skillID);
  }
}
