import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Project } from '../../entity/Project';
import { ProjectSkill } from '../../entity/ProjectSkill';
import { Skill } from '../../entity/Skill';
import { Stack } from '../../entity/Stack';
import { StackSkill } from '../../entity/StackSkill';
import createBaseResolver from '../shared/createBaseResolver';
import { CreateSkillInput, UpdateSkillInput } from './Inputs';

const BaseResolver = createBaseResolver<
  Skill,
  CreateSkillInput,
  UpdateSkillInput
>({
  suffix: 'Skill',
  entityType: Skill,
  inputTypes: {
    create: {
      type: CreateSkillInput,
    },
    update: {
      type: UpdateSkillInput,
    },
  },
});

@Resolver(Skill)
export class SkillResolver extends BaseResolver {
  @FieldResolver()
  async stacks(@Root() { id }: Skill): Promise<Stack[]> {
    return this.setUpRelation<Stack, StackSkill>({
      relationEntityType: StackSkill,
      where: {
        skillID: id.toString(),
      },
      executeMethod: async (stackSkill) => stackSkill.stack(),
    });
  }

  @FieldResolver()
  async projects(@Root() { id }: Skill): Promise<Project[]> {
    return this.setUpRelation<Project, ProjectSkill>({
      relationEntityType: ProjectSkill,
      where: {
        skillID: id.toString(),
      },
      executeMethod: async (ps) => ps.project(),
    });
  }

  @Query(() => [Skill])
  async getMainSkills(
    @Arg('isMain', () => Boolean, { nullable: true }) isMain: boolean = true
  ): Promise<Skill[]> {
    return Skill.find({ where: { isMain } });
  }

  @Query(() => [Skill])
  async getCategorySkills(): Promise<Skill[]> {
    return Skill.find({ where: { isCategory: true } });
  }
}
