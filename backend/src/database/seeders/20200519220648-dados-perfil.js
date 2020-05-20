"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "perfil",
      [
        {
          descricao: "Aluno",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Instrutor",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Recepcionista",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Gerente",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
        {
          descricao: "Fisioterapeuta",
          data_criacao: new Date(),
          data_alteracao: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("perfil", null, {});
  },
};
