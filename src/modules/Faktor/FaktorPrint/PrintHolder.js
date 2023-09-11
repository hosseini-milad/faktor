import { useEffect, useState } from "react"
import env from "../../../env"
import Cookies from 'universal-cookie';
import PrintHesabfa from "./PrintHesabfa";
import FishPrintHesabfa from "./FishPrintHesabfa";
const cookies = new Cookies();
const url = document.location.pathname.split('/')[3]
const type = document.location.pathname.split('/')[2]

const FaktorPrint = (props)=>{
    
    const [faktorList,setFaktorList] = useState() 
    
    const token=cookies.get('faktor-login')
    console.log(faktorList)
    useEffect(()=>{
        //console.log(search)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({faktorId:url})
          }
        fetch(env.siteApi + "/product/faktor-find",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                if(result)
                    setFaktorList(result.faktor) 
            },
            (error) => {
                console.log(error)
            })
    },[])
    return(
        <div className="container">
            {faktorList?type==="fishprint"?<FishPrintHesabfa 
                orderData={faktorList} userInfo={''}/>
            :<PrintHesabfa orderData={faktorList} userInfo={''}/>  :
            <main>در حال دریافت اطلاعات</main>}
        </div>
    )
}
export default FaktorPrint