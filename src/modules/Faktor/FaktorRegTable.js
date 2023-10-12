import { useEffect, useState } from "react"
import Cookies from 'universal-cookie';
import env, { normalPrice } from "../../env";
import QuickCartPart from "./QuickCartPart";
import CartPart from "./CartPart";
import FaktorReturn from "./FaktorReturn";
import QuickCartMobile from "./FaktorMobile/QuickCartMobile";
const cookies = new Cookies();
const wWidth = window.innerWidth;

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
        {wWidth>700?
        <div className="table-fiin">
            <QuickCartPart setFaktorList={props.setFaktorList} 
                faktorList={props.faktorList} user={user} payValue={props.payValue}
                token={token}/>
        </div>:
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <QuickCartMobile setFaktorList={props.setFaktorList} 
                    faktorList={props.faktorList} user={user} payValue={props.payValue}
                    token={token}/>
            </div>
        </div>}
        
        <div className="table-fiin">
            <CartPart setFaktorList={props.setFaktorList} 
            faktorList={props.faktorList} user={user} 
            token={token}/>
        </div>
        </>
        
    )
}
export default FaktorRegTable