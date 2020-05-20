const express = require("express");
const PerfilController = require("./controllers/PerfilController");
const AcessoController = require("./controllers/AcessoController");

const routes = express.Router();

routes.post("/perfil", PerfilController.store);
routes.get("/perfil", PerfilController.index);
routes.put("/perfil/:id_perfil", PerfilController.update);
routes.delete("/perfil/:id_perfil", PerfilController.delete);

routes.post("/acesso", AcessoController.store);
routes.get("/perfil/:id_perfil/acesso", AcessoController.index);
routes.put("/acesso/:id_acesso", AcessoController.update);
routes.delete("/acesso/:id_acesso", AcessoController.delete);

module.exports = routes;
