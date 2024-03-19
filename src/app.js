import express from 'express';
import handlebars from 'express-handlebars';

import productRouter from './routes/products.js';
import CartRouter from './routes/cart.js';
import __dirname from './utils.js';

const app = express();
const PORT = 8080;

app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

const cartRouter = new CartRouter();
cartRouter.createCart();
cartRouter.getCart();
cartRouter.addProductToCart();

app.use(cartRouter.getRouter());

app.use('/api/products/', productRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
