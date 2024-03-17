import express from 'express';
import productRouter from './routes/products.js';
import CartRouter from './routes/cart.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cartRouter = new CartRouter();
cartRouter.createCart();
cartRouter.getCart();
cartRouter.addProductToCart();

app.use(cartRouter.getRouter());

app.use('/api/products/', productRouter)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
