const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const Sequelize = require('sequelize');

let app = express();

let urlOrigin = '';

if (process.env.NODE_ENV == "development") {
  urlOrigin = 'http://localhost:3000'
} else {
  urlOrigin = 'https://visualeasy.herokuapp.com'
}

let corsOptions = {
    origin: urlOrigin,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use(helmet.hidePoweredBy());
app.use(cors(corsOptions));
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