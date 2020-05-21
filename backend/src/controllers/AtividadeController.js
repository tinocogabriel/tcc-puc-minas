const { Op } = require("sequelize");
const Atividade = require("../models/Atividade");

module.exports = {
  async store(req, res) {
    const { descricao } = req.body;

    const atividadeDuplicada = await Atividade.findOne({
      where: {
        descricao,
      },
    });

    if (atividadeDuplicada)
      return res.status(404).json({
        error: "Já existe uma atividade com essa descrição!",
      });

    const [atividade] = await Atividade.findOrCreate(
      {
        descricao,
        data_criacao: new Date(),
        data_alteracao: new Date(),
      },
    );

    return res.json(atividade);
  },
  async index(req, res) {
    const atividade = await Atividade.findAll();

    return res.json(atividade);
  },
  async update(req, res) {
    const { descricao } = req.body;
    const { id_atividade } = req.params;

    const atividadeDuplicada = await Atividade.findOne({
      where: {
        descricao,
        id_atividade: {
          [Op.ne]: id_atividade,
        },
      },
    });

    if (atividadeDuplicada)
      return res.status(404).json({
        error: "Já existe uma atividade com essa descrição!",
      });

    const atividade = await Atividade.update(
      {
        descricao,
        data_alteracao: new Date()
      },
      {
        where: {
          id_atividade,
        },
      }
    );

    return res.json({
      retorno: atividade,
      mensagem:
        atividade == 1
          ? "Atualizado com sucesso!"
          : "Houve um problema na atualização",
    });
  },
  async delete(req, res) {
    const { id_atividade } = req.params;

    const atividade = await Atividade.destroy({ where: { id_atividade } });

    return res.status(204).json();
  },
};
