
import formatErrors from '../formatError'
import { requiresAuth } from '../permissions'

// wrap the createTeam in a requireAuth higher order component 
// only authenticated users can access this route
export default {
  Query: {
    allTeams: requiresAuth.createResolver(async(parent, args, { models, user })=> 
      models.Team.findAll({ where: { owner: user.id }},{ raw: true }))
  },
  Mutation: {
    addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
      try {
          const teamPromise = models.Team.findOne({ where: { id: teamId }}, { raw: true })
          const userToAddPromise = models.User.findOne({ where: { email }}, { raw: true })
          const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise])
          if(team.owner !== user.id) {
            return {
              ok: false,
              errors: [{ path: 'email', message: 'You cannot add a team member'}]
            } }
            if(!userToAdd) {
              return {
                ok: false,
                errors: [{ path: 'email', message: 'user with that email does not exist'}]
              }
            }
            await models.Member.create({ userId: userToAdd.id, teamId })
            return {
              ok: true 
            }
          
      } catch(e) {
          
        console.log(e);
        return {
          ok: false,
          errors: formatErrors(e, models )
        }
      } 
    })
  ,
    createTeam: requiresAuth.createResolver( async (parent, args, { models, user }) => {
      // we create a team whose owner is the user we passed in the context 
      // context is passed in the index.js 
      // creating a team then creating a channel could throw some errors
      // maybe team is created sucessfully but channel fails 
      // we need to make sure both are created successfully before we continue 
      // so we use sequelize transactions 
      try {
        const response = await models.sequelize.transaction(
          async () => {
            const team = await models.Team.create({ ...args, owner: user.id })
            await models.Channel.create({ name: 'general', public: true, teamId: team.id })

            return team 
          })

        return {
          ok: true,
          team: response // transaction returned a team 
        }
      } catch(e) {
        return {
          ok: false,
          errors: formatErrors(e, models)
        }
      }
    })
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } })
  }
}