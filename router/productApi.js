const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
const logger = require('../middleware/logger');
const productSchema = require('../models/product/products');
const category = require('../models/product/category');
const cart = require('../models/product/cart');
const FaktorSchema = require('../models/product/faktor');

router.post('/products', async (req,res)=>{
    try{
        const allProducts = await productSchema.find()

        //logger.warn("main done")
        res.json({products:allProducts})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/find-products', async (req,res)=>{
    const search = req.body.search
    try{ 
        const searchProducts = await productSchema.
        aggregate([{$match:
            {$or:[
                {sku:{$regex: search, $options : 'i'}},
                {title:{$regex: search, $options : 'i'}}
            ]}
        },
        {$lookup:{
            from : "productprices", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "priceData"
        }},
        {$limit:6}])
            
        //logger.warn("main done")
        res.json({products:searchProducts})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-product',jsonParser,auth, async (req,res)=>{
    const data={
        title:req.body.title,
        sku:req.body.sku,
        date:Date.now()
    }
    try{
        var status = "";
        const searchProduct = await productSchema.findOne({sku:data.sku})
        if(!searchProduct){
            await productSchema.create(data)
            status = "new product"
        }
        else{
            await productSchema.updateOne(
                {sku:data.sku},{$set:data})
            status = "update product"
        }
        const allProducts = await productSchema.find()
        //logger.warn("main done")
        res.json({products:allProducts,status:status})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/categories', async (req,res)=>{
    try{
        const allCategories = await category.find()

        //logger.warn("main done")
        res.json({categories:allCategories})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-category',jsonParser,auth, async (req,res)=>{
    const data={
        title:req.body.title,
        parent:req.body.parent,
        body:req.body.body,
        date:Date.now()
    }
    try{
        var status = "";
        const searchCategory = await category.findOne({catCode:req.body.catCode})
        if(!searchCategory){
            await category.create(data)
            status = "new category"
        }
        else{
            await category.updateOne(
                {catCode:req.body.catCode},{$set:data})
            status = "update category"
        }
        const allCategory = await category.find()
        res.json({categories:allCategory,status:status})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/cart', async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    try{
        const cartData = await cart.findOne({userId:userId}).sort({"date":1})
        var cartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        res.json({cart:cartData,...cartDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const findCartSum=(cartItems)=>{
    var cartSum=0;
    var cartCount=0;
    for (var i=0;i<cartItems.length;i++){
        cartSum+= parseInt(cartItems[i].price.toString().replace( /^\D+/g, ''))*
        parseInt(cartItems[i].count.toString().replace( /^\D+/g, ''))
        cartCount+=parseInt(cartItems[i].count.toString().replace( /^\D+/g, ''))
    }
    return({totalPrice:cartSum,totalCount:cartCount})
}
router.post('/update-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],

        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const cartData = await cart.findOne({userId:data.userId})
        const cartItems = createCart(cartData,req.body.cartItem)
        data.cartItems =(cartItems)
        if(!cartData){
            await cart.create(data)
            status = "new Cart"
        }
        else{
            await cart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        }
        var cartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        
        const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        res.json({cart:cartNewData,status:status,data:data,...cartDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const createCart=(cartData,cartItem)=>{
    var cartItemTemp=(cartData&&cartData.cartItems)?cartData.cartItems:[]
    cartItemTemp.push({...cartItem,date:Date.now()})
    
    return(cartItemTemp)

}

router.post('/faktor', async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    try{
        const faktorList = await FaktorSchema.find({userId:userId}).sort({"date":1})

        //logger.warn("main done")
        res.json({faktor:faktorList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-faktor',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],
        faktorItems:req.body.faktorItems,
        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        //const cartData = await cart.findOne({userId:data.userId})
        //const cartItems = createCart(cartData,req.body.cartItem)
        //data.cartItems =(cartItems)
        //if(!cartData){
            const faktorNo= await createfaktorNo("F","02","21")
            data.faktorNo=faktorNo
            const faktorDetail = findCartSum(data.faktorItems)
            
            const addFaktorResult = await FaktorSchema.create({...data,...faktorDetail})
            status = "new Faktor"
            await cart.deleteOne({userId:data.userId})
        //}
        /*else{
            await cart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        }*/
        //const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        res.json({status:addFaktorResult,data:data,message:"فاکتور ثبت شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const createfaktorNo= async(Noun,year,userCode)=>{
    var faktorNo = '';
    for(var i=0;i<10;i++){
        faktorNo = Noun+year+userCode+
        Math.floor(Math.random()* (99999 - 10000) + 10000)
        const findFaktor = await FaktorSchema.findOne({faktorNo:faktorNo})
        if(!findFaktor)
            return(faktorNo)
    }
}

module.exports = router;