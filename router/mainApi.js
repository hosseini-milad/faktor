const express = require('express');
const router = express.Router()
const slider = require('../models/main/slider');
const authApi = require('./authApi');
const taskApi = require('./taskApi');
const productApi = require('./productApi');
const formApi = require('./formApi');
const sepidarFetch = require('../middleware/Sepidar');
const products = require('../models/product/products');
const productPrice = require('../models/product/productPrice');
const productCount = require('../models/product/productCount');

router.get('/main', async (req,res)=>{
    try{
        const sliders = await slider.find()

        //logger.warn("main done")
        res.json({sliders:sliders})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.use('/auth', authApi)
router.use('/task', taskApi)
router.use('/product', productApi)
router.use('/form', formApi)

router.post('/sepidar-product', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarResult = await sepidarFetch("data","/api/Items")
        await products.deleteMany({})
        var successItem=[];
        var failure = 0;
        for(var i = 0;i<sepidarResult.length;i++){
            const createResult = await products.create({
                sku:sepidarResult[i].Code,
                title:sepidarResult[i].Title,
                ItemID:sepidarResult[i].ItemID,
                date:new Date()})
                if(createResult)
                successItem.push(createResult)
        }
        res.json({sepidar:sepidarResult,failure:failure})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/sepidar-price', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarPriceResult = await sepidarFetch("data","/api/PriceNoteItems")

        //var successItem=[];
        //var failure = 0;
        await productPrice.deleteMany({})
        for(var i = 0;i<sepidarPriceResult.length;i++){
            sepidarPriceResult[i].SaleTypeRef===5&& 
            await productPrice.create({
                pID:sepidarPriceResult[i].Code,
                saleType:sepidarPriceResult[i].SaleTypeRef,
                price:sepidarPriceResult[i].Fee,
                ItemID:sepidarPriceResult[i].ItemRef,
                date:new Date()})
                
        }
        res.json({sepidar:sepidarPriceResult,failure:"failure"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/sepidar-quantity', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarQuantityResult = await sepidarFetch("data","/api/Items/Inventories")

        //var successItem=[];
        //var failure = 0;
        await productCount.deleteMany({})
        for(var i = 0;i<sepidarQuantityResult.length;i++){
            await productCount.create({
                quantity:sepidarQuantityResult[i].Qunatity,
                Stock:sepidarQuantityResult[i].StockeRef,
                ItemID:sepidarQuantityResult[i].ItemRef,
            date:new Date()})
                
        }
        res.json({sepidar:sepidarQuantityResult,failure:"failure"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
module.exports = router;