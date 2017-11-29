export default {
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
    try {
      await models.Message.create({
        ...args,
        userId: user.id
      })
      return true // the schema requires us to return a boolean
    } catch(e) {
      console.log(e);
      return false 
    }
  }
  }
}