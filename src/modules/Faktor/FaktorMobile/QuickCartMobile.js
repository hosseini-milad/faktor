import { useState } from "react"
import WaitingBtn from "../../../components/Button/waitingBtn"
import SumTable from "../../../components/SumTable"
import env, { normalPrice, normalPriceCount } from "../../../env"
import FaktorNewItem from "../FaktorNewItem"
import Counter from "../../../components/Counter";
import NewItemMobile from "./NewItemMobile"

function QuickCartMobile(props){
    const user = props.user
    const [regElement,setRegElement] = useState('')
    const [error,setError] = useState({message:'',color:"brown"})
    const token = props.token
    const setCount=(count,itemId,price)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId),
                    cartItem:{id:itemId,count:count,price:price}})
          }
        console.log(postOptions)
        fetch(env.siteApi + "/product/edit-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
                else props.setFaktorList(result) 
            },
            (error) => {
                console.log(error)
            })
    }
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
    const removeItem=(ItemID)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId),
                cartID:ItemID})
          }
        fetch(env.siteApi + "/product/remove-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result)
                    props.setFaktorList(result) 
            },
            (error) => {
                console.log(error)
            })
    }
    
    return(<>
        <NewItemMobile token={token} payValue={props.payValue} 
            setFaktorList={props.setFaktorList} users={user}/>
        <div className="quickMobileHolder form-box-style">
                {(props.faktorList&&props.faktorList.quickCart)?
                    props.faktorList.quickCart.cartItems.map((faktor,i)=>(
                    <div className="quickMobile" key={i}>
                        <div className="mobileHolder">
                            <div className="removeBtn" onClick={()=>removeItem(faktor.id)}>
                                 × {/*<i className="icon-size fas fa-recycle"></i>*/}
                            </div>
                            <div className="tdHolder fullWidth">
                                <strong>{faktor.title}</strong>
                                <small>{faktor.sku}</small>
                            </div>
                        </div>
                        <div className="mobileHolder">
                            <div className="mobile70">
                                <table>
                                    <tbody>
                                        <tr className="priceRow">
                                            <td width={"100px"}>فی</td>
                                            <td><input type="text" defaultValue={normalPriceCount(faktor.price,1)}
                                            className="borderLess priceInput"
                                            onKeyDown={(e)=>
                                            e.keyCode==13?setCount(faktor.count,faktor.id
                                                ,e.target.value):''}/></td>
                                        </tr>
                                        <tr className="priceRow">
                                            <td>مالیات</td>
                                            <td>{normalPriceCount(faktor.price,"0.09",faktor.count)}</td>
                                        </tr>
                                        <tr className="priceRow">
                                            <td>جمع کل</td>
                                            <td>{normalPriceCount(faktor.price,"1.09",faktor.count)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mobile30">
                                <div className="countPlaceMobile">
                                    <small>تعداد: 
                                        <input type="text" defaultValue={faktor.count}
                                            onChange={(e)=>
                                                setCount(e.target.value,faktor.id)}
                                            className="borderLess countInput"/> عدد</small>
                                </div>
                            </div>
                        </div>
                        <hr/>
                </div>)):<></>}
            </div>
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