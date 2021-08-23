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
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    quantity: { type: GraphQLString },
    mixtures: {
      type: new GraphQLList(MixtureType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/Ingredients/${parentValue.id}/mixtures`)
          .then((res) => res.data);
      },
    },
  }),
});

const MixtureType = new GraphQLObjectType({
  name: "Mixture",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    ingredients: {
      type: new GraphQLList(IngredientType),
      resolve(parentValue, args) {
        const ids = parentValue.ingredients.map((x) => x.id);
        const quants = parentValue.ingredients.map((x) => x.quantity);
        return axios.get(`http://localhost:3000/Ingredients/`).then((res) => {
          var response = res.data.filter((e) => ids.indexOf(e.id) !== -1);
          response.map((e, i) => (e.quantity = quants[i]));
          return response;
        });
      },
    },
    brewingTime: { type: GraphQLInt },
  }),
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
    Ingredient: {
      type: IngredientType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/Ingredients/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addIngredient: {
      type: IngredientType,
      args: {
        name: { type: (GraphQLString) },
        description: { type: GraphQLString },
        quantity: { type: GraphQLString },
      },
      resolve(parentValue, { name, description, quantity }) {
        return axios
          .post(`http://localhost:3000/Ingredients`, {
            name,
            description,
            quantity,
          })
          .then((res) => res.data);
      },
    },
    deleteIngredient: {
      type:IngredientType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parentValue, args){
        return axios
        .delete(`http://localhost:3000/Ingredients/${args.id}`)
        .then(res => res.data);
      }
    },

    addMixture: {
      type: MixtureType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        brewingTime: { type: GraphQLInt },
        id: { type: GraphQLID }
      },
      resolve(parentValue, { name, description, brewingTime, id }) {
        return axios
          .post(`http://localhost:3000/Mixtures`, {
            name,
            description,
            
            brewingTime,
          })
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
