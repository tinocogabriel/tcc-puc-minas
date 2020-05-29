const { Op } = require("sequelize");
const Atividade = require("../models/Atividade");

module.exports = {
  async store(req, res, next) {
    try {
      const { descricao } = req.body;

      const atividadeDuplicada = await Atividade.findOne({
        where: {
          descricao,
        },
      });

      if (atividadeDuplicada)
        return res.status(404).json({
          error: "Existe uma atividade com essa descrição!",
        });

      const atividade = await Atividade.create({
        descricao,
        data_criacao: new Date(),
        data_alteracao: new Date(),
      });

      return res.json(atividade);
    } catch (error) {
      next(error);
    }
  },
  async index(req, res, next) {
    try {
      const atividade = await Atividade.findAll();

      return res.json(atividade);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { descricao } = req.body;
      const { id_atividade } = req.params;

      const obj = await Atividade.findByPk(id_atividade);
      if (!obj)
        return res.status(404).json({ error: "Atividade não encontrada!" });

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
          error: "Existe uma atividade com essa descrição!",
        });

      const atividade = await Atividade.update(
        {
          descricao,
          data_alteracao: new Date(),
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
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const { id_atividade } = req.params;

      const obj = await Atividade.findByPk(id_atividade);
      if (!obj)
        return res.status(404).json({ error: "Atividade não encontrada!" });

      await Atividade.destroy({ where: { id_atividade } });

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
};
