import express from 'express';
import PM from './src/ProductManager.js';
import cartRouter from './src/cart.js'
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/carts', cartRouter)

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
            return res.status(400).send({ error: "Faltan datos para crear el producto." });
        }
        const newProduct = await productsManager.addProduct({ title, description, price, thumbnail, code, stock });
        res.status(201).send({ message: "Producto creado correctamente!", product: newProduct });
    } catch (error) {
        console.error('ERROR al agregar el producto', error);
        res.status(500).send('Error al agregar el producto');
    }
});

app.put('/api/products/:pid', async (req, res)=>{
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

app.delete('/api/products/:pid', async (req, res)=>{
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

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
