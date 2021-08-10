const graphql = require("graphql");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const IngredientType = new GraphQLObjectType({
  name: "Ingredient",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const MixtureType = new GraphQLObjectType({
  name: "Mixture",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    ingredients: {
      type: new GraphQLList(GraphQLNonNull(IngredientType)),
      resolve(parentValue, args) {
        const ids = parentValue.ingredients.map((x) => x.id);
        return axios
          .get(`http://localhost:3000/Ingredients/`)
          .then((res) => res.data.filter((e) => ids.indexOf(e.id) !== -1));
      },
    },
    brewingTime: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Mixture: {
      type: MixtureType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/Mixtures/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});