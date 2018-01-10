export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
     validate: {
       isAlphanumeric: {
        args: true,
        msg: 'Username must be alphanumeric'
      },
      len: {
        args: [3,25],
        msg: 'The length of the username must be between 3 and 25'
      }
     }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email is not valid'
        }
      }
    },
    password: DataTypes.STRING
  }
  );

User.associate= (models) => {
  User.belongsToMany(models.Team, {
    through: models.Member,
    foreignKey: {
      name: 'userId',
      field: 'user_id'
    }
  });
// a user can belong to many channels 
  User.belongsToMany(models.Channel, {
    through: 'channel_member',
    foreignKey: {
      name: 'userId',
      field: 'user_id'
    }
  })
}

return User

}