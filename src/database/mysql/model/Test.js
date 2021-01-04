const sequelize = require('../connection')
const {
  DataTypes,
} = require('sequelize');

const Ship = sequelize.define('ship', {
  name: DataTypes.STRING,
  crewCapacity: DataTypes.INTEGER,
  amountOfSails: DataTypes.INTEGER
}, { timestamps: false });
const Captain = sequelize.define('captain', {
  name: DataTypes.STRING,
  skillLevel: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 10 }
  }
}, { timestamps: false });
Captain.hasOne(Ship);
Ship.belongsTo(Captain, { as: 'leader' });

Captain.sync({
  force: false,
});
Ship.sync({
  force: false,
});

module.exports = {
  Ship,
  Captain,
};

