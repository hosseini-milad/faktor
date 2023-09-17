import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env, { normalPrice } from "../../env"

const FaktorReturn = (props)=>{
    const [item,setItem] = useState()
    const [filterItems,setFilterItems] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [showPop,setShowPop] = useState(0)
    const [count,setCount] = useState("1")
    
    const [description,setDescription] = useState('')
    const [search,setSearch] = useState('')
    const token=props.token
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
    const returnItem=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:props.user?props.user._id:(token&&token.userId),
                date:Date.now,cartID:props.itemId.id,count:count?count:1})
          }
          console.log(postOptions)
        fetch(env.siteApi + "/product/return-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    props.setFaktorList(result)
                    setSearch('')
                    setItem('')
                    setCount("1")
                    setError({message:result.message,color:"green"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
            },
            (error) => {
                console.log(error)
            })
    
    }
    return(<>
        <div className="form-fiin form-field-fiin" 
            style={{marginBottom: "0",display:"flex"}}>
            <input type="text" name="count" id="count" 
                onChange={(e)=>setCount(e.target.value)}
                value={count} style={{textAlign:"center"}}
                placeholder="تعداد"/>
        <input type="button" value="برگشت از فروش" 
        onClick={returnItem}/>
        </div>
    </>
    )
}
export default FaktorReturn