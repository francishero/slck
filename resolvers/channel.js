import formatErrors from '../formatError'
export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
    try {
    const channel = await models.Channel.create(args)
      return {
        ok: true,
        channel
      }
    } catch(e) {
      console.log(e);
      return {
        ok: false,
        errors: formatErrors(e, models)
      }
    }
  }
  }
}