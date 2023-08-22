import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env, { normalPrice } from "../../env"
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const FaktorNewItem = (props)=>{
    const [item,setItem] = useState()
    const [filterItems,setFilterItems] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [showPop,setShowPop] = useState(0)
    const [count,setCount] = useState("1")
    
    const [description,setDescription] = useState('')
    const [search,setSearch] = useState('')
    
    const token=cookies.get('fiin-login')
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
                console.log(result)
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
            body:JSON.stringify({userId:(token&&token.userId),
                date:Date.now,cartItem:{id:item.ItemID,sku:item.sku,
                    title:item.title,count:count?count:1,price:item.priceData&&
                    item.priceData[0].price,description:description}})
          }
        fetch(env.siteApi + "/product/update-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                props.setFaktorList(result)
                setSearch('')
                setItem('')
                setCount("1")
            },
            (error) => {
                console.log(error)
            })
    
    }
    return(
        <tr>
            <td width="5%"></td>
            <td width="30%" style={{position:"relative", minWidth:"220px"}}>
                <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    <input type="text" name="search" id="search" 
                        //onKeyPress={(e)=>(e.key === 'Enter')?addItem(e.target.value):''}
                        onChange={(e)=>{setSearch(e.target.value)
                            setItem('')}}
                        value={item?item.title:search}
                        placeholder="جستجو"/>
                </div>
                {showPop?<div className="pop-form">
                    <div className="pop-form-holder">
                        {filterItems&&filterItems.map((item,i)=>(
                        <div className="pop-form-item" key={i}
                        onClick={()=>(setItem(item),setShowPop(0))}>
                            <span className="titleShow">{item.title}</span>
                            <small className="skuShow">{item.sku}</small>
                            <span className="priceShow">{normalPrice(item.priceData&&item.priceData[0]&&
                                item.priceData[0].price)}</span>
                            <small className="countShow">{item.countData[0]&&
                                item.countData[0].quantity.split('.')[0]}</small>
                        </div>
                        ))}
                    </div>
                </div>:<></>}
                </td>
            <td width="10%" style={{minWidth:"100px"}}>
                <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    <input type="text" name="count" id="count" 
                        onChange={(e)=>setCount(e.target.value)}
                        value={count}
                        placeholder="تعداد"/>
                </div></td>
            <td width="20%">{item?normalPrice(item.priceData&&item.priceData[0]&&
                                item.priceData[0].price):''}</td>
            <td width="20%"><div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    <input type="text" name="description" id="description" 
                        onChange={(e)=>setDescription(e.target.value)}
                        value={description}
                        placeholder="توضیحات"/>
                </div></td>
            <td width="10%">
                <input type="button" value="افزودن" 
                onClick={addItem}/>

            </td>
        </tr>
    )
}
export default FaktorNewItem