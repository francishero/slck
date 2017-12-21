import bcrypt from 'bcrypt'
import _ from 'lodash'

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path','message']))
  }
  return [{ path: 'name', message: 'something is not right'}]
}

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id}}),
    allUsers: (parent, args, { models }) => models.User.findAll()

  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
     try {

       // manual validation for the password 
      if (password.length < 5 || password.length >100) {
        return {
          ok: false,
          errors:[ {
            path:'password',
            message:'Password must be 5 characters and less than 100 characters'
          }]
        }
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      console.log('hashedPassword-->',hashedPassword)
     

     const user = await models.User.create({
        ...otherArgs,
        password: hashedPassword
      })
     return {
      ok: true,
      user
     }

     } catch(e) {
       return {
        ok: false,
        errors: formatErrors(e, models)
       }
     }

    } 
  }
}