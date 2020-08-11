import { unlinkSync } from 'fs';
import path from 'path';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Company } from '../../entity/Company';
import uploadFile from '../../utils/uploadFile';
import createBaseResolver from '../shared/createBaseResolver';
import { CreateCompanyInput, UpdateCompanyInput } from './Inputs';

const LOGO_DIRECTORY = path.join(__dirname, '../../assets/images/company/');

const BaseResolver = createBaseResolver<
  Company,
  CreateCompanyInput,
  UpdateCompanyInput
>({
  suffix: 'Company',
  entityType: Company,
  inputTypes: {
    create: {
      type: CreateCompanyInput,
      before: async ({ data: { title, logo } }) => {
        let companyLogo: string | undefined = undefined;
        if (logo) {
          companyLogo = await uploadFile(logo, LOGO_DIRECTORY);
        }
        return Company.create({
          title,
          logo: companyLogo,
        });
      },
    },
    update: {
      type: UpdateCompanyInput,
      before: async ({ data: { title, logo }, entityData }) => {
        if (entityData) {
          entityData.title = title;
          const previousLogo = entityData.logo;
          entityData.logo = logo
            ? await uploadFile(logo, LOGO_DIRECTORY)
            : entityData.logo;
          if (previousLogo !== entityData.logo) {
            // remove previousImage from file system
          }
        }
        return entityData as Company;
      },
    },
    delete: {
      after: async ({ entityData: { logo } }) => {
        // remove image from the file system
        if (logo) {
          unlinkSync(`${LOGO_DIRECTORY}${logo}`);
        }
      },
    },
  },
});

@Resolver(Company)
export class CompanyResolver extends BaseResolver {
  @FieldResolver()
  logo(@Root() { logo }: Company): string | undefined {
    if (logo) {
      return `${process.env.SERVER_URL}/assets/images/company/${logo}`;
    }
    return logo;
  }
}
