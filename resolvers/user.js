import bcrypt from 'bcrypt'
import formatErrors from '../formatError'
import { tryLogin } from '../auth'



export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id}}),
    allUsers: (parent, args, { models }) => models.User.findAll()

  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
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