import express from 'express';
import PM from './ProductManager.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

const productsManager = new PM();

app.get('/products/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products;
        if (!limit || isNaN(limit)) {
            products = await productsManager.getProducts();
        } else {
            const allProducts = await productsManager.getProducts();
            products = allProducts.slice(0, limit);
        }

        res.send(products);
    } catch (error) {
        console.error('ERROR al obtener productos', error);
        res.status(500).send('Error al obtener productos');
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const productById = await productsManager.getProductById(pid);
        res.send(productById);
    } catch (error) {
        console.error('ERROR al obtener el producto', error);
        res.status(500).send('Error al obtener el producto');
    }
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
