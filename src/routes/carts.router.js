import { Router } from "express";
import CartsManager from "../managers/CartsManager.js";

const router = Router();

const manager = new CartsManager();



router.get('/:cid', async (req, res) => {

    const id = req.params.cid;

    if(isNaN(id)){
        return res.send({status: "error", error: "The id has to be a number!"});
    } 

    const newId = parseInt(id);

    const cart = manager.getCartsById(id);

    if(cart == null) {
        return res.send({status:"error", error: "Cannot get cart!"});
    }

    const products = cart.products;

    if(products.length === 0) {
        return res.send({status: "error", error: "There are not products in the cart!"});
    }

    res.send({status: "success", payload: products});

});

router.post('/', async (req, res) => {
    const cart = await manager.createCart();

    if(cart === -1) {
        return res.send({status: 'error', error:'Couldnt create the cart'});
    }

    res.send({status: 'succes', message:`Cart created correctly with id ${cart}`});
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    if(isNaN(cid) || isNaN(pid)) {
        return res.send({status: 'error', error:'The id must be a number'})
    }

    const carts = await manager.addProductCart(cid, pid);

    if(!carts) {
        return res.send({status: 'error', error:"The cart doesn't exist"});
    }

    const result = await manager.saveCarts(carts);

    if(result === false) {
        return res.send({status: 'error', error:"The product could't be saved"});
    }

    res.send({status: 'success', message:`Product with id ${pid} was added to the cart with id ${cid}`});


});



export default router;