'use strict'

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.get('/', pol);

function pol(){
  
}

app.listen(PORT, () => console.log(`App is up on ${PORT}`));
