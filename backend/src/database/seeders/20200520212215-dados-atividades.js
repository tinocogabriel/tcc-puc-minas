"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "atividade",
      [
        {
          descricao: "Musculação",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Dança",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Natação",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Ioga",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("atividade", null, {});
  },
};
