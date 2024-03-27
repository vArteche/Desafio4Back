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
        const productsContainer = document.getElementById("productsContainer");
        let productHTML= "";
        products.forEach((product) => {
            productHTML += `
                <div class="productCard">
                    <img class="productThumbnail" src="${product.thumbnails}" alt="Image for ${product.title}">
                    <div class="productDetails">
                        <p class="productTitle">${product.title}</p>
                    </div>
                </div>`;
        });
        productsContainer.innerHTML = productHTML;
        console.log('PRODUCTS AFTER ADD NEW PRODUCT', products);
    });
    