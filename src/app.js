const express = require('express');
const methodOverride = require('method-override');
const path = require('path');

const productRoutes = require('./products/productRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.redirect('/products');
});

app.use('/products', productRoutes);

module.exports = app;

