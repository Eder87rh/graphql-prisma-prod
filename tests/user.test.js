import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Eder"
          email: "eder@exmple.com"
          password: "MyPass123"
        }
      ) {
        token,
        user {
          id
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });

  const userExistsInDB = prisma.exists.User({
    id: response.data.createUser.user.id
  });

  expect(userExistsInDB).toBeTruthy();
});

test('Should expose public author profiles', async () => {
  const getUsers = gql `
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});



test('Should not login with bad credentials', async () => {
  const login = gql `
    mutation {
      login (
        data: {
          email: "jen@example.com"
          password: "red123456"
        }
      ){
        token
      }
    }
  `;

  await expect(
    client.mutate({ mutation: login })
  ).rejects.toThrow();
});

test('Shouldn\'t  signup with short password', async () => {
  const login = gql `
    mutation {
      login (
        data: {
          email: "jen@example.com"
          password: "123"
        }
      ) {
        token
      }
    }
  `;

  await expect(
    client.mutate({ mutation: login })
  ).rejects.toThrow();
}, 10000);