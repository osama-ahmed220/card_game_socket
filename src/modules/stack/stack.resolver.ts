import { unlinkSync } from 'fs';
import path from 'path';
import { Arg, FieldResolver, Resolver, Root } from 'type-graphql';
import { Skill } from '../../entity/Skill';
import { Stack } from '../../entity/Stack';
import { StackSkill } from '../../entity/StackSkill';
import uploadFile from '../../utils/uploadFile';
import createBaseResolver from '../shared/createBaseResolver';
import {
  CreateStackInput,
  StackSkillsFilterInput,
  UpdateStackInput,
} from './Inputs';

const IMAGES_DIECTORY = path.join(__dirname, '../../assets/images/');

const BaseResolver = createBaseResolver<
  Stack,
  CreateStackInput,
  UpdateStackInput
>({
  suffix: 'Stack',
  entityType: Stack,
  inputTypes: {
    create: {
      type: CreateStackInput,
      before: async ({ data: { title, image } }) => {
        let stackImage: string | undefined = undefined;
        if (image) {
          stackImage = await uploadFile(image, IMAGES_DIECTORY);
        }
        return Stack.create({
          title,
          image: stackImage,
        });
      },
    },
    update: {
      type: UpdateStackInput,
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
        return entityData as Stack;
      },
    },
    delete: {
      after: async ({ entityData: { image } }) => {
        // remove image from the file system
        if (image) {
          unlinkSync(`${IMAGES_DIECTORY}${image}`);
        }
      },
    },
  },
});

@Resolver(Stack)
export class StackResolver extends BaseResolver {
  @FieldResolver()
  image(@Root() { image }: Stack): string {
    const url: string = `${process.env.SERVER_URL}/assets/images/`;
    return url + (image ? image : 'other-skills-icon.svg');
  }

  @FieldResolver()
  async skills(
    @Root() { id }: Stack,
    @Arg('filters', () => StackSkillsFilterInput, { nullable: true })
    filters?: StackSkillsFilterInput | undefined
  ): Promise<Skill[]> {
    let skills = await this.setUpRelation<Skill, StackSkill>({
      relationEntityType: StackSkill,
      where: {
        stackID: id.toString(),
      },
      executeMethod: async (stackSkill) => stackSkill.skill(),
    });
    if (filters && filters.isMain !== undefined) {
      skills = await Promise.all(
        skills.filter((skill) => skill.isMain === filters.isMain)
      );
    }
    return skills;
  }
}
