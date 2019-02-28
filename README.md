Please see example in index.js

Using the `GraphQLScalarType` constructor directly still works, however the approach I took to subclassing `GraphQLScalarType` in `graphql-validated-types`[https://github.com/stephenhandley/graphql-validated-types] appears to break on all versions of `graphql` after 0.13.2, as those scalar resolvers are not run. 
