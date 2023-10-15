import { useState ,useEffect } from "react"
import WaitingBtn from "../../components/Button/waitingBtn"
import SumTable from "../../components/SumTable"
import env, { normalPrice, normalPriceCount } from "../../env"
import FaktorNewItem from "./FaktorNewItem"
import FaktorPriceItem from "./FaktorModules/FaktorPriceItem"
import Counter from "../../components/Counter";

function QuickCartPart(props){
    const user = props.user
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
    
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId),
                    payValue:props.payValue})
          }
        fetch(env.siteApi + "/product/edit-payValue",postOptions)
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
    },[props.payValue])
    return(<>
        <table style={{overflow: "auto"}}>
            <thead>
                <tr>
                    <th width="3%">ردیف</th>
                    <th width="25%">شرح</th>
                    <th width="10%">تعداد</th>
                    <th width="10%">فی</th>
                    
                    {/*<th width="10%">تخفیف</th>*/}
                    <th width="10%">مالیات</th>
                    <th width="15%">جمع کل</th>

                    {/*<th width="10%">توضیحات</th>*/}
                    <th width="10%">عملیات</th>
                </tr>
            </thead>
            <tbody>
                <FaktorNewItem setFaktorList={props.setFaktorList} payValue={props.payValue}
                    faktorList={props.faktorList} users={props.user}/>
                {(props.faktorList&&props.faktorList.quickCart)?
                    props.faktorList.quickCart.cartItems.map((faktor,i)=>(
                        <FaktorPriceItem key={i} faktor={faktor} index={i} token={token}
                        setFaktorList={props.setFaktorList} users={props.user} payValue={props.payValue}/>
                )):
                <tr><td colSpan={3}></td></tr>}
                {props.faktorList&&props.faktorList.qCartDetail?
                  <tr style={{backgroundColor:"#666A70",color:"#fff"}}>
                    <td>#</td>
                    <td></td>
                    <td></td>
                    <td colSpan={6} style={{padding:"5px 10px"}}>
                        <SumTable totalPrice={props.faktorList.qCartDetail.totalPrice}
                        totalCount={props.faktorList.qCartDetail.totalCount} />
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