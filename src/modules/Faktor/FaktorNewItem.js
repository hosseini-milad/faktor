import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env, { normalPrice, normalPriceCount } from "../../env"
import Cookies from 'universal-cookie';
import Counter from "../../components/Counter";
const cookies = new Cookies();

const FaktorNewItem = (props)=>{
    const [item,setItem] = useState()
    const [itemPrice,setItemPrice] = useState()
    const [filterItems,setFilterItems] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [showPop,setShowPop] = useState(0)
    const [count,setCount] = useState("1")
    
    const [description,setDescription] = useState('')
    const [search,setSearch] = useState('')
    const token=cookies.get('faktor-login')
    useEffect(()=>{
        if(search.length<3){
            setShowPop(0)
            return}
        //console.log(search)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({search:search})
          }
        fetch(env.siteApi + "/product/find-products",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                //console.log(result)
                if(result.products)
                    setShowPop(1)
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    setFilterItems(result.products)
                }
                
            },
            (error) => {
                console.log(error)
            })
    },[search])
    const addItem=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:props.users?props.users._id:(token&&token.userId),
                date:Date.now,cartItem:{id:item.ItemID,sku:item.sku,
                    title:item.title,count:count?count:1,
                    price:item.priceData,
                    description:description},
                    payValue:props.payValue})
          }
        fetch(env.siteApi + "/product/update-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    props.setFaktorList(result)
                    setSearch('')
                    setItem('')
                    setItemPrice('')
                    setCount("1")
                }
            },
            (error) => {
                console.log(error)
            })
    
    }
    return(
        <tr>
            <td width="5%"></td>
            <td width="25%" style={{position:"relative", minWidth:"180px"}}>
                <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    
                        <input type="text" name="search" id="search" 
                        //onKeyPress={(e)=>(e.key === 'Enter')?addItem(e.target.value):''}
                        onChange={(e)=>{setSearch(e.target.value);
                            setItem('');
                            setItemPrice('');}}
                        value={item?item.title:search}
                        placeholder="جستجو"/>
                    
                </div>
                {showPop?<div className="pop-form">
                    <div className="pop-form-holder">
                        {filterItems&&filterItems.map((item,i)=>(
                        <div className="pop-form-item" key={i}
                        onClick={()=>(setItem(item),setShowPop(0),
                        setItemPrice(item.priceData))}>
                            <span className="titleShow">
                                <small>{item.sku+" - "}</small>
                                {item.title}</span>
                        {/*<small className="skuShow">{item.sku}</small>
                            <span className="priceShow">{normalPrice(item.priceData&&item.priceData[0]&&
                                item.priceData[0].price)}</span>*/}
                            <small className="countShow">{item.countData[0]&&
                            item.count.quantity}</small>
                        </div>
                        ))}
                    </div>
                </div>:<></>}
                </td>
            <td width="10%" style={{minWidth:"100px"}}>
            <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                <Counter count={count} setCount={setCount}/></div></td>
            <td width="10%">
                {item?normalPriceCount(itemPrice.find(item=>item.saleType===props.payValue).price,"1"):''}<br/>
                <small className="errorSmall" style={{color:error.color}}>
                    {error.message}</small></td>
            
            <td width="10%">
                {item?normalPriceCount(itemPrice.find(item=>item.saleType===props.payValue).price,"0.09",count):''}<br/>
                <small className="errorSmall" style={{color:error.color}}>
                    {error.message}</small></td>
                    <td width="10%">
                {item?normalPriceCount(itemPrice.find(item=>item.saleType===props.payValue).price,"1.09",count):''}<br/>
                <small className="errorSmall" style={{color:error.color}}>
                    {error.message}</small></td>
            {/*<td width="20%"><div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    <input type="text" name="description" id="description" 
                        onChange={(e)=>setDescription(e.target.value)}
                        value={description}
                        placeholder="توضیحات"/>
                            </div></td>*/}
            <td width="10%">
                <input type="button" value="افزودن" 
                onClick={addItem}/>

            </td>
        </tr>
    )
}
export default FaktorNewItem