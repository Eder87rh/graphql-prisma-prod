import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const variables = {
    data: {
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'MyPasss123'
    }
  }

  const response = await client.mutate({
    mutation: createUser,
    variables
  });

  const userExistsInDB = prisma.exists.User({
    id: response.data.createUser.user.id
  });

  expect(userExistsInDB).toBeTruthy();
});

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: "jen@example.com",
      password: "red098!1234"
    }
  };
  
  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow();
});

test('Shouldn\'t  signup with short password', async () => {
  const variables = {
    data: {
      email: "jen@example.com",
      password: "123"
    }
  }

  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow();
}, 10000);

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt)
  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});