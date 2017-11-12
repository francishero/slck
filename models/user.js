export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }
  );

User.associate= (models) => {
  User.belongsToMany(models.Team, {
    through: 'member',
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