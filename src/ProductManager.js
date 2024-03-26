import fs from 'fs/promises';
import __dirname from './utils.js';
class ProductManager {
    constructor() {
        this.path = "../Desafio4Back/products.json";
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

export default ProductManager;