import { useEffect, useState } from "react"
import WaitingBtn from "../../components/Button/waitingBtn"
import env, {  defferPrice, normalPrice, normalPriceCount } from "../../env"

function CartPay(props){
    const payListData = props.faktorList
    const totalPrice = payListData&&normalPriceCount(payListData.cartPrice,"1.09")
    const token = props.token
    const [error,setError] = useState({message:'',color:"brown"})
    const [bankList,setBankList] = useState()
    const [payList,setPayList] = useState(Array(10).fill(0))
    const [totalSum,setTotalSum] = useState(0)
    //console.log(payList)
    const sepidarFaktor=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({receiptInfo:payList,
            cartID:props.cartID})
          }
          console.log(postOptions)
        fetch(env.siteApi + "/product/update-faktor",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                if(result.error){
                    setError({message:result.error,color:"brown"})
                }
                else{
                    setError({message:result.message,color:"green"})
                    setTimeout(()=>window.location.reload(),3000)
                } 
            },
            (error) => {
                console.log(error)
            })
    }
    useEffect(()=>{
        //console.log(search)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:token&&token.userId})
          }
        fetch(env.siteApi + "/product/bankCustomer",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.bankList)
                    setBankList(result.bankList) 
            },
            (error) => {
                console.log(error)
            })
    },[])
    useEffect(()=>{
        var totalSum = 0
        for(var i=0;i<payList.length;i++){
            if(payList[i]&&payList[i].value)
                totalSum+= parseInt(payList[i].value.replace( /,/g, ''))
        }
        setTotalSum(normalPrice(totalSum))
    },[payList])
    return(
        <>
        <h4>روش پرداخت</h4>
        <div className="payMent">
            مبلغ کل سفارشات: {normalPrice(totalPrice)} ریال
        </div>
        <div className="tarazHolder">
            <div className="payMentMethod">
                {bankList&&bankList.map((payMethod,i)=>(
                    <div className="paymentNew" key={i}>
                    <small>{i+1}</small>
                    <input type="text" placeholder="انتخاب روش پرداخت"
                    value={payMethod.DlTitle} className="payHolder"
                    readOnly/>
                    <input type="text" placeholder="مبلغ پرداختی"
                    value={normalPrice(payList[i].value)}
                    style={{width:"150px"}}
                    onChange={(e)=>{
                        setPayList(payList => {
                            return [
                              ...payList.slice(0, i),
                              {...payList[i],id:payMethod.BankAccountID,title:payMethod.DlTitle,
                                    value:e.target.value},
                              ...payList.slice(i + 1),
                            ]
                        })}}/>
                    <input type="text" placeholder="شماره حواله"
                    value={payList[i].Number}
                    style={{marginRight:"10px",width:"120px"}}
                    onChange={(e)=>{
                        setPayList(payList => {
                            return [
                              ...payList.slice(0, i),
                              {...payList[i],Number:e.target.value},
                              ...payList.slice(i + 1),
                            ]
                          })}}/>
                </div>
                ))}
                
            </div>
            <div className="sepidarSum">
                <strong>تراز مالی</strong>
                <small>مجموع سفارش: {normalPrice(payListData&&payListData.cartPrice)}</small>
                <small>سفارش با مالیات: {normalPrice(totalPrice)}</small>
                <small>جمع پرداختی: {normalPrice(totalSum)}</small>
                <h3>مانده تراز: {defferPrice(totalPrice,totalSum?totalSum:0)}</h3>
            </div>
        </div>
        <div className="footer-form-fiin rev">
            {totalPrice===totalSum?<WaitingBtn class="btn-fiin btn-waiting" title={"ثبت سپیدار"} 
                        waiting={'ثبت سپیدار.'}
                        function={sepidarFaktor} name="submit" error={error}/>:
            <input type="button" value="ثبت سپیدار" 
                className="btn-fiin disable-btn" />}
            <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
        </div>
        </>
    )
}
export default CartPay
