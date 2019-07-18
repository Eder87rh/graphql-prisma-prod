import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';
import { getPosts, getMyPosts, updatePost, createPost, deletePost } from './utils/operations.js'

const client = getClient();

beforeEach(seedDatabase);



test('Should expose posts data', async () => {
  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBeTruthy();
});

test('Shoul mypost query work', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getMyPosts });
  expect(data.myPosts.length).toBe(2);
   
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };
  

  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });
  expect(data.updatePost.published).toBeFalsy();
  expect(exists).toBe(true);
});

test('Should create a new post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: "A new post",
      body: "",
      published: true
    }
  };

  const { data } = await client.mutate({ mutation: createPost, variables });

  expect(data.createPost.title).toBe('A new post');
  expect(data.createPost.body).toBe('');
  expect(data.createPost.published).toBeTruthy();
});

test('should delete post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id
  };
  

  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBeFalsy();
});