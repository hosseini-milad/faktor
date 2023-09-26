import { useState } from "react"
import Paging from "../../components/Paging"
import SumTable from "../../components/SumTable"

import CartPartItem from "./CartPartItem"
import CartRegAccordion from "../Cart/CartRegAccordion"

function CartPart(props){
    console.log(props.faktorList)
    return(<>
            {(props.faktorList&&props.faktorList.cart&&props.faktorList.cart.length)?
                    props.faktorList.cart.map((cart,i)=>(
                        <div className="accordions" key={i}>
                                <CartRegAccordion faktor={cart} index={i}
                                    cartDetail={props.faktorList.cartDetail[i]}/>
                            </div>
                        )):<></>}
                <table><tbody>
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