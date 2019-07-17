import ApolloBoost from 'apollo-boost';

export default () => {
  return new ApolloBoost({
    uri: 'http://localhost:4000'
  });
}