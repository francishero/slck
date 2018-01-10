import Sequelize from 'sequelize'

const sequelize = new Sequelize('slack', 'postgres', 'flolizzyhero', {
  dialect: 'postgres', 
  operatorsAliases: Sequelize.Op,
  define: {
    // so we can store rows as snake_case in postgres
    underscored: true
  }
})

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Team: sequelize.import('./team'),
  Message: sequelize.import('./message'),
  Member: sequelize.import('./member')
}
Object.keys(models).forEach(function(modelName) {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models 