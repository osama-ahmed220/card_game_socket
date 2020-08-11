import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getRepository,
  ObjectLiteral,
  ObjectType,
  Repository,
} from 'typeorm';
import isAuth from '../middlewares/inAuth';

interface BeforeMethodArgumentInterface<T, E> {
  data: T;
  entityData?: E;
}

interface AfterMethodArgumentInterface<E> {
  entityData: E;
}

interface BeforeAfterMethodOverRightBaseInterface<T, E> {
  before?: (data: BeforeMethodArgumentInterface<T, E>) => Promise<E>;
  after?: (data: AfterMethodArgumentInterface<E>) => Promise<void>;
}

interface BeforeAfterMethodOverRightInterface<T, E>
  extends BeforeAfterMethodOverRightBaseInterface<T, E> {
  type: ObjectType<T>;
}

interface BaseResolveArgsInputTypesInterface<C, U, E> {
  create: BeforeAfterMethodOverRightInterface<C, E>;
  update: BeforeAfterMethodOverRightInterface<U, E>;
  delete?: BeforeAfterMethodOverRightBaseInterface<string, E>;
}

interface BaseResolveArgsInterface<E, C, U> {
  suffix: string;
  entityType: ObjectType<E>;
  inputTypes: BaseResolveArgsInputTypesInterface<C, U, E>;
}

interface SetupRelationArgInterface<ReturnEntity, RelationEntity> {
  relationEntityType: ObjectType<RelationEntity>;
  where:
    | string
    | ObjectLiteral
    | FindConditions<RelationEntity>
    | FindConditions<RelationEntity>[];
  executeMethod: (d: RelationEntity) => Promise<ReturnEntity | null>;
}

const createBaseResolver = <E, C, U>({
  suffix,
  entityType,
  inputTypes,
}: BaseResolveArgsInterface<E, C, U>) => {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query(() => [entityType], { name: `getAll${suffix}` })
    async getAll(condition?: FindManyOptions<E>): Promise<E[]> {
      return getRepository(entityType).find(condition);
    }

    @Query(() => entityType, { name: `get${suffix}` })
    async get(
      @Arg('id', () => String) id?: string,
      condition?: FindOneOptions<E>
    ): Promise<E | undefined> {
      const entity = getRepository(entityType);
      if (id) {
        return entity.findOne(id, condition);
      }
      return entity.findOne(condition);
    }

    @UseMiddleware(isAuth)
    @Mutation(() => entityType, { name: `create${suffix}` })
    async create(
      @Arg('data', () => inputTypes.create.type) data: C
    ): Promise<E> {
      const entity = getRepository(entityType);
      let entityData: C | E = entity.create(data);
      if (inputTypes.create.before) {
        entityData = await inputTypes.create.before({ data });
      }
      return entity.save(entityData);
    }

    @UseMiddleware(isAuth)
    @Mutation(() => entityType, { name: `updateBy${suffix}ID` })
    async updateByID(
      @Arg('data', () => inputTypes.update.type) data: U,
      @Arg('id') id: string
    ): Promise<E | null> {
      let entityData = await this.get(id);
      if (entityData) {
        if (inputTypes.update.before) {
          entityData = await inputTypes.update.before({ data, entityData });
        } else {
          for (let field in data) {
            (entityData as any)[field] = data[field];
          }
        }
        return getRepository(entityType).save(entityData);
      }
      return null;
    }

    @UseMiddleware(isAuth)
    @Mutation(() => Boolean, { name: `deleteBy${suffix}ID` })
    async deleteByID(@Arg('id', () => String) id: string): Promise<boolean> {
      const entityData = await this.get(id);
      if (!entityData) {
        return false;
      }
      if (await getRepository(entityType).remove(entityData)) {
        if (inputTypes.delete?.after) {
          await inputTypes.delete.after({ entityData });
        }
        return true;
      }
      return false;
    }

    protected async setUpRelation<ReturnEntity, RelationEntity>({
      relationEntityType,
      where,
      executeMethod,
    }: SetupRelationArgInterface<ReturnEntity, RelationEntity>) {
      const relationEntity: Repository<RelationEntity> = getRepository(
        relationEntityType
      );
      const data = await relationEntity.find({
        where,
      });
      if (data.length <= 0) {
        return [];
      }
      const returnData: ReturnEntity[] = [];
      await Promise.all(
        data.map(async (d) => {
          const relationedData = await executeMethod(d);
          if (relationedData) {
            returnData.push(relationedData);
          }
        })
      );
      return returnData;
    }
  }
  return BaseResolver;
};
export default createBaseResolver;
