import express from 'express';

const router = express.Router();

router.get('/', (req, res) =>{
    res.render('index', {products});
});

export default router;