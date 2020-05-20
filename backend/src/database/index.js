const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Perfil = require("../models/Perfil");
const Acesso = require("../models/Acesso");
const Cliente = require("../models/Cliente");

const connection = new Sequelize(dbConfig);

Perfil.init(connection);
Acesso.init(connection);
Cliente.init(connection);

Perfil.associate(connection.models);
Acesso.associate(connection.models);
Cliente.associate(connection.models);

module.exports = connection;
