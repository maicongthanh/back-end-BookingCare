'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ForgotPassword extends Model {
        static associate(models) {
            // ForgotPassword.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorTypeData' })

            // ForgotPassword.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' })
            // ForgotPassword.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderDataPatient' })

        }
    };
    ForgotPassword.init({
        statusId: DataTypes.STRING,
        token: DataTypes.STRING,
        email: DataTypes.STRING,
        timeDate: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ForgotPassword',
    });
    return ForgotPassword;
};