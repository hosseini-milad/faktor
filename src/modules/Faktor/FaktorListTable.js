import { useEffect, useState } from "react"
import Paging from "../../components/Paging"
import FaktorNewItem from "./FaktorNewItem"
import Cookies from 'universal-cookie';
import env from "../../env";
import FaktorAccordion from "./FaktorAccordion";
const cookies = new Cookies();

function FaktorListTable(props){
    
    console.log(props.faktorList)
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
        fetch(env.siteApi + "/product/faktor",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.faktor)
                    props.setFaktorList(result.faktor) 
            },
            (error) => {
                console.log(error)
            })
    },[])
    return(
        
        <FaktorAccordion faktorList={props.faktorList} />
        
    )
}
export default FaktorListTable