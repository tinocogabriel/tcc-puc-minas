require('dotenv/config');

module.exports = {
  dialect: "postgres",
  host: process.env.DB_HOST,//"localhost",
  username: process.env.DB_USERNAME,//"tinoco",
  password: process.env.DB_PASSWORD,//"123456789",
  database: process.env.DB_DATABASE,//"muscles_gym",
  define: {
    timestamps: false,
    underscored: true,
  },
};
