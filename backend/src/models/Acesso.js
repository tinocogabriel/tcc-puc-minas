const { Model, DataTypes } = require("sequelize");

class Acesso extends Model {
  static init(sequelize) {
    super.init(
      {
        id_acesso: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        usuario: DataTypes.STRING,
        senha: DataTypes.STRING,
        data_criacao: DataTypes.DATE,
        data_alteracao: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "acesso",
      }
    );
  }

  static associate(models) {
    this.hasOne(models.Perfil, { foreignKey: "id_perfil", as: "perfil" });
    this.hasOne(models.Cliente, { foreignKey: "id_acesso", as: "cliente" });
  }
}

module.exports = Acesso;
