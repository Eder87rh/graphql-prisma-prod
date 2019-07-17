import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from 'bcryptjs';
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const user = await prisma.mutation.createUser({
    data: {
      name: 'Jen',
      email: 'jen@example.com',
      password: bcrypt.hashSync('Red123456')
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Post 1",
      body: "...",
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Post 2",
      body: "...",
      published: false,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });

});

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

test('Should expose posts data', async () => {
  const getPosts = gql `
    query {
      posts {
        id
        title
        body
        published
      }
    }
  `;

  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBeTruthy();
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
});