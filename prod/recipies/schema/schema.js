const  graphql = require('graphql');
const _  = require('lodash');

const{
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLSchema,
  GraphQLList
} = graphql;

const IngredientType = new GraphQLObjectType({
  name: 'Ingredient',
  fields: {
    id: { type: GraphQLID},
    name: { type: GraphQLString},
    description: { type: GraphQLString},
  }
})

const MixtureType = new GraphQLObjectType({
  name: 'Mixture',
  fields: {
    id: { type: GraphQLID},
    name: { type: GraphQLString},
    description: { type: GraphQLString},
    ingredients: { type: new GraphQLList(IngredientType) },
    brewingTime: { type: GraphQLInt}
  }
})

const RootQuery = new GraphQLObjectType({
  name:'RootQueryType',
  fields: {
    Mixture:{
      type: MixtureType,
      args: { id: { type: GraphQLID}},
      resolve(parentValue, args){
        return _.find(Mixtures, { id: args.id});
      }
    }
  }
});

const Mixtures = [
  { id: "1", name: 'Cat', description: '', ingredients: [{id:101},{id:102},{id:103} ], brewingTime: 5}
]

const Ingredients = [
  {id: "101", name:  'Dwarven spirit', description: ''  },
  {id: "102", name:  'Berbercane fruit', description: ''  },
  {id: "103", name:  'Water essence', description: ''  },
]

module.exports = new GraphQLSchema({
  query: RootQuery
});

