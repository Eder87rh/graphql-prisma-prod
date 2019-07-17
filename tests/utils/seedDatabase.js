import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

export const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('Red123456')
  },
  user: undefined,
  jwt: undefined
}


export default async () => {
  // Delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, 'thisisasecret');

  await prisma.mutation.createPost({
    data: {
      title: "Post 1",
      body: "...",
      published: true,
      author: {
        connect: {
          id: userOne.user.id
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
          id: userOne.user.id
        }
      }
    }
  });
}