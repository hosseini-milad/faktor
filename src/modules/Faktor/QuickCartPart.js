import { useState } from "react"
import WaitingBtn from "../../components/Button/waitingBtn"
import SumTable from "../../components/SumTable"
import env, { normalPrice, normalPriceCount } from "../../env"
import FaktorNewItem from "./FaktorNewItem"
import Counter from "../../components/Counter";

function QuickCartPart(props){
    const user = props.user
    const [error,setError] = useState({message:'',color:"brown"})
    const token = props.token
    const setCount=(count,itemId)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId),
                    cartItem:{id:itemId,count:count}})
          }
        //console.log(postOptions)
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
        <table style={{overflow: "auto"}}>
            <thead>
                <tr>
                    <th width="3%">ردیف</th>
                    <th width="30%">شرح</th>
                    <th width="10%">تعداد</th>
                    <th width="10%">فی</th>
                    <th width="15%">قیمت</th>
                    <th width="10%">توضیحات</th>
                    <th width="10%">عملیات</th>
                </tr>
            </thead>
            <tbody>
                <FaktorNewItem setFaktorList={props.setFaktorList} payValue={props.payValue}
                    faktorList={props.faktorList} users={props.user}/>
                {(props.faktorList&&props.faktorList.quickCart)?
                    props.faktorList.quickCart.cartItems.map((faktor,i)=>(
                <tr key={i} style={{backgroundColor:"#EEEFFC"}}>
                    <td>{i+1}</td>
                    <td className="tdHolder">
                        <strong>{faktor.title}</strong>
                        <small>{faktor.sku}</small></td>
                    <td><div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                        <Counter count={faktor.count||''} 
                                setCount={setCount} itemId={faktor.id}/>
                        </div></td>
                    <td>{normalPrice(faktor.price)}</td>
                    <td>{normalPriceCount(faktor.price,faktor.count)}</td>
                    <td>{faktor.description}</td>
                    <td><div className="removeBtn" onClick={()=>removeItem(faktor.id)}>حـذف</div></td>
                </tr>
                )):
                <tr><td colSpan={2}></td></tr>}
                {props.faktorList&&props.faktorList.qCartDetail?
                  <tr style={{backgroundColor:"#666A70",color:"#fff"}}>
                    <td>#</td>
                    <td></td>
                    <td style={{textAlign:"center"}}>{props.faktorList.qCartDetail.totalCount}</td>
                    <td></td>
                    <td colSpan={3} style={{padding:"5px 10px"}}>
                        <SumTable totalPrice={props.faktorList.qCartDetail.totalPrice} />
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
export default QuickCartPart