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
        error: "Usuário de acesso já existe!",
      });

    const clienteDuplicado = await Cliente.findOne({
      where: {
        cpf,
        id_perfil,
      },
    });

    if (clienteDuplicado)
      return res.status(404).json({
        error: "Existe um cliente cadastrado com esse CPF!",
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
        include: [
          {
            association: "acesso",
            attributes: ["usuario", "senha"],
          },
          {
            association: "perfil",
            attributes: ["descricao"],
          },
        ],
        where: {
          [indicador]: valor,
        },
      });

      return res.json(cliente);
    } else {
      const cliente = await Cliente.findAll({
        include: [
          {
            association: "acesso",
            attributes: ["usuario", "senha"],
          },
          {
            association: "perfil",
            attributes: ["descricao"],
          },
        ],
      });

      return res.json(cliente);
    }
  },
  async update(req, res) {
    const { nome, rg, cpf, endereco, id_perfil, usuario, senha } = req.body;
    const { id_cliente } = req.params;

    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente)
      return res.status(404).json({ error: "Cliente não encontrado!" });

    const usuarioDuplicado = await Acesso.findOne({
      where: {
        usuario,
        id_perfil,
        id_acesso: {
          [Op.ne]: cliente.id_acesso,
        },
      },
    });

    if (usuarioDuplicado)
      return res.status(404).json({
        error: "Usuário de acesso já existe!",
      });

    const clienteDuplicado = await Cliente.findOne({
      where: {
        cpf,
        id_perfil,
        id_cliente: {
          [Op.ne]: id_cliente,
        },
      },
    });

    if (clienteDuplicado)
      return res.status(404).json({
        error: "Existe um cliente cadastrado com esse CPF!",
      });

    const acesso = await Acesso.update(
      {
        usuario,
        senha,
        data_alteracao: new Date(),
      },
      {
        where: {
          id_acesso: cliente.id_acesso,
        },
      }
    );

    if (acesso != 1)
      return res.status(500).json({
        error: "Ocorreu um problema na atualização dos dados de acesso!",
      });

    const clienteUpdate = await Cliente.update(
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
      retorno: clienteUpdate,
      mensagem:
      clienteUpdate == 1
          ? "Atualizado com sucesso!"
          : "Houve um problema na atualização",
    });
  },
  async delete(req, res) {
    const { id_cliente } = req.params;

    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente)
      return res.status(404).json({ error: "Cliente não encontrado!" });

    await Cliente.destroy({ where: { id_cliente } });
    await Acesso.destroy({ where: { id_acesso: cliente.id_acesso } });

    return res.status(204).json();
  },
};
