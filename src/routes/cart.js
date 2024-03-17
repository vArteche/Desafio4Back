import fs from 'fs/promises';
import { Router } from 'express';

const router = Router();

function generateId() {
    return Math.random().toString(36).substring(2,9);
};

class CartRouter {
    constructor (){
        this.path = `./cart.json`;
        this.cart = [];
    }

    createCart() {
        router.post('/api/carts/', async (req, res) => {
            try {
                const cartId = generateId();
                const newCart = { id: cartId, products: [] };
                await fs.writeFile(`./carrito-${cartId}.json`, JSON.stringify(newCart, null, 2));
                console.log('Carrito creado:', newCart);
                res.status(201).send({ message: "Carrito creado correctamente", cartId });
            } catch (error) {
                console.error('ERROR al crear el carrito', error);
                res.status(500).send('Error al crear el carrito');
            }
        });
    }

    getCart(){
        router.get('/api/carts/:cid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const cartData = await fs.readFile(`./carrito-${cartId}.json`, 'utf-8');
                const cart = JSON.parse(cartData);
                res.send(cart.products);
            } catch (error) {
                console.error('ERROR al obtener los productos del carrito', error);
                res.status(500).send('Error al obtener los productos del carrito');
            }
        });
    }

    addProductToCart(){
        router.post('/api/carts/:cid/product/:pid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const productId = req.params.pid;
                const quantity = parseInt(req.body.quantity) || 1;
        
                const cartData = await fs.readFile(`./carrito-${cartId}.json`, 'utf-8');
                const cart = JSON.parse(cartData);
        
                const existingProductIndex = cart.products.findIndex(product => product.id === productId);
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push({ id: productId, quantity });
                }
        
                await fs.writeFile(`./carrito-${cartId}.json`, JSON.stringify(cart, null, 2));
        
                res.status(201).send({ message: "Producto agregado al carrito correctamente", cart });
            } catch (error) {
                console.error('ERROR al agregar el producto al carrito', error);
                res.status(500).send('Error al agregar el producto al carrito');
            }
        });
    }

    getRouter() {
        return router;
    }
}

export default CartRouter;
