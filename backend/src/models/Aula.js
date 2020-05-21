const { Model, DataTypes } = require("sequelize");
class Aula extends Model {
  static init(sequelize) {
    super.init(
      {
        id_aula: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: DataTypes.STRING,
        horario_inicio: DataTypes.INTEGER,
        horario_termino: DataTypes.INTEGER,
        numero_sala: DataTypes.INTEGER,
        flag_segunda: DataTypes.INTEGER,
        flag_terca: DataTypes.INTEGER,
        flag_quarta: DataTypes.INTEGER,
        flag_quinta: DataTypes.INTEGER,
        flag_sexta: DataTypes.INTEGER,
        flag_sabado: DataTypes.INTEGER,
        flag_domingo: DataTypes.INTEGER,
        data_criacao: DataTypes.DATE,
        data_alteracao: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "aula",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Instrutor, {
      foreignKey: "id_instrutor",
      as: "instrutor",
    });
  }
}

module.exports = Aula;
