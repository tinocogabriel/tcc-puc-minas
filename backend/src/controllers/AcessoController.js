const Acesso = require("../models/Acesso");
const Perfil = require("../models/Perfil");

module.exports = {
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
};
