const Acesso = require("../models/Acesso");
const Perfil = require("../models/Perfil");

module.exports = {
  async store(req, res) {
    const { usuario, senha, id_perfil } = req.body;

    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil)
      return res.status(400).json({ error: "Perfil não encontrado!" });

    const acesso = await Acesso.create({
      usuario,
      senha,
      id_perfil,
      data_criacao: new Date(),
      data_alteracao: new Date(),
    });

    return res.json(acesso);
  },
  async index(req, res) {
    const { id_perfil } = req.params;

    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    )
      return res.status(401).json({ message: "Sem Cabeçalho de Autorização" });

    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    const acesso = await Acesso.findAll({
      include: [
        {
          association: "perfil",
          attributes: ["descricao"],
        },
      ],
      where: { usuario: username, senha: password, id_perfil },
    });

    return res.json(acesso);
  },
  async update(req, res) {
    const { usuario, senha } = req.body;
    const { id_acesso } = req.params;

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
    return res.json({
      retorno: acesso,
      mensagem:
        acesso == 1
          ? "Atualizado com sucesso!"
          : "Houve um problema na atualização",
    });
  },
  async delete(req, res) {
    const { id_acesso } = req.params;

    const obj = await Acesso.findByPk(id_acesso);
    if (!obj) return res.status(404).json({ error: "Acesso não encontrado!" });

    const acesso = await Acesso.destroy({ where: { id_acesso } });
    return res.status(204).json();
  },
};
