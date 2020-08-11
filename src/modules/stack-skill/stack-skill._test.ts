import faker from 'faker';
import { Connection } from 'typeorm';
import { Skill } from '../../entity/Skill';
import { Stack } from '../../entity/Stack';
import { crudTest } from '../../test-utils/CrudTest';
import { testConn } from '../../test-utils/testConn';

jest.setTimeout(6000);

interface BaseEntityResponse {
  id: string;
  title: string;
}

abstract class StackSkillIDs {
  stackID: string;
  skillID: string;
}

abstract class StackSkillResponse extends StackSkillIDs {
  stack: BaseEntityResponse;
  skill: BaseEntityResponse;
}

interface DataToProceed {
  stackSkillToBeCreated: StackSkillIDs;
  stackSkillCreateExpectedData: StackSkillResponse;
}

let con: Connection;
let data: DataToProceed;

async function genAllData(): Promise<DataToProceed> {
  if (data) {
    return data;
  }
  // get skill if exists
  const skills = await Skill.find();
  let skill: Skill;
  if (skills.length <= 0) {
    const skillData = { title: faker.lorem.word() };
    skill = await Skill.create(skillData).save();
  } else {
    skill = skills[0];
  }

  // get stack if exists
  const stacks = await Stack.find();
  let stack: Stack;
  if (stacks.length <= 0) {
    const stackData = { title: faker.lorem.word() };
    stack = await Stack.create(stackData).save();
  } else {
    stack = stacks[0];
  }

  // now we have both skill and stack
  const stackSkillToBeCreated: StackSkillIDs = {
    stackID: stack.id.toString(),
    skillID: skill.id.toString(),
  };
  const stackSkillCreateExpectedData: StackSkillResponse = {
    ...stackSkillToBeCreated,
    stack: { id: stack.id.toString(), title: stack.title },
    skill: { id: skill.id.toString(), title: skill.title },
  };
  data = {
    stackSkillToBeCreated,
    stackSkillCreateExpectedData,
  };
  return {
    stackSkillToBeCreated,
    stackSkillCreateExpectedData,
  };
}

beforeAll(async () => {
  con = await testConn();
});

afterAll(async () => {
  if (con) {
    await con.close();
  }
});

describe('Stack Skill', () => {
  const gqlResponseData: string = `{
      id
      stackID
      skillID
      stack {
        id
        title
      }
      skill {
        id
        title
      }
    }`;
  crudTest({
    testName: 'stack skill',
    genData: genAllData,
    crud: {
      create: {
        source: `mutation CreateStackSkill($data: CreateStackSkillInput!) {
            createStackSkill(data: $data) ${gqlResponseData}
          }`,
        methodName: 'createStackSkill',
      },
      get: {
        source: `query GetStackSkill($id: String!) {
            getStackSkill(id: $id) ${gqlResponseData}
          }`,
        methodName: 'getStackSkill',
      },
      getAll: {
        source: `query GetAllStackSkill {
            getAllStackSkill ${gqlResponseData}
          }
          `,
        methodName: 'getAllStackSkill',
      },
    },
  });
});
