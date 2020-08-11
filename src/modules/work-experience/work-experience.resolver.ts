import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Company } from '../../entity/Company';
import { Project } from '../../entity/Project';
import { Skill } from '../../entity/Skill';
import { WorkExperience } from '../../entity/WorkExperience';
import { WorkExperienceSkill } from '../../entity/WorkExperience-skill';
import createBaseResolver from '../shared/createBaseResolver';
import { CreateWorkExperienceInput, UpdateWorkExperienceInput } from './Inputs';

const BaseResolver = createBaseResolver<
  WorkExperience,
  CreateWorkExperienceInput,
  UpdateWorkExperienceInput
>({
  suffix: 'WorkExperience',
  entityType: WorkExperience,
  inputTypes: {
    create: {
      type: CreateWorkExperienceInput,
    },
    update: {
      type: UpdateWorkExperienceInput,
    },
  },
});

@Resolver(WorkExperience)
export class WorkExperienceResolver extends BaseResolver {
  @FieldResolver()
  async company(
    @Root() { companyID }: WorkExperience
  ): Promise<Company | undefined> {
    return Company.findOne(companyID);
  }

  @FieldResolver()
  async projects(@Root() { id }: WorkExperience): Promise<Project[]> {
    return Project.find({ where: { weID: id.toString() } });
  }

  @FieldResolver()
  async skills(@Root() { id }: WorkExperience): Promise<Skill[]> {
    return this.setUpRelation<Skill, WorkExperienceSkill>({
      relationEntityType: WorkExperienceSkill,
      where: {
        weID: id.toString(),
      },
      executeMethod: async (wes) => wes.skill(),
    });
  }

  // @Mutation(() => WorkExperience)
  // async assignWorkExperienceSkills(
  //   @Arg('data', () => AssignWorkExperienceSkillsInput)
  //   { skillIDs, weID }: AssignWorkExperienceSkillsInput
  // ): Promise<WorkExperience> {
  //   return this.assignRelationData<WorkExperience>(weID, skillIDs, {
  //     rEntity: WorkExperienceSkill,
  //     where: {
  //       weID,
  //       skillID: { $in: [...skillIDs] },
  //     },
  //     propertyName: 'skillID',
  //     basePropertyName: 'weID',
  //   });
  // }

  // @Mutation(() => [WorkExperience])
  // async assignWorkExperiencesSkills(
  //   @Arg('data', () => [AssignWorkExperienceSkillsInput])
  //   data: AssignWorkExperienceSkillsInput[]
  // ): Promise<WorkExperience[]> {
  //   return Promise.all(data.map((sd) => this.assignWorkExperienceSkills(sd)));
  // }
}
