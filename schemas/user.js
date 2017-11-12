export default `type User {
    id: Int!
    email: String! 
    username: String!
  }

  type Message {
    id: Int!
    text: String! 
    user: User!
    channel: Channel!
    team: Team!
  }

  type Channel {
    id: Int!
    name: String!
    messages: [Message!]! 
    public: Boolean!
    users: [User!]!
  }

  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }`