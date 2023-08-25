import { useEffect, useState } from "react"
import Paging from "../../components/Paging"
import FaktorNewItem from "./FaktorNewItem"
import Cookies from 'universal-cookie';
import env, { normalPrice } from "../../env";
const cookies = new Cookies();

function FaktorRegTable(props){
    
    const token=cookies.get('faktor-login')
    console.log(props.faktorList)
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
                    props.setFaktorList(result) 
            },
            (error) => {
                console.log(error)
            })
    },[])
    const removeItem=(ItemID)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId,cartID:ItemID})
          }
        fetch(env.siteApi + "/product/remove-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.cart)
                    props.setFaktorList(result) 
            },
            (error) => {
                console.log(error)
            })
    }
    const setCount=(itemId,count)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId,
                    cartItem:{id:itemId,count:count}})
          }
        fetch(env.siteApi + "/product/edit-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.cart)
                    props.setFaktorList(result) 
            },
            (error) => {
                console.log(error)
            })
    }
    return(<>
        <table style={{overflow: "auto"}}>
            <thead>
                <tr>
                    <th width="3%">ردیف</th>
                    <th width="30%">شرح</th>
                    <th width="10%">تعداد</th>
                    <th width="10%">قیمت</th>
                    <th width="10%">توضیحات</th>
                    <th width="10%">عملیات</th>
                </tr>
            </thead>
            <tbody>
                <FaktorNewItem setFaktorList={props.setFaktorList} 
                                faktorList={props.faktorList}/>
                {(props.faktorList&&props.faktorList.totalCount)?
                    props.faktorList.cart.cartItems.map((faktor,i)=>(
                <tr key={i} style={{backgroundColor:"#EEEFFC"}}>
                    <td>{i+1}</td>
                    <td className="tdHolder">
                        <strong>{faktor.title}</strong>
                        <small>{faktor.sku}</small></td>
                    <td><div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                        <input type="text" name="count" id="count" 
                            onChange={(e)=>setCount(faktor.id,e.target.value)}
                            className="formInputSimple"
                            defaultValue={faktor.count}
                            placeholder="تعداد"/>
                        </div></td>
                    <td>{normalPrice(faktor.price)}</td>
                    <td>{faktor.description}</td>
                    <td><div className="removeBtn" onClick={()=>removeItem(faktor.id)}>حـذف</div></td>
                </tr>
                )):
                <tr><td colSpan={2}>سبد خرید خالی است</td></tr>}
                {props.faktorList&&props.faktorList.totalCount?
                  <tr style={{backgroundColor:"#666A70"}}>
                    <td>#</td>
                    <td></td>
                    <td>{props.faktorList.totalCount}</td>
                    <td colSpan={2}>جمع سفارش: 
                        <b> {normalPrice(props.faktorList.totalPrice)} ریال 
                        </b></td>
                    
                    <td>خالی کردن</td>
                  </tr>:<></>}
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