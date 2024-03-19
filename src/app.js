import express from 'express';
import handlebars from 'express-handlebars';
import { readFile } from 'fs/promises';

import productRouter from './routes/products.js';
import CartRouter from './routes/cart.js';
import __dirname from './utils.js';


const app = express();
const PORT = 8080;

app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const filePath =`../PrimeraPreEntrega/products.json` ;
let products = [];

try {
    const jsonData = await readFile(filePath, 'utf-8');
    products = JSON.parse(jsonData);
    console.log('Productos cargados:', products);
} catch (error) {
    console.error('Error al leer el archivo JSON:', error);
}


//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.get('/', (req, res)=>{
    res.render('index', {products});
});

app.get('/realtimeproducts', (req, res)=>{
    res.render('index', {products});
})



const cartRouter = new CartRouter();
cartRouter.createCart();
cartRouter.getCart();
cartRouter.addProductToCart();

app.use(cartRouter.getRouter());

app.use('/api/products/', productRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
