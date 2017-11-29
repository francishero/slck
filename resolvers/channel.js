export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
    try {
      await models.Channel.create(args)
      return true // the schema requires us to return a boolean
    } catch(e) {
      console.log(e);
      return false 
    }
  }
  }
}