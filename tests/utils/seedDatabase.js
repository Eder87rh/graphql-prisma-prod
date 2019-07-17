import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';

export default async () => {
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
}