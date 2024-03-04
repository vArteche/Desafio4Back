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
            this.products = products
        } catch (error) {
            console.error("ERROR al leer el archivo", error);
            return [];
        }
        
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
            this.products = products
        } else {
            throw new Error("Producto no encontrado.");
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

// Uso

// const manager = new ProductManager();

// (async () => {
//     const productData = {
//         title: "Camiseta",
//         description: "Camiseta de algodón",
//         price: 19.99,
//         thumbnail: "camiseta.jpg",
//         code: "C001",
//         stock: 50,
//     };

//     await manager.addProduct(productData);

//     const productData2 = {
//         title: "Pantalón",
//         description: "Pantalón vaquero",
//         price: 31.99,
//         thumbnail: "pantalon.jpg",
//         code: "C002",
//         stock: 36,
//     };

//     await manager.addProduct(productData2);

//     const productList = await manager.getProducts();
//     console.log("Lista de productos:", productList);

//     const getById = manager.getProductById(1);
//     console.log("Producto con ID 1:", getById);

//     const updatedData = {
//         title: "Buzo",
//         price: 25.99,
//         stock: 60
//     };
//     await manager.updateProduct(1, updatedData);

//     await manager.deleteProduct(2);

//     const productData3 = {
//         title: "Remerón",
//         description: "Remerón Oversize de algodón",
//         price: 37.99,
//         thumbnail: "remeron.jpg",
//         code: "C003",
//         stock: 36,
//     }

//     await manager.addProduct(productData3);
    
//     const updatedProductList = await manager.getProducts();
//     console.log("Lista de productos actualizada:", updatedProductList);
// })();


export default ProductManager;
