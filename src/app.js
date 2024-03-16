import express from 'express';
import productRouter from './routes/products.js';
import cartRouter from './routes/cart.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/carts', cartRouter)

app.use('/api/products', productRouter)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
