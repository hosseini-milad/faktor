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
    const [showPay,setShowPay] = useState(0)
    const [payValue, setPayValue] = useState("4");
    const token=cookies.get('faktor-login')
    const payMethods =[["نقدی","3"],["اعتباری","4"]]
    useEffect(()=>{
        if(!doFilter)return
        setPageNumber(0)
        setDoFilter(0)
    },[doFilter])
    
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
    useEffect(()=>{
        setShowPay(users?1:0)
        setPayValue("4")
    },[users])
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
                {showPay?<div className="form-field-fiin" style={{marginBottom: "0"}}>
                    {payMethods.map(([value,id],i)=>(
                       <div key={ i } style={{display: "flex"}}>
                       <input type="radio" style={{marginLeft: "10px"}}
                             checked={ payValue===id } 
                         onChange={ (e)=>setPayValue(e.target.value) } 
                         value={ id } /> 
                           { value }
                         </div> 
                    ))}
                </div>:<></>}
            </div> 
                <FaktorRegTable faktorList={faktorList} payValue={payValue}
                    setFaktorList={setFaktorList} users={users}/>

            {/*<div className="footer-form-fiin rev">
                <WaitingBtn class="btn-fiin" title={"ثبت فاکتور"} 
                            waiting={'ثبت فاکتور.'}
                            function={registerFaktor} name="submit" error={error}/>
                
                        </div>*/}
        </div>
        
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
    </div>
    )
}
export default FaktorRegister