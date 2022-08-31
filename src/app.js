const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const Sequelize = require('sequelize');

let app = express();

let allowlist = [
  'https://visualeasy-controle.herokuapp.com/',
  'https://visualeasy-controle.herokuapp.com/variavel/create',
  'https://visualeasy-controle.herokuapp.com/variavel/getNamesByName',
  'https://visualeasy-controle.herokuapp.com/variavel/filtered',
  'https://visualeasy-controle.herokuapp.com/variavel/filteredByPeriod',
]
let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(helmet.hidePoweredBy());
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());
app.use(routes);
if (process.env.NODE_ENV == "development") {
    const sequelize = new Sequelize(db);
} else {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}

module.exports = app;