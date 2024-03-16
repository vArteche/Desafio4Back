import fs from 'fs/promises';
import { Router } from 'express';
import express from 'express';

const app = express();
const router = Router();
const PORT = 8080
class ProductManager {
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
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Complete los campos obligatorios del nuevo producto.');
            }
            if (this.products.some(product => product.code === code)) {
                throw new Error('Este código de producto ya se encuentra registrado.');
            }
            const id = this.products.length + 1;
            const newProduct = { id, title, description, price, thumbnail, code, stock };
            this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            console.log(`Producto "${newProduct.title}" agregado correctamente`);
            this.products = products
        } catch (error) {
            console.error('ERROR al agregar el producto', error);
        }
        
    };
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
            
        } catch (error) {
            console.error("ERROR al leer el archivo", error);
            return [];
        }
        
    }
    async getProductById(id) {
        try {
            const products = await JSON.parse(await fs.readFile(this.path, "utf-8"));
            const productById = products.find(product => product.id == id);
            if (productById) {
                return productById;
            } else {
                console.log(products)
                throw new Error("Producto no encontrado.");
                
            }
        } catch (error) {
            throw new Error("Error al obtener el producto por ID: " + error.message);
        }
    }
    async updateProduct(id, updatedProductData) {
        try {
            let products = await this.getProducts();
            // Buscar el producto por ID
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error(`No se encontró un producto con el ID ${id}`);
            }
            products[index] = { ...products[index], ...updatedProductData };
            await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
            this.products = products
            console.log(`Producto con ID ${id} actualizado correctamente`);
        } catch (error) {
            console.error('ERROR al actualizar el producto', error);
        }
    }
    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            // Buscar el producto por ID
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error(`No se encontró un producto con el ID ${id}`);
            }
            products.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
            console.log(`Producto con ID ${id} eliminado correctamente`);
            this.products = products
        } catch (error) {
            console.error('ERROR al eliminar el producto', error);
        }
    }
}

const productsManager = new ProductManager();

router.get('/api/products/', async (req, res) => {
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

router.get('/api/products/:pid', async (req, res) => {
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

router.post('/api/products/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return res.status(400).send({ error: "Faltan datos para crear el producto." });
        }
        const newProduct = await productsManager.addProduct({ title, description, price, thumbnail, code, stock });
        res.status(201).send({ message: "Producto creado correctamente!", product: newProduct });
    } catch (error) {
        console.error('ERROR al agregar el producto', error);
        res.status(500).send('Error al agregar el producto');
    }
});

router.put('/api/products/:pid', async (req, res)=>{
    try{
        const pid = parseInt(req.params.pid);
        const newData = req.body
        if(!pid || !newData){
            return res.status(400).send({error: 'Debe ingresar ID y datos del producto a modificar.'})
        }
        const updated = await productsManager.updateProduct(pid, newData);
        res.status(201).send({message: "Producto actualizado correctamente", product: updated})
    }catch(error){
        console.error('ERROR al actualizar el producto', error);
        res.status(500).send('Error al actualizar el producto');
    }
})

router.delete('/api/products/:pid', async (req, res)=>{
    try{
        const pid = parseInt(req.params.pid);
        if(!pid){
            return res.status(400).send('Debe proporcionar el ID del producto a eliminar.')
        }
        const del = productsManager.deleteProduct(pid);
        res.status(201).send({message: "Producto eliminado correctamente", product: del})
    }catch(error){
        console.error('Error al eliminar el producto', error);
        res.status(500).send('Error al eliminar el producto.')
    }
})

export default router;
