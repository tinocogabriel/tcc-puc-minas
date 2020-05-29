const express = require("express");
const cors = require("cors");
const routes = require("./routes");
require('dotenv/config');

require("./database");

const app = express();

app.use(cors());
/*app.use(cors({
    origin: 'http://localhost:3000/'
}))*/

app.use(express.json());
app.use(routes);

//catch all
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: error.message,
    });
  });
  

app.listen(process.env.PORT || 3333);
