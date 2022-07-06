'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('clinics', {
            // name: DataTypes.STRING,
            // address: DataTypes.STRING,
            // : DataTypes.TEXT,
            // : DataTypes.TEXT,
            // image: DataTypes.TEXT,
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nameVi: {
                type: Sequelize.STRING
            },
            addressVi: {
                type: Sequelize.STRING
            },
            descriptionHTMLVi: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownVi: {
                type: Sequelize.TEXT
            },
            nameEn: {
                type: Sequelize.STRING
            },
            addressEn: {
                type: Sequelize.STRING
            },
            descriptionHTMLEn: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownEn: {
                type: Sequelize.TEXT
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            background: {
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
        await queryInterface.dropTable('clinics');
    }
};