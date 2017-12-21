export default `type User {
    id: Int!
    email: String! 
    username: String!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }
  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): RegisterResponse!
  }

 `