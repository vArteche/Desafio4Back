import express from 'express';
import PM from './src/ProductManager.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productsManager = new PM();

app.get('/api/products/', async (req, res) => {
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

app.get('/api/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const productById = await productsManager.getProductById(pid);
        if (productById) {
            res.send(productById);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('ERROR al obtener el producto', error);
        res.status(500).send('Error al obtener el producto');
    }
});

app.post('/api/products/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return res.status(400).send({ error: "Faltan datos para crear el producto!" });
        }
        const newProduct = await productsManager.addProduct({ title, description, price, thumbnail, code, stock });
        res.status(201).send({ message: "Producto creado correctamente!", product: newProduct });
    } catch (error) {
        console.error('ERROR al agregar el producto', error);
        res.status(500).send('Error al agregar el producto');
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
