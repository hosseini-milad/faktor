import { useState } from "react"
import Paging from "../../components/Paging"
import SumTable from "../../components/SumTable"

import CartPartItem from "./CartPartItem"
import CartRegAccordion from "../Cart/CartRegAccordion"

function CartPart(props){
    console.log(props.faktorList)
    return(<>
<<<<<<< HEAD
            {(props.faktorList&&props.faktorList.cart&&props.faktorList.cart.length)?
                    props.faktorList.cart.map((cart,i)=>(
                        <div className="accordions" key={i}>
                                <CartRegAccordion faktor={cart} index={i}
                                    cartDetail={props.faktorList.cartDetail[i]}/>
                            </div>
                        )):<></>}
                <table><tbody>
=======
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
                {(props.faktorList&&props.faktorList.totalCount)?
                    props.faktorList.cart.cartItems.map((faktor,i)=>(
                <tr key={i} style={{backgroundColor:"#EEEFFC"}}>
                    <td>{i+1}</td>
                    <td className="tdHolder">
                        <strong>{faktor.title}</strong>
                        <small>{faktor.sku}</small></td>
                    <td style={{textAlign:"center"}}>{/*<div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                        <input type="text" name="count" id="count" 
                            onChange={(e)=>setCount(faktor.id,e.target.value)}
                            className="formInputSimple"
                            value={faktor.count||''}
                    placeholder="تعداد"/>
                        </div>*/}{faktor.count}</td>
                    <td style={{textAlign:"center"}}>{normalPrice(faktor.price)}</td>
                    <td>{faktor.description}</td>
                    <td>{<FaktorReturn itemId={faktor} setFaktorList={props.setFaktorList}
                        user={props.user} token={props.token} itemCount={faktor.count}/>}</td>
                </tr>
                )):
                <tr><td colSpan={2}>سبد خرید خالی است</td></tr>}
>>>>>>> ab4e8d03e89cb21d0e37e488a24b563c177bcfc5
                {props.faktorList&&props.faktorList.totalCount?
                  <tr style={{backgroundColor:"#666A70",color:"#fff"}}>
                    <td>#</td>
                    <td></td>
                    <td style={{textAlign:"center"}}>{props.faktorList.totalCount}</td>
                    <td colSpan={3} style={{padding:"5px 10px"}}>
                        <SumTable totalPrice={props.faktorList.totalPrice} />
                    </td>
                    
                    {/*<td style={{padding: "22px 8px"}}>خالی کردن</td>*/}
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
export default CartPart