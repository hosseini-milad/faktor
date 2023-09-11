import { useEffect, useState } from "react"
import Cookies from 'universal-cookie';
import env, { normalPrice } from "../../env";
import QuickCartPart from "./QuickCartPart";
import CartPart from "./CartPart";
const cookies = new Cookies();

function FaktorRegTable(props){
    const user=props.users
    const token=cookies.get('faktor-login')
    
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId)})
          }
        fetch(env.siteApi + "/product/cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result)
                    props.setFaktorList(result)
                else
                    props.setFaktorList('') 
            },
            (error) => {
                console.log(error)
            })
    },[user])
    //console.log(props.faktorList)
    return(<>
        <QuickCartPart setFaktorList={props.setFaktorList} 
            faktorList={props.faktorList} user={user} 
            token={token}/>
        <CartPart setFaktorList={props.setFaktorList} 
            faktorList={props.faktorList} user={user} 
            token={token}/>
        </>
        
    )
}
export default FaktorRegTable