import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
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