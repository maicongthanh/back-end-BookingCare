'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Markdown.belongsTo(models.User, { foreignKey: 'doctorId' })

        }
    };
    Markdown.init({
        contentHTMLVi: DataTypes.TEXT('long'),
        contentMarkdownVi: DataTypes.TEXT('long'),
        descriptionVi: DataTypes.TEXT('long'),
        contentHTMLEn: DataTypes.TEXT('long'),
        contentMarkdownEn: DataTypes.TEXT('long'),
        descriptionEn: DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Markdown',
    });
    return Markdown;
};