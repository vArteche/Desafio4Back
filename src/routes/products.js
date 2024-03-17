import express from 'express';
import fs from 'fs/promises';

const router = express.Router();

class ProductRouter {
    constructor() {
        this.path = "./products.json";
        this.products = [];
        this.initialize();
    }

    async initialize() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(data);
        } catch (error) {
            console.error("ERROR al inicializar los productos", error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        } catch (error) {
            console.error("ERROR al guardar los productos", error);
        }
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    async addProduct(productData) {
        const id = this.products.length + 1;
        const newProduct = { id, ...productData };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updatedProductData) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProductData };
            await this.saveProducts();
            return this.products[index];
        }
        throw new Error(`No se encontró un producto con el ID ${id}`);
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            await this.saveProducts();
            return deletedProduct;
        }
        throw new Error(`No se encontró un producto con el ID ${id}`);
    }
}

const productRouter = new ProductRouter();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products;
        if (!limit || isNaN(limit)) {
            products = await productRouter.getProducts();
        } else {
            products = await productRouter.getProducts().slice(0, limit);
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
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return res.status(400).send({ error: "Faltan datos para crear el producto." });
        }
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
