const Perfil = require("../models/Perfil");

module.exports = {
  async store(req, res) {
    const { descricao } = req.body;

    const perfil = await Perfil.create({
      descricao,
      data_criacao: new Date(),
      data_alteracao: new Date(),
    });

    return res.json(perfil);
  },
  async index(req, res) {
    const perfil = await Perfil.findAll();

    return res.json(perfil);
  },
  async update(req, res) {
    const { id_perfil } = req.params;
    const { descricao } = req.body;

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
  },
  async delete(req, res) {
    const { id_perfil } = req.params;

    const obj = await Perfil.findByPk(id_perfil);
    if(!obj)
      return res.status(404).json({error: 'Perfil não encontrado!'});

    const perfil = await Perfil.destroy({ where: { id_perfil } });
    return res.status(204).json();
  },
};
