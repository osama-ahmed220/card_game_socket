import { FieldResolver, Resolver, Root } from 'type-graphql';
import { WorkExperience } from '../../entity/WorkExperience';
// import { StackSkill } from "../../entity/stack-skill";
// import { Skill } from "../../entity/skill";
// import { SkillResolver } from "../skill/skill.resolver";
import { WorkExperienceSkill } from '../../entity/WorkExperience-skill';
import createBaseResolver from '../shared/createBaseResolver';
import { WorkExperienceResolver } from '../work-experience/work-experience.resolver';
import {
  CreateWorkExperienceSkillInput,
  UpdateWorkExperienceSkillInput,
} from './Inputs';

const BaseResolver = createBaseResolver<
  WorkExperienceSkill,
  CreateWorkExperienceSkillInput,
  UpdateWorkExperienceSkillInput
>({
  suffix: 'WorkExperienceSkill',
  entityType: WorkExperienceSkill,
  inputTypes: {
    create: {
      type: CreateWorkExperienceSkillInput,
    },
    update: {
      type: UpdateWorkExperienceSkillInput,
    },
  },
});

@Resolver(WorkExperienceSkill)
export class WorkExperienceSkillResolver extends BaseResolver {
  // @FieldResolver()
  // async skill(@Root() { skillID }: StackSkill): Promise<Skill> {
  //   return new SkillResolver().get(skillID);
  // }

  @FieldResolver()
  async work_experience(
    @Root() { weID }: WorkExperienceSkill
  ): Promise<WorkExperience | null> {
    const workExperience = await new WorkExperienceResolver().get(weID);
    if (!workExperience) return null;
    return workExperience;
  }
}
