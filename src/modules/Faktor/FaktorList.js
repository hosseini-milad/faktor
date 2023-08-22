import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
import FilterBitrix from "../filtersBitrix";
import FaktorListTable from "./FaktorListTable";
import FaktorAccordion from "./FaktorAccordion";
const cookies = new Cookies();

const FaktorList = (props)=>{
    const [users,setUsers] = useState()
    const [filter,setFilter] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [doFilter,setDoFilter] = useState(1)
    const [pageNumber,setPageNumber] = useState(0)
    const [faktorList,setFaktorList] = useState() 
    
    const token=cookies.get('fiin-login')
    
    useEffect(()=>{
        //console.log(search)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId})
          }
        fetch(env.siteApi + "/product/faktor",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.faktor)
                    setFaktorList(result.faktor) 
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
        <Breadcrumb title={"لیست فاکتور"}/>


        <div className="section-fiin">
            <div className="section-head">
                <h1 className="section-title">لیست فاکتورها</h1>
                <p className="hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</p>
            </div>  
            
        </div>
        <FaktorAccordion faktorList={faktorList} />
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
    </div>
    )
}
export default FaktorList