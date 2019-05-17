const express = require('express');
const mustacheExpress = require('mustache-express'); 
const bodyParser = require('body-parser'); 
const { Client } = require('pg'); 
const pgCamelCase = require('pg-camelcase'); 

pgCamelCase.inject(require('pg'));

require('dotenv').config();

// console.log(process.env);

const app = express();

const mustache = mustacheExpress();
mustache.cache = null;

app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/books', (req, res) => {
	const client = new Client();
	client.connect()
		.then(() => {
			return client.query('SELECT * FROM books');
		})
		.then((results) => {
			res.render('book-list', {
				books: results.rows
			});
		})
		.catch((err) => {
			res.send('Something wrong');
		});
});

/**
 * Add Book
 */
app.get('/book/add', (req, res) => {
	res.render('book-form');
});

app.post('/book/add', (req, res) => {
	
	const client = new Client();

	client.connect()
		.then(() => {
			console.log('connection complete');
			
			const sql = 'insert into books(title, authors) values ($1, $2)';
			const params = [req.body.title, req.body.authors];

			return client.query(sql, params);
		})
		.then((result) => {
			console.log('result?', result);
			res.redirect('/books');
		})
		.catch((err) => {
			console.log('err', err);
			res.redirect('/books');
		});
});

/**
 * Delete book.
 */
app.post('/book/delete/:id', (req, res) => {
	console.log('delete', req.params.id);
	const client = new Client();

	client.connect()
		.then(() => {
			console.log('connection complete');
			const sql = 'DELETE FROM books WHERE book_id=$1';
			const params = [req.params.id];
			return client.query(sql, params);
		})
		.then((results) => {
			console.log('delete results?', results);
			res.redirect('/books');
		})
		.catch((err) => {
			console.log('err', err);
			res.redirect('/books');
		});

});

/**
 * Edit book.
 */
app.get('/book/edit/:id', (req, res) => {
	const client = new Client();

	client.connect()
		.then(() => {
			console.log('connection complete');
			const sql = 'SELECT * FROM books WHERE book_id = $1';
			const params = [req.params.id];
			return client.query(sql, params);
		})
		.then((results) => {

			/* if id isn't exist. */
			if (results.rowCount === 0) {
				res.redirect('/books');
				return;
			}

			console.log('edit results?', results);
			res.render('book-edit', {
				book: results.rows[0]
			});
		})
		.catch((err) => {
			console.log('err', err);
			res.redirect('/books');
		});
});

app.post('/book/edit/:id', (req, res) => {
	const client = new Client();
	client.connect()
		.then(() => {
			const sql = 'UPDATE books SET title=$1, authors=$2 WHERE book_id=$3';
			const params = [req.body.title, req.body.authors, req.params.id];
			return client.query(sql, params);
		})
		.then((results) => {
			console.log('update results', results);
			res.redirect('/books');
		})
		.catch((err) => {
			console.log('Error: ', err);
			res.redirect('/books');
		});
});

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});