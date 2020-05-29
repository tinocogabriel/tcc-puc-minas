const Acesso = require("../models/Acesso");
const Perfil = require("../models/Perfil");

module.exports = {
  async index(req, res, next) {
    try {
      const { id_perfil } = req.params;

      if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf("Basic ") === -1
      )
        return res
          .status(401)
          .json({ message: "Sem Cabeçalho de Autorização" });

      const base64Credentials = req.headers.authorization.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [username, password] = credentials.split(":");

      const acesso = await Acesso.findOne({
        attributes: [
          "id_acesso",
          "usuario",
          "data_criacao",
          "data_alteracao",
          "id_perfil",
        ],
        include: [
          {
            association: "perfil",
            attributes: ["descricao"],
          },
        ],
        where: { usuario: username, senha: password, id_perfil },
      });

      if (!acesso)
        return res.status(401).json({ error: "Usuário não encontrado!" });

      return res.json(acesso);
    } catch (error) {
      next(error);
    }
  },
};
