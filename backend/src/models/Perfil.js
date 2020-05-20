const { Model, DataTypes } = require("sequelize");

class Perfil extends Model {
  static init(sequelize) {
    super.init(
      {
        id_perfil: {
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
        tableName: "perfil",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Acesso, { foreignKey: "id_perfil", as: "acesso" });
    this.hasOne(models.Cliente, { foreignKey: "id_perfil", as: "cliente" });
  }
}

module.exports = Perfil;
