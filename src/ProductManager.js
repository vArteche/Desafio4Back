import fs from 'fs/promises'

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
            // console.log("Productos inicializados:", this.products);
        } catch (error) {
            console.error("ERROR al inicializar los productos", error);
        }
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        
        // let products = await this.getProducts();

        try {
            // Validar campos obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Complete los campos obligatorios del nuevo producto.');
            }
            // Encontrar repeticiones de n° de código
            if (this.products.some(product => product.code === code)) {
                throw new Error('Este código de producto ya se encuentra registrado.');
            }
            // Generador de ID
            const id = this.products.length + 1;
            // Agregar el producto a la lista
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

            // Actualizar el producto
            products[index] = { ...products[index], ...updatedProductData };

            // Escribir la lista actualizada de productos de vuelta al archivo
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

            // Eliminar el producto
            products.splice(index, 1);

            // Escribir la lista actualizada de productos de vuelta al archivo
            await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
            console.log(`Producto con ID ${id} eliminado correctamente`);
            this.products = products
        } catch (error) {
            console.error('ERROR al eliminar el producto', error);
        }
    }
}
export default ProductManager;
