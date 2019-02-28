const Express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const {GraphQLScalarType, Kind} = require('graphql');
const {
  GraphQLValidatedEmail,
  GraphQLValidatedString
} = require('graphql-validated-types');

const myCustomScalarType = new GraphQLScalarType({
  name: 'MyCustomScalar',
  description: 'Description of my custom scalar type',
  serialize(value) {
    console.log('MCS serialize');
    return value;
  },
  parseValue(value) {
    console.log('MCS parseValue');
    let result;
    // Implement custom behavior here by setting the 'result' variable
    return result;
  },
  parseLiteral(ast) {
    console.log('MCS parseLiteral');
    switch (ast.kind) {
      case Kind.Int:
      // return a literal value, such as 1 or 'static string'
    }
  }
});

const Date = new GraphQLValidatedString({
  name: 'Date'
}).regex(/(\d{4})\/(\d{2})\/(\d{2})/);

const Email = new GraphQLValidatedEmail({
  name: 'Email'
}).exact();

const schemaString = gql`
  scalar MyCustomScalar
  scalar Date
  scalar Email

  type Foo {
    aField: MyCustomScalar
    email: Email
    date: Date
  }

  type Query {
    foo: Foo
  }
`;

const resolverFunctions = {
  MyCustomScalar: myCustomScalarType,
  Query: {
    foo: () => {
      console.log('getting foo!');
      return {
        aField: 1,
        email: 'joejoe.com',
        date: '2019/03/28'
      };
    }
  }
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
