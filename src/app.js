import express from 'express';
import handlebars from 'express-handlebars';
import { readFile } from 'fs/promises';
import { Server } from 'socket.io';

import productManager from './ProductManager.js';
import productRouter from './routes/products.js';
import CartRouter from './routes/cart.js';
import __dirname from './utils.js';
import viewsRouter from './routes/viewsRouter.js';

const app = express();
const PORT = 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

const filePath =`../Desafio4Back/products.json` ;
let products = [];

try {
    const jsonData = await readFile(filePath, 'utf-8');
    products = JSON.parse(jsonData);
} catch (error) {
    console.error('Error al leer el archivo JSON:', error);
}


const cartRouter = new CartRouter();
cartRouter.createCart();
cartRouter.getCart();
cartRouter.addProductToCart();
app.use(cartRouter.getRouter());


app.use('/api/products/', productRouter);


app.use('/', viewsRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


const socketServer = new Server(httpServer);

const ProductManager = new productManager;

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado!');

    socket.on('message', data =>{
        console.log('desde el cliente: ', data)
    });

    socket.on('add-product', async productData => {
        try {
            console.log('ProductData', productData);
            const newProduct = await ProductManager.addProduct(productData);
            console.log('Producto agregado correctamente:', newProduct);
            const products = await ProductManager.getProducts();
            socket.emit('products', products);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });
});

app.get('/', (req, res)=>{
    res.render('index', {products});
});

app.get('/realtimeproducts', (req, res)=>{
    res.render('realtimeproducts', {products});
});
