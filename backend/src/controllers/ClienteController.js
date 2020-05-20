const { Op } = require("sequelize");
const Cliente = require("../models/Cliente");
const Perfil = require("../models/Perfil");
const Acesso = require("../models/Acesso");

module.exports = {
  async store(req, res) {
    const { nome, rg, cpf, endereco, id_perfil, usuario, senha } = req.body;

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
        error: "Já existe um registro com esse usuário para o mesmo perfil!",
      });

    const clienteDuplicado = await Cliente.findOne({
      where: {
        cpf,
      },
    });

    if (clienteDuplicado)
      return res.status(404).json({
        error: "Já existe um cliente cadastrado com esse CPF!",
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

    const cliente = await Cliente.create({
      id_acesso: acesso.id_acesso,
      nome,
      rg,
      cpf,
      endereco,
      id_perfil,
      data_criacao: new Date(),
      data_alteracao: new Date(),
    });

    return res.json({ cliente });
  },
  async index(req, res) {
    const { indicador, valor } = req.params;

    if (indicador && valor) {
      const cliente = await Cliente.findAll({
        include: {
          association: "acesso",
          attributes: ["id_acesso", "usuario", "senha"],
        },
        where: {
          [indicador]: valor,
        },
      });

      return res.json(cliente);
    } else {
      const cliente = await Cliente.findAll({
        include: {
          association: "acesso",
          attributes: ["usuario", "senha"],
        },
      });

      return res.json(cliente);
    }
  },
  async update(req, res) {
    const { nome, rg, cpf, endereco, id_perfil, usuario, senha } = req.body;
    const { id_cliente, id_acesso } = req.params;

    const usuarioDuplicado = await Acesso.findOne({
      where: {
        usuario,
        id_perfil,
        id_acesso: {
          [Op.ne]: id_acesso,
        },
      },
    });

    if (usuarioDuplicado)
      return res.status(404).json({
        error: "Já existe um registro com esse usuário para o mesmo perfil!",
      });

    const clienteDuplicado = await Cliente.findOne({
      where: {
        cpf,
        id_cliente: {
          [Op.ne]: id_cliente,
        },
      },
    });

    if (clienteDuplicado)
      return res.status(404).json({
        error: "Já existe um cliente cadastrado com esse CPF!",
      });

    const acesso = await Acesso.update(
      {
        usuario,
        senha,
        data_alteracao: new Date(),
      },
      {
        where: {
          id_acesso,
        },
      }
    );

    if (acesso != 1)
      return res.status(500).json({
        error: "Ocorreu um problema na atualização dos dados de acesso!",
      });

    const cliente = await Cliente.update(
      {
        nome,
        rg,
        cpf,
        endereco,
        data_alteracao: new Date(),
      },
      {
        where: {
          id_cliente,
        },
      }
    );

    return res.json({
      retorno: cliente,
      mensagem:
        cliente == 1
          ? "Atualizado com sucesso!"
          : "Houve um problema na atualização",
    });
  },
  async delete(req, res) {
    const { id_cliente, id_acesso } = req.params;

    const cliente = await Cliente.destroy({ where: { id_cliente } });
    const acesso = await Acesso.destroy({ where: { id_acesso } });

    return res.status(204).json();
  },
};
