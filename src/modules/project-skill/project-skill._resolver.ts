import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Project } from '../../entity/Project';
import { ProjectSkill } from '../../entity/ProjectSkill';
import { Skill } from '../../entity/Skill';
import { ProjectResolver } from '../project/project.resolver';
import createBaseResolver from '../shared/createBaseResolver';
import { SkillResolver } from '../skill/skill.resolver';
import { CreateProjectSkillInput, UpdateProjectSkillInput } from './Inputs';

const BaseResolver = createBaseResolver<
  ProjectSkill,
  CreateProjectSkillInput,
  UpdateProjectSkillInput
>({
  suffix: 'ProjectSkill',
  entityType: ProjectSkill,
  inputTypes: {
    create: {
      type: CreateProjectSkillInput,
    },
    update: {
      type: UpdateProjectSkillInput,
    },
  },
});

@Resolver(ProjectSkill)
export class ProjectSkillResolver extends BaseResolver {
  @FieldResolver()
  async skill(@Root() { skillID }: ProjectSkill): Promise<Skill | null> {
    const skill = await new SkillResolver().get(skillID);
    if (!skill) return null;
    return skill;
  }

  @FieldResolver()
  async project(@Root() { projectID }: ProjectSkill): Promise<Project | null> {
    const project = await new ProjectResolver().get(projectID);
    if (!project) return null;
    return project;
  }
}
