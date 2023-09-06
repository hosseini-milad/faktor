import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
import FilterBitrix from "../filtersBitrix";
import FaktorTable from "./FaktorRegTable";
import FaktorRegTable from "./FaktorRegTable";
import WaitingBtn from "../../components/Button/waitingBtn";
const cookies = new Cookies();

const FaktorRegister = (props)=>{
    const [users,setUsers] = useState()
    const [filterUser,setFilterUser] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [doFilter,setDoFilter] = useState(1)
    const [pageNumber,setPageNumber] = useState(0)
    const [faktorList,setFaktorList] = useState() 
    const [search,setSearch] = useState('')
    const [showPop,setShowPop] = useState(0)
    const token=cookies.get('faktor-login')
    
    useEffect(()=>{
        if(!doFilter)return
        setPageNumber(0)
        setDoFilter(0)
    },[doFilter])
    
    const registerFaktor=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId,
                faktorItems:faktorList.cart.cartItems,
                customerID:(users&&users.CustomerID)?users.CustomerID:"1639"})
          }
        fetch(env.siteApi + "/product/update-faktor",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
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
    fetch(env.siteApi + "/product/customer-find",postOptions)
    .then(res => res.json())
    .then(
        (result) => {
            if(result.customers)
                setShowPop(1)
            if(result.error){
                setError({message:result.error,color:"brown"})
                
            }
            else{
                setFilterUser(result.customers)
            }
            
        },
        (error) => {
            console.log(error)
        })
    },[search])
    return(
        <div className="container">
        <Breadcrumb title={"ثبت فاکتور"}/>

        <div className="section-fiin">
            <div className="section-head">
                <h1 className="section-title">ثبت فاکتور فروش</h1>
                <p className="hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</p>
            </div>  
            
            <div className="footer-form-fiin rev">
                <div width="30%" style={{position:"relative", minWidth:"220px", marginLeft:"100px"}}>
                    <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                        <input type="text" name="search" id="search" 
                            //onKeyPress={(e)=>(e.key === 'Enter')?addItem(e.target.value):''}
                            onChange={(e)=>{setSearch(e.target.value)
                                setUsers('')}}
                            value={users?users.username:search}
                            placeholder="مشتری"/>
                    </div>
                    {showPop?<div className="pop-form">
                        <div className="pop-form-holder">
                            {filterUser&&filterUser.map((item,i)=>(
                            <div className="pop-form-item" key={i}
                            onClick={()=>(setUsers(item),setShowPop(0))}>
                                <span className="titleShow">{item.username}</span>
                                {/*<small className="priceShow" style={{width:"100px"}}>{item.phone}</small>
                                
                            <small className="priceShow">{item.CustomerID}</small>*/}
                            </div>
                            ))}
                        </div>
                    </div>:<></>}
                </div>
            </div> 
            <div className="table-fiin">
                <FaktorRegTable faktorList={faktorList} 
                    setFaktorList={setFaktorList} users={users}/>
            </div>

            <div className="footer-form-fiin rev">
                <WaitingBtn class="btn-fiin" title={"ثبت فاکتور"} 
                            waiting={'ثبت فاکتور.'}
                            function={registerFaktor} name="submit" error={error}/>
                
            </div>
        </div>
        
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
    </div>
    )
}
export default FaktorRegister