const { createSchema } = require('graphql-yoga');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const schema = createSchema({ typeDefs, resolvers });

module.exports = schema;