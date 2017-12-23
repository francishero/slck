
import formatErrors from '../formatError'
import { requiresAuth } from '../permissions'

// wrap the createTeam in a requireAuth higher order component 
// only authenticated users can access this route
export default {
  Mutation: {
    createTeam: requiresAuth.createResolver( async (parent, args, { models, user }) => {
      // we create a team whose owner is the user we passed in the context 
      // context is passed in the index.js 
      try {
        await models.Team.create({...args, owner: user.id })
        return {
          ok: true 
        } 
      } catch(e) {
        return {
          ok: false,
          errors: formatErrors(e, models)
        }
      }
    })
  }
}