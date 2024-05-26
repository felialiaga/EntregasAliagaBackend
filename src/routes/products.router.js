import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";

const router = Router();

const manager = new ProductsManager();

router.get('/', async (req, res) => {
    const products = await manager.getProducts();

    res.send({status: 'success', payload: products})
});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;

    if(isNaN(id)) {
        return res.send({status: "error", mmessage: "The id has to be a number"});
    }

    const newId = parseInt(id);

    const products = await manager.getProducts();

    if(newId > products.length) {
        return res.send({status: "error", message: "Id not found"});
    };

    const findedProduct = products.find(product => product.id === newId);

    res.send({status: "success", payload: findedProduct});

});

router.post('/', async (req, res) => {
    const product = req.body;

    const result = await manager.createProduct(product);

    res.send({status: "success", message: `Product created with id ${result}`});
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const productUpdate = req.body;

    if(isNaN(id)) {
        return res.send({status: "error", mmessage: "The id has to be a number"});
    }

    const newId = parseInt(id);

    const products = await manager.getProducts();

    const productIndex = products.findIndex((product) => product.id === newId );

    const updatedProduct = {
        ...productUpdate,
        id: newId
    }

    products[productIndex] = updatedProduct;

    await manager.saveProducts(products);

    res.send({status: "success", message: `Product with id ${newId} has been updated successfully`});
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    if(isNaN(id)) {
        return res.send({status: "error", mmessage: "The id has to be a number"});
    }

    const newId = parseInt(id);

    const products = await manager.getProducts();

    const product = products.filter( prod => prod.id !== newId);

    if(product === null) {
        return res.send({status:"error", message: "Product not found"})
    }

    await manager.saveProducts(product);

    res.send({status: "succes", message: `Product with id ${newId}, has benn deleted successfully`})
});


export default router;