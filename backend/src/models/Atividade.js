const { Model, DataTypes } = require("sequelize");

class Atividade extends Model {
  static init(sequelize) {
    super.init(
      {
        id_atividade: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        descricao: DataTypes.STRING,
        data_criacao: DataTypes.DATE,
        data_alteracao: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "atividade",
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Instrutor, { foreignKey: "id_atividade",through: "instrutor_atividades", as: "instrutor" });
  }
}

module.exports = Atividade;
