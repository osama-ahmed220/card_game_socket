import * as fs from 'fs';
import { join } from 'path';
import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Project } from '../../entity/Project';
import { ProjectSkill } from '../../entity/ProjectSkill';
import { Skill } from '../../entity/Skill';
import { WorkExperience } from '../../entity/WorkExperience';
import uploadFile from '../../utils/uploadFile';
import createBaseResolver from '../shared/createBaseResolver';
import { SkillResolver } from '../skill/skill.resolver';
import { CreateProjectInput, UpdateProjectInput } from './Inputs';

const IMAGES_DIECTORY = join(__dirname, '../../assets/images/projects/');

const BaseResolver = createBaseResolver<
  Project,
  CreateProjectInput,
  UpdateProjectInput
>({
  suffix: 'Project',
  entityType: Project,
  inputTypes: {
    create: {
      type: CreateProjectInput,
      before: async ({ data: { title, image } }) => {
        let projectImage: string | undefined = undefined;
        if (image) {
          projectImage = await uploadFile(image, IMAGES_DIECTORY);
        }
        return Project.create({
          title,
          image: projectImage,
        });
      },
    },
    update: {
      type: UpdateProjectInput,
      before: async ({ data: { title, image }, entityData }) => {
        if (entityData) {
          entityData.title = title;
          const previousImage = entityData.image;
          entityData.image = image
            ? await uploadFile(image, IMAGES_DIECTORY)
            : entityData.image;
          if (previousImage !== entityData.image) {
            // remove previousImage from file system
          }
        }
        return entityData as Project;
      },
    },
  },
});

@Resolver(Project)
export class ProjectResolver extends BaseResolver {
  @FieldResolver()
  image(@Root() { image }: Project): string {
    const url = `${process.env.SERVER_URL}/assets/images/projects/`;
    if (!image) {
      return url + 'default.png';
    }
    image = url + image;
    if (fs.existsSync(image)) {
      return url + 'default.png';
    }
    return image;
  }

  @FieldResolver()
  async work_experience(
    @Root()
    { weID }: Project
  ): Promise<WorkExperience | null> {
    const we = await WorkExperience.findOne(weID);
    if (!we) {
      return null;
    }
    return we;
  }

  @FieldResolver()
  async skills(@Root() { id }: Project): Promise<Skill[]> {
    return this.setUpRelation<Skill, ProjectSkill>({
      relationEntityType: ProjectSkill,
      where: {
        projectID: id.toString(),
      },
      executeMethod: async (ps) => ps.skill(),
    });
  }

  @Query(() => [Project])
  async getFeaturedProjects(): Promise<Project[]> {
    return Project.find({ where: { isFeatured: true } });
  }

  @Query(() => [Project])
  async getProjectsBySkillID(
    @Arg('skillID', () => String)
    skillID: string
  ): Promise<Project[]> {
    if (skillID === 'all') {
      return this.getAll();
    }
    const skillResolverInstance = new SkillResolver();
    const skill = await skillResolverInstance.get(skillID);
    if (!skill) return [];
    return skillResolverInstance.projects(skill);
  }
}
