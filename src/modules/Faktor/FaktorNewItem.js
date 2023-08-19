import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const FaktorNewItem = (props)=>{
    const [item,setItem] = useState()
    const [filterItems,setFilterItems] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [showPop,setShowPop] = useState(0)
    const [count,setCount] = useState(1)
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
                date:Date.now,cartItem:{id:item._id,sku:item.sku,
                    title:item.title,count:count}})
          }
          console.log(postOptions)
        fetch(env.siteApi + "/product/update-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                props.setFaktorList(result.cart)
                
            },
            (error) => {
                console.log(error)
            })
    
    }
    return(
        <tr style={{backgroundColor:"lightGreen"}}>
            <td width="10%"></td>
            <td width="30%" style={{position:"relative"}}>
                <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    <input type="text" name="search" id="search" 
                        //onKeyPress={(e)=>(e.key === 'Enter')?addItem(e.target.value):''}
                        onChange={(e)=>{setSearch(e.target.value)
                            setItem('')}}
                        value={item?item.title:search}
                        placeholder="Search"/>
                </div>
                {showPop?<div className="pop-form">
                    <div className="pop-form-holder">
                        {filterItems&&filterItems.map((item,i)=>(
                        <div className="pop-form-item" key={i}
                        onClick={()=>(setItem(item),setShowPop(0))}>
                            <span>{item.title}</span>
                        </div>
                        ))}
                    </div>
                </div>:<></>}
                </td>
            <td width="10%">
                <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                    <input type="text" name="count" id="count" 
                        onChange={(e)=>setCount(e.target.value)}
                        defaultValue={1}
                        placeholder="Count"/>
                </div></td>
            <td width="20%">{"Desc"}</td>
            <td width="10%">
                <input type="button" value="Add Item" 
                onClick={addItem}/>

            </td>
        </tr>
    )
}
export default FaktorNewItem