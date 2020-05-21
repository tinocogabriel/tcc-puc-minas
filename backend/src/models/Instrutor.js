const { Model, DataTypes } = require("sequelize");

class Instrutor extends Model {
  static init(sequelize) {
    super.init(
      {
        id_instrutor: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: DataTypes.STRING,
        rg: DataTypes.INTEGER,
        cpf: DataTypes.INTEGER,
        data_criacao: DataTypes.DATE,
        data_alteracao: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "instrutor",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Perfil, { foreignKey: "id_perfil", as: "perfil" });
    this.belongsTo(models.Acesso, { foreignKey: "id_acesso", as: "acesso" });
    this.belongsToMany(models.Atividade, {
      foreignKey: "id_instrutor",
      through: "instrutor_atividades",
      as: "atividade",
    });
    this.hasMany(models.Aula, { foreignKey: "id_instrutor", as: "aula" });
  }
}

module.exports = Instrutor;
