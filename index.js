const Express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const {GraphQLScalarType, Kind} = require('graphql');
const {
  GraphQLValidatedEmail,
  GraphQLValidatedString,
  GraphQLValidatedMoment,
  GraphQLValidatedURL
} = require('graphql-validated-types');

const myCustomScalarType = new GraphQLScalarType({
  name: 'MyCustomScalar',
  description: 'Description of my custom scalar type',
  serialize(value) {
    console.log('hi');
    let result;
    // Implement custom behavior by setting the 'result' variable
    return result;
  },
  parseValue(value) {
    console.log('hi2');
    let result;
    // Implement custom behavior here by setting the 'result' variable
    return result;
  },
  parseLiteral(ast) {
    console.log('hi3');
    switch (ast.kind) {
      case Kind.Int:
      // return a literal value, such as 1 or 'static string'
    }
  }
});

const schemaString = gql`
  scalar MyCustomScalar

  type Foo {
    aField: MyCustomScalar
  }

  type Query {
    foo: Foo
  }
`;

const resolverFunctions = {
  MyCustomScalar: myCustomScalarType
};

const server = new ApolloServer({
  typeDefs: schemaString,
  resolvers: resolverFunctions
});

const app = Express();
const path = '/';
server.applyMiddleware({app, path});

const PORT = 5000;
app.listen(PORT, ()=> {
  console.log(`🚀 Server open a localhost:${PORT}`);
});
