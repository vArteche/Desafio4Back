const socket = io();

socket.emit('message', "Holaaaaaaa");

const form = document.getElementById('product-form');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(form);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });
        socket.emit('add-product', productData);
    });

    socket.on('products', (products) => {

        console.log('PRODUCTS AFTER ADD NEW PRODUCT',products)
        
        })