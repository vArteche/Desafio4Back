import express from 'express';
import PM from './ProductManager.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended : true}));

const products = new PM;

app.get('/products/', (req, res)=>{
    let limit = req.query;

    if(!limit){
        res.send(products)
    }else{
        // let i = 0;
        // for(products[i]; products[limit]; i++){
        //     products.forEach(product => {
        //         return product;
        //     });
        // }
    }
})

    

app.listen(PORT, ()=>[
    console.log(`Listening on port ${PORT}`)
])