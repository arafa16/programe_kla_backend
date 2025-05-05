'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  company.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    logo_name: DataTypes.STRING,
    logo_file_name: DataTypes.STRING,
    logo_file_link: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'company',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });
  return company;
};