"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("instrutor", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "id_instrutor",
      },
      id_acesso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "acesso", key: "id_acesso" },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      },
      nome: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      rg: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING(14),
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
    return queryInterface.dropTable("instrutor");
  },
};
