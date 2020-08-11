import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import BaseMethods from './shared/baseMethods';
import { Skill } from './Skill';
import { WorkExperience } from './WorkExperience';

@ObjectType()
@Entity()
export class WorkExperienceSkill extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  weID: string;

  @Field()
  @Column()
  skillID: string;

  async work_experience(weID: string | null = null): Promise<WorkExperience> {
    return BaseMethods.getRelationData(WorkExperience, weID ? weID : this.weID);
  }

  async skill(skillID: string | null = null): Promise<Skill> {
    return BaseMethods.getRelationData(Skill, skillID ? skillID : this.skillID);
  }
}
