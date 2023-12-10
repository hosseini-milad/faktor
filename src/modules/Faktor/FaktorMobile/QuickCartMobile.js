import { useState } from "react"
import WaitingBtn from "../../../components/Button/waitingBtn"
import SumTable from "../../../components/SumTable"
import env, { normalPrice, normalPriceCount } from "../../../env"

import Counter from "../../../components/Counter";
import NewItemMobile from "./NewItemMobile"
import QuickCartMobileRow from "./QuickCartMobileRow"

function QuickCartMobile(props){
    const user = props.user
    var payValue= props.payValue
    const [error,setError] = useState({message:'',color:"brown"})
    const token = props.token
    
    const addToCart=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId)})
          }
        fetch(env.siteApi + "/product/quick-to-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result){
                    setError({message:"کالا اضافه شد",color:"green"})
                    setTimeout(()=>setError({message:"",color:"brown"}),2000)
                    props.setFaktorList(result)
                }
                else
                    props.setFaktorList('') 
            },
            (error) => {
                console.log(error)
            })
    }
    
      
    
    return(<>
        <NewItemMobile token={token} payValue={payValue} 
            setFaktorList={props.setFaktorList} users={user}/>
        {props.faktorList?<div className="quickMobileHolder form-box-style">
                {(props.faktorList&&props.faktorList.quickCart)?
                    props.faktorList.quickCart.cartItems.map((faktor,i)=>(
                    <div className="quickMobile" key={i}>
                        <QuickCartMobileRow faktor={faktor} token={token}
                            setFaktorList={props.setFaktorList} user={user}
                            payValue={payValue}/>
                        <hr/>
                </div>)):<></>}
            </div>:<></>}
            <table style={{width: "100%"}}>
            <tbody>
                {props.faktorList&&props.faktorList.qCartDetail?
                  <tr style={{backgroundColor:"#666A70",color:"#fff"}}>
                    <td></td>
                    <td></td>
                    <td colSpan={5} style={{padding:"5px 10px"}}>
                        <SumTable totalCount={props.faktorList.qCartDetail.totalCount}
                        totalPrice={props.faktorList.qCartDetail.totalPrice} />
                    </td>
                {/*<td style={{padding: "22px 8px"}}>خالی کردن</td>*/}
                  </tr>:<></>}
            </tbody>
        </table>
        <div className="footer-form-fiin rev">
            {props.faktorList&&props.faktorList.qCartDetail&&
            props.faktorList.qCartDetail.totalCount?
            <WaitingBtn class="btn-fiin" title={"ثبت موقت"} 
                        waiting={'ثبت موقت.'}
                        function={addToCart} name="submit" error={error}/>:
            <input type="button" value="ثبت موقت" 
                className="btn-fiin disable-btn" />}
            <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
        </div>
        
        </>
    )
}
export default QuickCartMobile