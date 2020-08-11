import { Arg, Mutation, Resolver } from 'type-graphql';
import { Contact } from '../../entity/Contact';
import sendMail from '../../utils/sendMail';

@Resolver(Contact)
export class ContactResolver {
  @Mutation(() => Boolean)
  async contact(@Arg('data', () => Contact) data: Contact): Promise<boolean> {
    return sendMail(data);
  }
}
