const Perfil = require("../models/Perfil");

module.exports = {
  async store(req, res, next) {
    try {
      const { descricao } = req.body;

      const perfil = await Perfil.create({
        descricao,
        data_criacao: new Date(),
        data_alteracao: new Date(),
      });

      return res.json(perfil);
    } catch (error) {
      next(error);
    }
  },
  async index(req, res, next) {
    try {
      const perfil = await Perfil.findAll();

      return res.json(perfil);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { id_perfil } = req.params;
      const { descricao } = req.body;

      const obj = await Perfil.findByPk(id_perfil);
      if (!obj)
        return res.status(404).json({ error: "Perfil não encontrado!" });

      const perfil = await Perfil.update(
        {
          descricao,
          data_alteracao: new Date(),
        },
        {
          where: { id_perfil },
        }
      );

      return res.json({
        retorno: perfil,
        mensagem:
          perfil == 1
            ? "Atualizado com sucesso!"
            : "Houve um problema na atualização",
      });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const { id_perfil } = req.params;

      const obj = await Perfil.findByPk(id_perfil);
      if (!obj)
        return res.status(404).json({ error: "Perfil não encontrado!" });

      await Perfil.destroy({ where: { id_perfil } });
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
};
