const express = require('express');
const mustacheExpress = require('mustache-express'); 
require('dotenv').config();

// console.log(process.env);

const app = express();

const mustache = mustacheExpress();
mustache.cache = null;

app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(express.static('public'));

app.get('/list', (req, res) => {
	res.render('list-page');
});

app.get('/book-form', (req, res) => {
	res.render('book-form');
});

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});