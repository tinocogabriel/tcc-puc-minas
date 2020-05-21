"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("instrutor_atividades", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "id_atividade",
      },
      id_instrutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "instrutor", key: "id_instrutor" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_atividade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "atividade", key: "id_atividade" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("instrutor_atividades");
  },
};
