const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
const logger = require('../middleware/logger');
const productSchema = require('../models/product/products');
const productcounts = require('../models/product/productCount');
const category = require('../models/product/category');
const cart = require('../models/product/cart');
const FaktorSchema = require('../models/product/faktor');
const customerSchema = require('../models/auth/customers');
const sepidarPOST = require('../middleware/SepidarPost');
const productCount = require('../models/product/productCount');
const cartLog = require('../models/product/cartLog');
const users = require('../models/auth/users');

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
        {$lookup:{
            from : "productcounts", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "countData"
        }}])
        var searchProductResult=[]
        for(var i=0;i<searchProducts.length;i++){
            var count = (searchProducts[i].countData.find(item=>item.Stock==='13'))
            if(count&&count.quantity){
                searchProductResult.push({...searchProducts[i],count:count})
            }
        }
        res.json({products:searchProductResult})
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
    if(!cartItems)return({totalPrice:0,totalCount:0})
    var cartSum=0;
    var cartCount=0;
    for (var i=0;i<cartItems.length;i++){
        cartSum+= parseInt(cartItems[i].price.toString().replace( /^\D+/g, ''))*
        parseInt(cartItems[i].count.toString().replace( /^\D+/g, ''))
        cartCount+=parseInt(cartItems[i].count.toString().replace( /^\D+/g, ''))
    }
    return({totalPrice:cartSum,totalCount:cartCount})
}
router.post('/cartlist', async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    try{
        const cartList = await cart.aggregate
        ([
            { $addFields: { "userId": { "$toObjectId": "$userId" }}},
        {$lookup:{
            from : "customers", 
            localField: "userId", 
            foreignField: "_id", 
            as : "userData"
        }},
    {$limit:10}])
        for(var i = 0;i<cartList.length;i++){
            if(cartList[i].cartItems&&cartList[i].cartItems.length){
                var cartResult = findCartSum(cartList[i].cartItems)
                cartList[i].countData=cartResult
            }
            else{
                cartList.splice(i,1)
            }
        }
        res.json({cart:cartList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/update-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],

        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const cartData = await cart.findOne({userId:data.userId})
        const availItems = await checkAvailable(req.body.cartItem)
        if(!availItems){
            res.status(400).json({error:"موجودی کافی نیست"}) 
            return
        }

        const cartItems = createCart(cartData,req.body.cartItem)
        data.cartItems =(cartItems)
        if(!cartData){
            cartLog.create({...data,ItemID:req.body.cartItem,action:"create"})
            await cart.create(data)
            status = "new Cart"
        }
        else{
            cartLog.create({...data,ItemID:req.body.cartItem,action:"update"})
            await cart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        }
        var cartDetail = ''
        cartDetail =findCartSum(cartItems)
        
        const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        res.json({cart:cartNewData,status:status,availItems:availItems,data:data,...cartDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/edit-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],

        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const cartData = await cart.findOne({userId:data.userId})
        const cartItems = editCart(cartData,req.body.cartItem)
        data.cartItems =(cartItems)
            await cart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        var cartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        
        const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        res.json({cart:cartNewData,status:status,data:data,...cartDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const checkAvailable= async(items)=>{
    const existItem = await productcounts.findOne({ItemID:items.id,Stock:"13"})
    if(compareCount(existItem.quantity,items.count))
    return(compareCount(existItem.quantity,items.count))
}
const createCart=(cartData,cartItem)=>{
var cartItemTemp=cartData?cartData.cartItems:[]
    var repeat = 0
    for(var i=0;i<cartItemTemp.length;i++){
        if(cartItemTemp[i].id===cartItem.id){
            cartItemTemp[i].count=parseInt(cartItemTemp[i].count)+
                                  parseInt(cartItem.count)
            repeat=1
            break
        }
    }
    !repeat&&cartItemTemp.push({...cartItem,date:Date.now()})
    return(cartItemTemp)

}
const removeCart=(cartData,cartID)=>{
    if(!cartData||!cartData.cartItems)return([])
var cartItemTemp=cartData.cartItems
    for(var i=0;i<cartItemTemp.length;i++){
        if(cartItemTemp[i].id===cartID){
            cartItemTemp.splice(i,1)
            return(cartItemTemp)
        }
    }
}
const editCart=(cartData,cartItem)=>{
    if(!cartData||!cartData.cartItems)return([])
var cartItemTemp=cartData.cartItems
    for(var i=0;i<cartItemTemp.length;i++){
        if(cartItemTemp[i].id===cartItem.id){
            cartItemTemp[i].count = cartItem.count
            return(cartItemTemp)
        }
    }
}


router.post('/remove-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],

        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const cartData = await cart.findOne({userId:data.userId})
        const cartItems = removeCart(cartData,req.body.cartID)
        data.cartItems =(cartItems)
        //console.log(req.body.cartItem)
        cartLog.create({...data,ItemID:req.body.cartID,action:"delete"})
            await cart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        var cartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        
        const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        res.json({cart:cartNewData,status:status,data:data,...cartDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/faktor', async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    try{
        const faktorList = await FaktorSchema.aggregate
        ([{$match:{userId:userId},
        },
        {$lookup:{
            from : "customers", 
            localField: "customerID", 
            foreignField: "CustomerID", 
            as : "userData"
        }},
        {$lookup:{
            from : "productcounts", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "countData"
        }},
    {$limit:10}])
        //logger.warn("main done")
        res.json({faktor:faktorList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/faktor-find', async (req,res)=>{
    const faktorId =req.body.faktorId;
    try{
        const faktorData = await //FaktorSchema.findOne({faktorNo:faktorId})
        FaktorSchema.aggregate
        ([{$match:{faktorNo:faktorId},
        },
        {$lookup:{
            from : "customers", 
            localField: "customerID", 
            foreignField: "CustomerID", 
            as : "userData"
        }}])
        //logger.warn("main done")
        res.json({faktor:faktorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-faktor',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],
        faktorItems:req.body.faktorItems,
        customerID:req.body.customerID,
        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        const faktorNo= await createfaktorNo("F","02","21")
        data.faktorNo=faktorNo
        const faktorDetail = findCartSum(data.faktorItems)
        const SepidarFaktor = await SepidarFunc({...data,...faktorDetail})
        const addFaktorResult = await sepidarPOST(SepidarFaktor,"/api/invoices")
        if(addFaktorResult.Message){
            res.status(400).json({error:addFaktorResult.Message})
            return
        }
        else{
            await updateCount(data.faktorItems)
            await cart.deleteOne({userId:data.userId})
            await FaktorSchema.create(
                {...data,...faktorDetail,InvoiceNumber:addFaktorResult.Number,
                    InvoiceID:addFaktorResult.InvoiceID})
                //console.log(addFaktorResult)
            res.json({sepidar:addFaktorResult,data:data,message:"فاکتور ثبت شد"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const SepidarFunc=async(data)=>{
    var query ={
        "GUID": "124ab075-fc79-417f-b8cf-2a"+data.faktorNo,
        "CustomerRef": toInt(data.customerID),
        "CurrencyRef":1,
        "SaleTypeRef": 4,
        "Price": data.totalPrice,
        "Tax":  toInt(data.totalPrice,"0.09"),
        "Duty":0.0000,
        "Discount": 0.0000,
        "Items": 
          data.faktorItems.map((item,i)=>(
            {
            "ItemRef": toInt(item.id),
            "TracingRef": null,
            "TracingTitle": null,
            "StockRef":13,
            "Quantity": toInt(item.count),
            "SecondaryQuantity": 1.0000,
            "Fee": toInt(item.price),
            "Price": toInt(item.price,item.count),
            "Discount": 0.0000,
            "Tax": toInt(item.price,"0.09"),
            "Duty": 0.0000,
            "Addition": 0.0000,
            "NetPrice": 0.0000
          }))
        
      }
    return(query)
}
const updateCount = async(items)=>{
    for(var i=0;i<items.length;i++){
        console.log(items[i].count,toInt(items[i].count,"1",-1))
        await productCount.updateOne({ItemID:items[i].id,Stock:"13"},
            {$inc:{quantity:toInt(items[i].count,"1",-1)}})
    }
}
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
const toInt=(strNum,count,align)=>{
    if(!strNum)return(0)
    
    return(parseInt(parseInt((align?"-":'')+strNum)*
    (count?parseFloat(count):1)))
}
const minusInt=(quantity,minus)=>{
    if(!quantity)return(0)
    
    return(parseInt(quantity.replace(/\D/g,''))-
    parseInt(minus.replace(/\D/g,'')))
}
const compareCount=(count1,count2)=>{
    return(parseInt(count1.toString().replace(/\D/g,''))>=
    (parseInt(count2.toString().replace(/\D/g,''))))
}
router.post('/customer-find', async (req,res)=>{
    const search = req.body.search
    try{ 
        var searchCustomer = await users.
        aggregate([{$match:
            {$or:[
                {username:{$regex: search, $options : 'i'}},
                {Code:{$regex: search, $options : 'i'}}
            ]}
        },
        {$limit:6}])
        if(!searchCustomer.length){
            searchCustomer = await customerSchema.
            aggregate([{$match:
                {$or:[
                    {username:{$regex: search, $options : 'i'}},
                    {Code:{$regex: search, $options : 'i'}}
                ]}
            },
            {$limit:6}])
        }
            
        //logger.warn("main done")
        res.json({customers:searchCustomer})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;