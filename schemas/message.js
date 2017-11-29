export default `

type Message {
    id: Int!
    text: String! 
    user: User!
    channel: Channel!
    team: Team!
  }

  type Mutation {
  	createMessage(channelId: Int!, text: String!): Boolean!
  }
`