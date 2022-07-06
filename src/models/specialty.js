'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Specialty.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId', as: 'specialtyTypeData' })

    }
  };
  Specialty.init({
    nameVi: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    descriptionHTMLVi: DataTypes.TEXT('long'),
    descriptionMarkdownVi: DataTypes.TEXT('long'),
    descriptionHTMLEn: DataTypes.TEXT('long'),
    descriptionMarkdownEn: DataTypes.TEXT('long'),
    image: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};