const express = require("express");
const PerfilController = require("./controllers/PerfilController");
const AcessoController = require("./controllers/AcessoController");
const ClienteController = require("./controllers/ClienteController");
const InstrutorController = require("./controllers/InstrutorController");
const AtividadeController = require("./controllers/AtividadeController");

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

routes.post("/instrutor", InstrutorController.store);
routes.get("/instrutor", InstrutorController.index);
routes.get("/instrutor/:indicador/:valor", InstrutorController.index);
routes.put("/instrutor/:id_instrutor/:id_acesso", InstrutorController.update);
routes.delete("/instrutor/:id_instrutor/:id_acesso", InstrutorController.delete);

routes.post("/atividade", AtividadeController.store);
routes.get("/atividade", AtividadeController.index);
routes.put("/atividade/:id_atividade", AtividadeController.update);
routes.delete("/atividade/:id_atividade", AtividadeController.delete);

module.exports = routes;
