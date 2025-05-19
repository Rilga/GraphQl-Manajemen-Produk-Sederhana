const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }

  type Query {
    getAllProducts: [Product!]!
    getAllCategories: [Category!]!
    getCategoryById(id: ID!): Category
    getProductById(id: ID!): Product
  }

  type Mutation {
    addCategory(name: String!): Category!
    addProduct(name: String!, price: Float!, categoryId: ID!): Product!
    deleteProduct(id: ID!): String!
    deleteCategory(id: ID!): String!
  }
`);

module.exports = schema;