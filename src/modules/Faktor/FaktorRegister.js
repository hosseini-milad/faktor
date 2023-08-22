import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
import FilterBitrix from "../filtersBitrix";
import FaktorTable from "./FaktorRegTable";
import FaktorRegTable from "./FaktorRegTable";
const cookies = new Cookies();

const FaktorRegister = (props)=>{
    const [users,setUsers] = useState()
    const [filter,setFilter] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [doFilter,setDoFilter] = useState(1)
    const [pageNumber,setPageNumber] = useState(0)
    const [faktorList,setFaktorList] = useState() 
    console.log(faktorList)
    const token=cookies.get('fiin-login')
    
    useEffect(()=>{
        if(!doFilter)return
        setPageNumber(0)
        setDoFilter(0)
    },[doFilter])
    useEffect(()=>{
        
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({access:"customer",...filter,
            pageSize:5,offset:pageNumber})
          }
        fetch(env.siteApi + "/auth/list-search",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setUsers(result)
                
            },
            (error) => {
                console.log(error)
            })
            window.scrollTo(0,200)
    },[pageNumber,doFilter])
    const registerFaktor=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId,
                faktorItems:faktorList.cart.cartItems})
          }
        fetch(env.siteApi + "/product/update-faktor",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error)
                    console.log(result.error)
                else{
                    setError({message:result.message,color:"green"})
                    setTimeout(()=>window.location.reload(),3000)
                } 
            },
            (error) => {
                console.log(error)
            })
    }
    return(
        <div className="container">
        <Breadcrumb title={"ثبت فاکتور"}/>

        <div className="section-fiin">
            <div className="section-head">
                <h1 className="section-title">ثبت فاکتور فروش</h1>
                <p className="hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</p>
            </div>   
            <div className="table-fiin">
                <FaktorRegTable faktorList={faktorList} setFaktorList={setFaktorList}/>
            </div>
            <div className="footer-form-fiin rev">
                <button type="input" className="btn-fiin"
                onClick={registerFaktor}>
                    ثبت فاکتور</button>
            </div>
        </div>
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
    </div>
    )
}
export default FaktorRegister