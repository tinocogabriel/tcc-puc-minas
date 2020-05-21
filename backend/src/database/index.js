const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Perfil = require("../models/Perfil");
const Acesso = require("../models/Acesso");
const Cliente = require("../models/Cliente");
const Instrutor = require("../models/Instrutor");
const Atividade = require("../models/Atividade");

const connection = new Sequelize(dbConfig);

Perfil.init(connection);
Acesso.init(connection);
Cliente.init(connection);
Instrutor.init(connection);
Atividade.init(connection);

Perfil.associate(connection.models);
Acesso.associate(connection.models);
Cliente.associate(connection.models);
Instrutor.associate(connection.models);
Atividade.associate(connection.models);

module.exports = connection;
