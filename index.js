const Express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const {GraphQLScalarType, Kind} = require('graphql');
const {
  GraphQLValidatedEmail,
  GraphQLValidatedString
} = require('graphql-validated-types');

// This is a copy of the class from graphql-validated-types
const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

function ensureLessThan (threshold) {
  return function (value) {
    if (value >= threshold) {
      throw new TypeError(`Number is not less than ${threshold}`);
    }
    return value;
  };
}

const ensureLessThan100 = ensureLessThan(100);
const ensureLessThan200 = ensureLessThan(200);

const NumberLessThan100 = new GraphQLScalarType({
  name: 'NumberLessThan100',
  description: 'Description of my custom scalar type',
  serialize (value) {
    console.log('MCS serialize');
    return value;
  },
  parseValue (value) {
    console.log('MCS parseValue');
    return ensureLessThan100(value);
  },
  parseLiteral (ast) {
    console.log('MCS parseLiteral');
    if (ast.kind !== Kind.Int) {
      throw new TypeError('Not an int');
    }
    return ensureLessThan100(value);
  }
});

const Date = new GraphQLValidatedString({
  name: 'Date'
}).regex(/(\d{4})\/(\d{2})\/(\d{2})/);

const Email = new GraphQLValidatedEmail({
  name: 'Email'
}).exact();

const NumberLessThan200 = new GraphQLValidatedScalar({
  name: 'NumberLessThan200'
}).validator((value)=> {
  if ((typeof value !== 'number')) {
    throw new TypeError('Not an int');
  }
	return ensureLessThan200(value);
});

const schemaString = gql`
  scalar NumberLessThan100
  scalar NumberLessThan200
  scalar Date
  scalar Email

  type Foo {
    lessThan100: NumberLessThan100!
    lessThan200: NumberLessThan200!
    date: Date!
    email: Email!
  }

  type Query {
    foo: Foo
  }

  input FooInput {
    lessThan100: NumberLessThan100
    lessThan200: NumberLessThan200
    date: Date
    email: Email
  }

  type Mutation {
    setFoo (input: FooInput!): Foo
  }
`;

const FOO = {
  lessThan100: 1000,
  lessThan200: 20000,
  date: '2019/03/28',
  email: 'email@email.com'
}

const resolverFunctions = {
  NumberLessThan100,
  NumberLessThan200,
  Date,
  Email,
  Query: {
    foo: ()=> {
      return FOO;
    }
  },
  Mutation: {
    setFoo: function (obj, args) {
      for (const [k, v] of Object.entries(args.input)) {
        console.log(`setting FOO.${k}=${v}`);
        FOO[k] = v;
      }
      return FOO;
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
  console.log(`🚀 Server running at localhost:${PORT}`);
});
