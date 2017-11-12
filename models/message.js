export default (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: DataTypes.STRING
  });
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Message.belongsTo(models.Channel, {
      foreignKey: 'channelId'
    })
  }

  return Message 
}