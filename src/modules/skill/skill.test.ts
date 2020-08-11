import { testConn } from "../../test-utils/testConn";
import { Connection } from "typeorm";
import faker from "faker";
import { crudTest } from "../../test-utils/CrudTest";

let con: Connection;
beforeAll(async () => {
  con = await testConn();
});

afterAll(async () => {
  if (con) {
    await con.close();
  }
});

describe("Skill", () => {
  const skillToBeCreated = { title: faker.lorem.word() };
  crudTest({
    testName: "skill",
    crud: {
      create: {
        source: `mutation CreateSkill($data: CreateSkillInput!) {
            createSkill(data: $data) {
                id
                title
            }
        }`,
        methodName: "createSkill",
        variableValues: {
          data: skillToBeCreated
        },
        expectedData: skillToBeCreated
      },
      get: {
        source: `query GetSkill($id: String!) {
          getSkill(id: $id) {
            id
            title
          }
        }`,
        methodName: "getSkill",
        expectedData: { title: skillToBeCreated.title }
      },
      getAll: {
        source: `query GetAllSkill {
          getAllSkill {
            id
            title
          }
        }`,
        methodName: "getAllSkill",
        expectedData: { title: skillToBeCreated.title }
      }
    }
  });
});
