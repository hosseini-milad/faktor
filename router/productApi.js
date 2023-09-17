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
const qCart = require('../models/product/quickCart');
const FaktorSchema = require('../models/product/faktor');
const customerSchema = require('../models/auth/customers');
const sepidarPOST = require('../middleware/SepidarPost');
const productCount = require('../models/product/productCount');
const cartLog = require('../models/product/cartLog');
const users = require('../models/auth/users');
const quickCart = require('../models/product/quickCart');
const bankAccounts = require('../models/product/bankAccounts');
const sepidarFetch = require('../middleware/Sepidar');

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
        const qCartData = await qCart.findOne({userId:userId}).sort({"date":1})
        var cartDetail = ''
        var qCartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        if(qCartData) qCartDetail =findCartSum(qCartData.cartItems)
        res.json({cart:cartData,...cartDetail,
            quickCart:qCartData,qCartDetail:qCartDetail})
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
        { $addFields: { "manageId": { "$toObjectId": "$manageId" }}},
        {$lookup:{
            from : "customers", 
            localField: "userId", 
            foreignField: "_id", 
            as : "userData"
        }},
        {$lookup:{
            from : "users", 
            localField: "userId", 
            foreignField: "_id", 
            as : "adminData"
        }},
        {$lookup:{
            from : "users", 
            localField: "manageId", 
            foreignField: "_id", 
            as : "managerData"
        }},
    {$limit:10}])
    var cartTotal={cartPrice:0,cartCount:0}
        for(var i = 0;i<cartList.length;i++){
            if(cartList[i].cartItems&&cartList[i].cartItems.length){
                var cartResult = findCartSum(cartList[i].cartItems)
                cartList[i].countData=cartResult
            }
            else{
                cartList.splice(i,1)
            }
        }
        for(var i=0;i<cartList.length;i++){
            cartTotal.cartPrice+=cartList[i].countData.totalPrice;
            cartTotal.cartCount+=cartList[i].countData.totalCount;
        }
        res.json({cart:cartList,
            cartTotal:cartTotal})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/update-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],
        manageId:req.headers['userid'],
        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const cartData = await cart.findOne({userId:data.userId})
        const qCartData = await quickCart.findOne({userId:data.userId})
        const availItems = await checkAvailable(req.body.cartItem)
        if(!availItems){
            res.status(400).json({error:"موجودی کافی نیست"}) 
            return
        }

        const cartItems = createCart(qCartData?qCartData.cartItems:[],req.body.cartItem)
        data.cartItems =(cartItems)
        if(!qCartData){
            cartLog.create({...data,ItemID:req.body.cartItem,action:"create"})
            await quickCart.create(data)
            status = "new Cart"
        }
        else{
            cartLog.create({...data,ItemID:req.body.cartItem,action:"update"})
            await quickCart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        }
        var cartDetail = ''
        var qCartDetail = ''
        cartDetail =findCartSum(cartData&&cartData.cartItems)
        
        const cartNewData = await quickCart.findOne({userId:data.userId}).sort({"date":1})
        if(cartNewData) qCartDetail =findCartSum(cartNewData.cartItems)

        res.json({quickCart:cartNewData,status:status,availItems:availItems,
            data:data,...cartDetail,cart:cartData,qCartDetail:qCartDetail})
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
        const qCartData = await quickCart.findOne({userId:data.userId})
        const cartItems = editCart(qCartData,req.body.cartItem)
        data.cartItems =(cartItems)
            await quickCart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        var cartDetail = ''
        var qCartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        
        const cartNewData = await quickCart.findOne({userId:data.userId}).sort({"date":1})
        if(qCartData) qCartDetail =findCartSum(cartNewData.cartItems)
        
        res.json({quickCart:cartNewData,status:status,
            data:data,...cartDetail,cart:cartData,qCartDetail:qCartDetail})
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
var cartItemTemp=cartData?cartData:[]
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
const removeCartCount=(cartData,cartID,count)=>{
    if(!cartData||!cartData.cartItems)return([])
var cartItemTemp=cartData.cartItems
    for(var i=0;i<cartItemTemp.length;i++){
        if(cartItemTemp[i].id===cartID){
            cartItemTemp[i].count= parseInt(cartItemTemp[i].count)-parseInt(count)
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
const totalCart=(cartArray)=>{
    var cartListTotal =[]
    for(var i =0;i<cartArray.length;i++){
        const userCode = cartArray[i].adminData[0]?
            cartArray[i].adminData[0].CustomerID:
            cartArray[i].userData[0].CustomerID
        var repeat=0
        for(var j=0;j<cartListTotal.length;j++)
            if(userCode&&(userCode===cartListTotal[j].userId)){
                cartListTotal[j].cartItems.push(
                    ...cartArray[i].cartItems)
                cartListTotal[j].userTotal +="|"+cartArray[i].userId
                repeat=1
            break
        }
        !repeat&&cartListTotal.push({userId:userCode,userTotal:cartArray[i].userId,
            cartItems:cartArray[i].cartItems})
    }
    return(cartListTotal)
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
        const qCartData = await quickCart.findOne({userId:data.userId})
        const cartItems = removeCart(qCartData,req.body.cartID)
        data.cartItems =(cartItems)
        //console.log(req.body.cartItem)
        cartLog.create({...data,ItemID:req.body.cartID,action:"delete"})
            await quickCart.updateOne(
                {userId:data.userId},{$set:data})
            status = "update cart"
        var cartDetail = ''
        var qCartDetail = ''
        if(cartData) cartDetail =findCartSum(cartData.cartItems)
        if(qCartData) qCartDetail =findCartSum(qCartData.cartItems)
        
        const cartNewData = await quickCart.findOne({userId:data.userId}).sort({"date":1})
        res.json({quickCart:cartNewData,status:status,
            data:data,...cartDetail,cart:cartData,qCartDetail:qCartDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/return-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],

        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const cartData = await cart.findOne({userId:data.userId})
        const cartItems = removeCartCount(cartData,req.body.cartID,req.body.count)
        data.cartItems =(cartItems)
        //console.log(req.body.cartItem)
        cartLog.create({...data,ItemID:req.body.cartID,action:"return"})
            await cart.updateOne(
                {userId:data.userId},{$set:data})
            status = "Return "
        var cartDetail = ''
        if(cartData) cartDetail =findCartSum(cartItems)
        await returnUpdateCount(req.body.cartID,req.body.count)
        const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        res.json({cart:cartNewData,status:status, message:"برگشت از فروش ثبت شد",
            data:data,...cartDetail,cart:cartData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/quick-to-cart',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],

        manageId:req.headers['userid'],
        date:req.body.date,
        progressDate:Date.now()
    }
    try{
        var status = "";
        const qCartData = await quickCart.findOne({userId:data.userId})
        const quickCartItems = qCartData&&qCartData.cartItems

        const cartData = await cart.findOne({userId:data.userId})
        var cartItems=cartData&&cartData.cartItems
        for(var i=0;i<quickCartItems.length;i++)
            cartItems=createCart(cartItems,quickCartItems[i])
        data.cartItems =(cartItems)
        //console.log(req.body.cartItem)
        cartLog.create({...data,ItemID:req.body.cartID,action:"quick to cart"})
        
        if(cartData)
            {await cart.updateOne(
            {userId:data.userId},{$set:data})
            status = "update cart"}
        else
            {await cart.create(data)
            status = "create cart"}
        var cartDetail = ''
        const cartNewData = await cart.findOne({userId:data.userId}).sort({"date":1})
        if(cartNewData) cartDetail =findCartSum(cartNewData&&cartNewData.cartItems)
        await updateCount(quickCartItems)
        await quickCart.deleteOne({userId:data.userId})
        res.json({cart:cartNewData,status:status,data:data,...cartDetail,quickCart:''})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/faktor', async (req,res)=>{
    const offset =req.body.offset?parseInt(req.body.offset):0 
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    try{
        const faktorTotalCount = await FaktorSchema.find().count()
        const faktorList = await FaktorSchema.aggregate
        ([
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
        }},{$sort:{"initDate":-1}},
    {$skip:offset},{$limit:10}])
        //logger.warn("main done")
        res.json({faktor:faktorList,faktorCount:faktorTotalCount})
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

        const OnlineFaktor = await sepidarFetch("data","/api/invoices/"+faktorId)
        res.json({faktor:OnlineFaktor})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-faktor',jsonParser, async (req,res)=>{
    const data={
        userId:req.body.userId?req.body.userId:req.headers['userid'],
        manageId:req.headers['userid'],
        date:req.body.date,
        progressDate:Date.now()
    }
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
        {$lookup:{
            from : "users", 
            localField: "userId", 
            foreignField: "_id", 
            as : "adminData"
        }}])
        
        const faktorDetail = totalCart(cartList)
        var sepidarQuery=[]
        var addFaktorResult=[]
        var faktorNo=0
        for(var i=0;i<faktorDetail.length;i++){
            faktorNo= await createfaktorNo("F","02","21")
            sepidarQuery[i] = await SepidarFunc(faktorDetail[i],faktorNo)
            addFaktorResult[i] = 0&&await sepidarPOST(sepidarQuery[i],"/api/invoices")
            if(!addFaktorResult[i]||addFaktorResult[0].Message){
                res.json({error:addFaktorResult[0].Message,
                    query:sepidarQuery[i],status:"faktor"})
                return
            }
            else{
                const cartDetail =findCartSum(faktorDetail[i].cartItems)
                await FaktorSchema.create(
                    {...data,faktorItems:faktorDetail[i].cartItems,
                        customerID:faktorDetail[i].userId,
                        faktorNo:faktorNo,
                        totalPrice:cartDetail.totalPrice,
                        totalCount:cartDetail.totalCount,
                        InvoiceNumber:addFaktorResult[i].Number,
                        InvoiceID:addFaktorResult[i].InvoiceID})
                await cart.deleteMany({userId:
                    faktorDetail[i].userTotal&&faktorDetail[i].userTotal.toString().split('|')})
                
            }
        }
        const recieptQuery = await RecieptFunc(req.body.receiptInfo,addFaktorResult[0],faktorNo)
        const recieptResult = 0&&await sepidarPOST(recieptQuery,"/api/Receipts/BasedOnInvoice")
        //const SepidarFaktor = await SepidarFunc(faktorDetail)
        if(!recieptQuery||recieptResult.Message){
            res.json({error:recieptResult.Message,query:recieptQuery,status:"reciept"})
                return
        }
        else{
            res.json({recieptInfo:faktorDetail,
                users:users,
                faktorInfo:addFaktorResult,
                faktorData:sepidarQuery,
                status:"done"})
            }
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const SepidarFunc=async(data,faktorNo)=>{
    var query ={
        "GUID": "124ab075-fc79-417f-b8cf-2a"+faktorNo,
        "CustomerRef": toInt(data.userId),
        "CurrencyRef":1,
        "SaleTypeRef": 4,
        "Duty":0.0000,
        "Discount": 0.0000,
        "Items": 
          data.cartItems.map((item,i)=>(
            {
            "ItemRef": toInt(item.id),
            "TracingRef": null,
            "Description":item.title+"|"+item.sku,
            "StockRef":13,
            "Quantity": toInt(item.count),
            "Fee": toInt(item.price),
            "Price": normalPriceCount(item.price,item.count,1),
            "Discount": 0.0000,
            "Tax": normalPriceCount(item.price,item.count,"0.09"),
            "Duty": 0.0000,
            "Addition": 0.0000
          }))
        
      }
    return(query)
}
const RecieptFunc=async(data,FaktorInfo,faktorNo)=>{
    var query ={
        "GUID": "124ab075-fc79-417f-b8cf-2a"+faktorNo,
        "InvoiceID": toInt(FaktorInfo.InvoiceID),
        "Description": toInt(FaktorInfo.Number),
        "Date":new Date(),
        "Drafts": 
          data.filter(n => n).map((pay,i)=>(
            {
            "BankAccountID": toInt(pay.id),
            "Description": pay.title,
            "Number": pay.Number?pay.Number:"000",
            "Date":new Date(),
            "Amount": toInt(pay.value)
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
const returnUpdateCount = async(itemID,count)=>{
    await productCount.updateOne({ItemID:itemID,Stock:"13"},
        {$inc:{quantity:toInt(count)}})
    
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
    
    return(parseInt(parseInt((align?"-":'')+strNum.toString().replace( /,/g, ''))*
    (count?parseFloat(count):1)))
}
const normalPriceCount=(priceText,count,tax)=>{
    if(!priceText||priceText === null||priceText === undefined) return("")
    var rawCount = parseFloat(count.toString())
    var rawTax = parseFloat(tax.toString())
    var rawPrice = Math.round(parseInt(priceText.toString().replace( /,/g, '')
        .replace(/\D/g,''))*rawCount*rawTax)
    rawPrice = parseInt(rawPrice)
    return(
      (rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
    )
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
router.post('/bankCustomer', async (req,res)=>{
    const search = req.body.search
    try{ 
        var bankCustomer = await bankAccounts.find()
        
        res.json({bankList:bankCustomer})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;