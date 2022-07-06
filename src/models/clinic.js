'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Clinic.hasMany(models.Doctor_Infor, { foreignKey: 'clinicId', as: 'clinicTypeData' })
        }
    };
    Clinic.init({
        image: DataTypes.TEXT,
        background: DataTypes.TEXT,
        nameVi: DataTypes.STRING,
        addressVi: DataTypes.STRING,
        descriptionHTMLVi: DataTypes.TEXT,
        descriptionMarkdownVi: DataTypes.TEXT,
        nameEn: DataTypes.STRING,
        addressEn: DataTypes.STRING,
        descriptionHTMLEn: DataTypes.TEXT,
        descriptionMarkdownEn: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};