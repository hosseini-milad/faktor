import { useEffect, useState } from "react"
import Paging from "../../components/Paging"
import FaktorNewItem from "./FaktorNewItem"
import Cookies from 'universal-cookie';
import env from "../../env";
const cookies = new Cookies();

function FaktorRegTable(props){
    
    console.log(props.faktorList)
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
        fetch(env.siteApi + "/product/cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.cart)
                    props.setFaktorList(result.cart) 
            },
            (error) => {
                console.log(error)
            })
    },[])
    return(<>
        <table style={{overflow: "auto"}}>
            <thead>
                <tr>
                    <th width="7.5%">Row</th>
                    <th width="7.5%">Item</th>
                    <th width="10%">Count</th>
                    <th width="10%">Desc</th>
                    <th width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                <FaktorNewItem setFaktorList={props.setFaktorList} 
                                faktorList={props.faktorList}/>
                {props.faktorList?props.faktorList.cartItems.map((faktor,i)=>(
                <tr key={i} style={{backgroundColor:"lightGreen"}}>
                    <td>{i+1}</td>
                    <td>{faktor.title}</td>
                    <td>{faktor.count}</td>
                    <td>{faktor.sku}</td>
                    <td><a href={"/profile/"+faktor.sku}>Editar</a></td>
                </tr>)):
                <tr><td>Empty Cart</td></tr>}
                
            </tbody>
        </table>
        <Paging size={props.users&&props.users.size} 
            setPageNumber={props.setPageNumber} 
            pageNumber={props.pageNumber} perPage={5}
            setDoFilter={props.setDoFilter}/>
            
        </>
        
    )
}
export default FaktorRegTable