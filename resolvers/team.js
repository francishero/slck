export default {
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      // we create a team whose owner is the user we passed in the context 
      // context is passed in the index.js 
      try {
        await models.Team.create({...args, owner: user.id })
        return true 
      } catch(e) {
        console.log(e);
        return false 
      }
    }
  }
}