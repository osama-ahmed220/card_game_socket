import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Skill } from '../../entity/Skill';
import { Stack } from '../../entity/Stack';
import { StackSkill } from '../../entity/StackSkill';
import createBaseResolver from '../shared/createBaseResolver';
import { SkillResolver } from '../skill/skill.resolver';
import { StackResolver } from '../stack/stack.resolver';
import { CreateStackSkillInput, UpdateStackSkillInput } from './Inputs';

const BaseResolver = createBaseResolver<
  StackSkill,
  CreateStackSkillInput,
  UpdateStackSkillInput
>({
  suffix: 'StackSkill',
  entityType: StackSkill,
  inputTypes: {
    create: {
      type: CreateStackSkillInput,
    },
    update: {
      type: UpdateStackSkillInput,
    },
  },
});
@Resolver(StackSkill)
export class StackSkillResolver extends BaseResolver {
  @FieldResolver()
  async skill(@Root() { skillID }: StackSkill): Promise<Skill | null> {
    const skill = await new SkillResolver().get(skillID);
    if (!skill) return null;
    return skill;
  }

  @FieldResolver()
  async stack(@Root() { stackID }: StackSkill): Promise<Stack | null> {
    const stack = await new StackResolver().get(stackID);
    if (!stack) return null;
    return stack;
  }
}
