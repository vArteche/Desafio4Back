import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();


const productRouter = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products = await productRouter.getProducts();
        if (limit && !isNaN(limit)) {
            products = products.slice(0, limit);
        }
        res.send(products);
        } catch (error) {
            console.error('ERROR al obtener productos', error);
            res.status(500).send('Error al obtener productos');
        }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productRouter.getProductById(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('ERROR al obtener el producto', error);
        res.status(500).send('Error al obtener el producto');
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        if (!title || !description || !price || !code || !stock) {
            return res.status(400).send({ error: "Faltan datos para crear el producto." });
        }
        // Verificar si el código ya existe en la lista de productos
        if (productRouter.products.some(product => product.code === code)) {
            return res.status(400).send({ error: "El código ingresado ya le pertenece a un producto." });
        }
        thumbnail ? thumbnail : [];

        const newProduct = await productRouter.addProduct({ title, description, price, thumbnail, code, stock });
        res.status(201).send({ message: "Producto creado correctamente!", product: newProduct });
    } catch (error) {
        console.error('ERROR al agregar el producto', error);
        res.status(500).send('Error al agregar el producto');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updatedProductData = req.body;
        const updatedProduct = await productRouter.updateProduct(pid, updatedProductData);
        res.status(200).send({ message: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
        console.error('ERROR al actualizar el producto', error);
        res.status(500).send('Error al actualizar el producto');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const deletedProduct = await productRouter.deleteProduct(pid);
        res.status(200).send({ message: "Producto eliminado correctamente", product: deletedProduct });
    } catch (error) {
        console.error('Error al eliminar el producto', error);
        res.status(500).send('Error al eliminar el producto.')
    }
});

export default router;
