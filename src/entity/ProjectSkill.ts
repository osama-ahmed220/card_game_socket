import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Project } from './Project';
import BaseMethods from './shared/baseMethods';
import { Skill } from './Skill';

@ObjectType()
@Entity()
export class ProjectSkill extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  projectID: string;

  @Field()
  @Column()
  skillID: string;

  async project(projectID: string | null = null): Promise<Project> {
    return BaseMethods.getRelationData(
      Project,
      projectID ? projectID : this.projectID
    );
  }

  async skill(skillID: string | null = null): Promise<Skill> {
    return BaseMethods.getRelationData(Skill, skillID ? skillID : this.skillID);
  }
}
