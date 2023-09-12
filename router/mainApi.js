const express = require('express');
const router = express.Router()
const { default: fetch } = require("node-fetch");
const slider = require('../models/main/slider');
const authApi = require('./authApi');
const taskApi = require('./taskApi');
const productApi = require('./productApi');
const formApi = require('./formApi');
const userApi = require('./userApi');
const sepidarFetch = require('../middleware/Sepidar');
const products = require('../models/product/products');
const productPrice = require('../models/product/productPrice');
const productCount = require('../models/product/productCount');
const customers = require('../models/auth/customers');
const schedule = require('node-schedule');
const bankAccounts = require('../models/product/bankAccounts');
const { ONLINE_URL} = process.env;

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
router.use('/user', userApi)
schedule.scheduleJob('0 0 * * *', async() => { 
    response = await fetch(ONLINE_URL+"/sepidar-product",
        {method: 'POST'});
    response = await fetch(ONLINE_URL+"/sepidar-price",
        {method: 'POST'});
    response = await fetch(ONLINE_URL+"/sepidar-quantity",
        {method: 'POST'});
    response = await fetch(ONLINE_URL+"/sepidar-users",
        {method: 'POST'});
 })
router.get('/sepidar-product', async (req,res)=>{
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
router.get('/sepidar-price', async (req,res)=>{
    try{
        const sepidarPriceResult = await sepidarFetch("data","/api/PriceNoteItems")

        //var successItem=[];
        //var failure = 0;
        await productPrice.deleteMany({})
        for(var i = 0;i<sepidarPriceResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
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
router.get('/sepidar-bank', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarBankResult = await sepidarFetch("data","/api/BankAccounts")

        //var successItem=[];
        //var failure = 0;
        await bankAccounts.deleteMany({})
        for(var i = 0;i<sepidarBankResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
            await bankAccounts.create({
                BankAccountID:sepidarBankResult[i].BankAccountID,
                DlCode:sepidarBankResult[i].DlCode,
                DlTitle:sepidarBankResult[i].DlTitle,
                CurrencyRef:sepidarBankResult[i].CurrencyRef})
                
        }
        res.json({sepidar:sepidarBankResult,failure:"failure"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-quantity', async (req,res)=>{
    try{
        const sepidarQuantityResult = await sepidarFetch("data","/api/Items/Inventories")

        //var successItem=[];
        //var failure = 0;
        await productCount.deleteMany({})
        for(var i = 0;i<sepidarQuantityResult.length;i++){
            sepidarQuantityResult[i].UnitRef!==3&&
            await productCount.create({
                quantity:sepidarQuantityResult[i].Qunatity,
                UnitRef:sepidarQuantityResult[i].UnitRef,
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
router.get('/sepidar-users', async (req,res)=>{
    try{ 
        const sepidarUsersResult = await sepidarFetch("data","/api/Customers")

        //var successItem=[];
        //var failure = 0;
        await customers.deleteMany({})
        for(var i = 0;i<sepidarUsersResult.length;i++){
            await customers.create({
                CustomerID:sepidarUsersResult[i].CustomerID,
                email:sepidarUsersResult[i].CustomerID+"@order.com",
                cName:sepidarUsersResult[i].Name,
                sName:sepidarUsersResult[i].LastName,
                phone:sepidarUsersResult[i].PhoneNumber,
                username:sepidarUsersResult[i].Title,
                meliCode:sepidarUsersResult[i].NationalID,
                Code:sepidarUsersResult[i].Code,
            date:new Date()})
                
        }
        res.json({sepidar:sepidarUsersResult,failure:"failure"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
module.exports = router;