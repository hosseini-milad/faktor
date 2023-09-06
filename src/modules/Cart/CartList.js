import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
import CartAccordion from "./CartAccordion";
const cookies = new Cookies();

const CartList = (props)=>{
    const [users,setUsers] = useState()
    const [filter,setFilter] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [doFilter,setDoFilter] = useState(1)
    const [pageNumber,setPageNumber] = useState(0)
    const [faktorList,setFaktorList] = useState() 
    
    const token=cookies.get('faktor-login')
    
    useEffect(()=>{
        //console.log(search)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId})
          }
        fetch(env.siteApi + "/product/cartlist",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.cart)
                    setFaktorList(result.cart) 
            },
            (error) => {
                console.log(error)
            })
    },[])
    useEffect(()=>{
        if(!doFilter)return
        setPageNumber(0)
        setDoFilter(0)
    },[doFilter])
    const registerFaktor=()=>{
        console.log()
    }
    return(
        <div className="container">
        <Breadcrumb title={"لیست سفارشات باز"}/>


        <div className="section-fiin">
            <div className="section-head">
                <h1 className="section-title">لیست سفارشات باز</h1>
                <p className="hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</p>
            </div>  
            
        </div>
        <CartAccordion faktorList={faktorList} />
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
    </div>
    )
}
export default CartList