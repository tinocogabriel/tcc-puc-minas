const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Perfil = require("../models/Perfil");
const Acesso = require("../models/Acesso");

const connection = new Sequelize(dbConfig);

Perfil.init(connection);
Acesso.init(connection);

Perfil.associate(connection.models);
Acesso.associate(connection.models);

module.exports = connection;
