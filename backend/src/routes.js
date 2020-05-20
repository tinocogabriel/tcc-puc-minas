const express = require("express");
const PerfilController = require("./controllers/PerfilController");
const AcessoController = require("./controllers/AcessoController");
const ClienteController = require("./controllers/ClienteController");

const routes = express.Router();

routes.post("/perfil", PerfilController.store);
routes.get("/perfil", PerfilController.index);
routes.put("/perfil/:id_perfil", PerfilController.update);
routes.delete("/perfil/:id_perfil", PerfilController.delete);

routes.get("/perfil/:id_perfil/acesso", AcessoController.index);

routes.post("/cliente", ClienteController.store);
routes.get("/cliente", ClienteController.index);
routes.get("/cliente/:indicador/:valor", ClienteController.index);
routes.put("/cliente/:id_cliente/:id_acesso", ClienteController.update);
routes.delete("/cliente/:id_cliente/:id_acesso", ClienteController.delete);

module.exports = routes;
