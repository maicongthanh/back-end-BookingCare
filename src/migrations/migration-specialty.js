'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('specialties', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            nameVi: {
                type: Sequelize.STRING
            },
            nameEn: {
                type: Sequelize.STRING
            },
            descriptionHTMLVi: {
                type: Sequelize.TEXT('long')
            },
            descriptionMarkdownVi: {
                type: Sequelize.TEXT('long')
            },
            descriptionHTMLEn: {
                type: Sequelize.TEXT('long')
            },
            descriptionMarkdownEn: {
                type: Sequelize.TEXT('long')
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('specialties');
    }
};