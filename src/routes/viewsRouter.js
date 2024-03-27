import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

async function renderProductsView(req, res, viewName) {
    try {
        const products = await productManager.getProducts();
        res.render(viewName, { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
}

router.get('/', async (req, res) => {
    await renderProductsView(req, res, 'index');
});

router.get('/realtimeproducts', async (req, res) => {
    await renderProductsView(req, res, 'realtimeproducts');
});

export default router;
