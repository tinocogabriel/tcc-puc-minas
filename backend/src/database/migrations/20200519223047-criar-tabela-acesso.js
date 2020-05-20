"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("acesso", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "id_acesso",
      },
      usuario: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      senha: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      id_perfil: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "perfil", key: "id_perfil" },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      },
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_alteracao: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("acesso");
  },
};
