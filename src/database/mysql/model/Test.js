const sequelize = require('../connection')
const {
  DataTypes,
} = require('sequelize');

const Ship = sequelize.define('ship', { name: DataTypes.STRING }, { timestamps: false });
const Captain = sequelize.define('captain', {
  name: { type: DataTypes.STRING, unique: true}
}, { timestamps: false });
Captain.hasOne(Ship, { sourceKey: 'name', foreignKey: 'captainName' });
Ship.belongsTo(Captain);

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

