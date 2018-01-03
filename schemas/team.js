export default `
 type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
    id: Int!
    name: String!
  }
  type CreateTeamRespponse {
  	ok: Boolean!
    team: Team!
  	errors: [Error!]
  }
type Query {
  allTeams: [Team!]!
}
  type Mutation {
  	createTeam(name: String!): CreateTeamRespponse!
  }

`