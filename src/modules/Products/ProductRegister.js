import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
import FilterBitrix from "../filtersBitrix";
import ProductRegTable from "./ProductRegTable";
const cookies = new Cookies();

const ProductRegister = (props)=>{
    const [users,setUsers] = useState()
    const [filter,setFilter] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [doFilter,setDoFilter] = useState(1)
    const [pageNumber,setPageNumber] = useState(0)
    
    const token=cookies.get('faktor-login')
    useEffect(()=>{
        setUsers('')
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
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    
                }
                else{
                    setUsers(result)
                }
                
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
            window.scrollTo(0,500)
    },[pageNumber,doFilter])
    return(
        <div className="container">
        <Breadcrumb title={"Set Faktor"}/>

        <div className="section-fiin">
            {/*<ListFilters setDoFilter={setDoFilter} filter={filter} setFilter={setFilter}/>    */}
            <FilterBitrix  setDoFilter={setDoFilter} filter={filter} setFilter={setFilter}/> 
        </div>
        {!error.message?<div className="section-fiin">
            <div className="section-head">
                <h1 className="section-title">Lista de Clientes</h1>
                <p className="hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</p>
            </div>   
            <div className="table-fiin">
                <ProductRegTable users={users} pageNumber={pageNumber} access={token&&token.level}
                    setPageNumber={setPageNumber} setDoFilter={setDoFilter}/>
            </div>
            <div className="footer-form-fiin rev">
                <button type="input" className="btn-fiin"
                onClick={()=>{window.location.href="/client/register"}}>
                    Registo de cliente</button>
            </div>
        </div>:
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>}
    </div>
    )
}
export default ProductRegister