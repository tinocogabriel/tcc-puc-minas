"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("aula", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "id_aula",
      },
      nome: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      horario_inicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      horario_termino: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_instrutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "instrutor", key: "id_instrutor" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      numero_sala: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_segunda: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_terca: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_quarta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_quinta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_sexta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_sabado: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      flag_domingo: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    return queryInterface.dropTable("aula");
  },
};
