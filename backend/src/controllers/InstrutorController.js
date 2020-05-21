const { Op } = require("sequelize");
const Instrutor = require("../models/Instrutor");
const Perfil = require("../models/Perfil");
const Acesso = require("../models/Acesso");
const Atividade = require("../models/Atividade");

module.exports = {
  async store(req, res) {
    const { nome, rg, cpf, id_perfil, usuario, senha, atividades } = req.body;

    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil)
      return res.status(404).json({ error: "Perfil não encontrado!" });

    const usuarioDuplicado = await Acesso.findOne({
      where: {
        usuario,
        id_perfil,
      },
    });

    if (usuarioDuplicado)
      return res.status(404).json({
        error: "Usuário de acesso já existe!",
      });

    const instrutorDuplicado = await Instrutor.findOne({
      where: {
        cpf,
        id_perfil,
      },
    });

    if (instrutorDuplicado)
      return res.status(404).json({
        error: "Existe um instrutor cadastrado com esse CPF!",
      });

    const acesso = await Acesso.create({
      usuario,
      senha,
      id_perfil,
      data_criacao: new Date(),
      data_alteracao: new Date(),
    });

    if (!acesso)
      return res.status(500).json({
        error: "Ocorreu um problema na criação do acesso!",
      });

    const instrutor = await Instrutor.create({
      id_acesso: acesso.id_acesso,
      nome,
      rg,
      cpf,
      id_perfil,
      data_criacao: new Date(),
      data_alteracao: new Date(),
    });

    for (let i = 0, max = atividades.length; i < max; i++) {
      const atividade = await Atividade.findOne({
        where: {
          id_atividade: atividades[i],
        },
      });

      if (atividade) await instrutor.addAtividade(atividade);
    }

    return res.json({ instrutor });
  },
  async index(req, res) {
    const { indicador, valor } = req.params;

    if (indicador && valor) {
      const instrutor = await Instrutor.findAll({
        include: [
          {
            association: "acesso",
            attributes: ["usuario", "senha"],
          },
          {
            association: "perfil",
            attributes: ["descricao"],
          },
          {
            association: "atividade",
            attributes: ["id_atividade", "descricao"],
            through: {
              attributes: [],
            },
          },
        ],
        where: {
          [indicador]: valor,
        },
      });

      return res.json(instrutor);
    } else {
      const instrutor = await Instrutor.findAll({
        include: [
          {
            association: "acesso",
            attributes: ["usuario", "senha"],
          },
          {
            association: "perfil",
            attributes: ["descricao"],
          },
          {
            association: "atividade",
            attributes: ["id_atividade", "descricao"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      return res.json(instrutor);
    }
  },
  async update(req, res) {
    const { nome, rg, cpf, id_perfil, usuario, senha, atividades } = req.body;
    const { id_instrutor } = req.params;

    const instrutor = await Instrutor.findByPk(id_instrutor);
    if (!instrutor)
      return res.status(404).json({ error: "Instrutor não encontrado!" });

    const usuarioDuplicado = await Acesso.findOne({
      where: {
        usuario,
        id_perfil,
        id_acesso: {
          [Op.ne]: instrutor.id_acesso,
        },
      },
    });

    if (usuarioDuplicado)
      return res.status(404).json({
        error: "Usuário de acesso já existe!",
      });

    const instrutorDuplicado = await Instrutor.findOne({
      where: {
        cpf,
        id_perfil,
        id_instrutor: {
          [Op.ne]: id_instrutor,
        },
      },
    });

    if (instrutorDuplicado)
      return res.status(404).json({
        error: "Existe um instrutor cadastrado com esse CPF!",
      });

    const acesso = await Acesso.update(
      {
        usuario,
        senha,
        data_alteracao: new Date(),
      },
      {
        where: {
          id_acesso: instrutor.id_acesso,
        },
      }
    );

    if (acesso != 1)
      return res.status(500).json({
        error: "Ocorreu um problema na atualização dos dados de acesso!",
      });

    const instrutorUpdate = await Instrutor.update(
      {
        nome,
        rg,
        cpf,
        data_alteracao: new Date(),
      },
      {
        where: {
          id_instrutor,
        },
      }
    );

    await instrutor.setAtividade([]);

    for (let i = 0, max = atividades.length; i < max; i++) {
      const atividade = await Atividade.findOne({
        where: {
          id_atividade: atividades[i],
        },
      });

      if (atividade) await instrutor.addAtividade(atividade);
    }

    return res.json({
      retorno: instrutorUpdate,
      mensagem:
      instrutorUpdate == 1
          ? "Atualizado com sucesso!"
          : "Houve um problema na atualização",
    });
  },
  async delete(req, res) {
    const { id_instrutor } = req.params;

    const instrutor = await Instrutor.findByPk(id_instrutor);
    if (!instrutor)
      return res.status(404).json({ error: "Instrutor não encontrado!" });

    await Instrutor.destroy({ where: { id_instrutor } });
    await Acesso.destroy({ where: { id_acesso: instrutor.id_acesso } });

    return res.status(204).json();
  },
};
