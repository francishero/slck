export default `
 type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
  type CreateTeamRespponse {
  	ok: Boolean!
  	errors: [Error!]
  }

  type Mutation {
  	createTeam(name: String!): CreateTeamRespponse!
  }

`