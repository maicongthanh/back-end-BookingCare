'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            contentHTMLVi: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            contentMarkdownVi: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            titleVi: {
                allowNull: true,
                type: Sequelize.STRING
            },
            contentHTMLEn: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            contentMarkdownEn: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            titleEn: {
                allowNull: true,
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.BLOB('long')
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
        await queryInterface.dropTable('posts');
    }
};