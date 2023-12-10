import { useEffect, useState } from "react"
import env, { normalPriceCount } from "../../../env"
import Picker from 'react-mobile-picker'
import CustomCounter from "../../../components/CustomCounter"

function QuickCartMobileRow(props){
    const token = props.token
    const faktor = props.faktor
    const user = props.user
    const payValue = props.payValue
    const [error,setError] = useState({message:'',color:"brown"})
    const [countPicker,setCountPicker] = useState(faktor.count)
    const [price,setPrice] = useState(faktor.price)
    const [change,setChange] = useState()
    const selections = {
        count: Array.from({length: 1000}, (_, i) => i + 1)
      }
    const [pickerValue, setPickerValue] = useState(selections)
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
    const updateChanges=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId),
                    cartItem:{id:faktor.id,
                        count:countPicker,price:price}})
          }
        fetch(env.siteApi + "/product/edit-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    props.setFaktorList(result) 
                    setChange(0)
                }
            },
            (error) => {
                console.log(error)
            })
    }
    const updatePrice=(changedPrice)=>{
        //const price =(eventPrice.target.previousSibling.value)
        var newPrice = price
        try{newPrice.find(item=>item.saleType===payValue).price=changedPrice}
        catch{}
        setPrice(newPrice)
        //setCount(count,itemId,totalPrice)
    }
    useEffect(()=>{
        if(faktor.count!==countPicker)
            setChange(1)
    },[countPicker])
    useEffect(()=>{
        setCountPicker(faktor.count)
    },[faktor])
    return(
        <>
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
                            <td><input type="text" 
                            defaultValue={normalPriceCount(faktor.price&&faktor.price.length&&
                                faktor.price.find(item=>item.saleType===payValue).price,1)}
                            className="borderLess priceInput"
                            onChange={(e)=>{setChange(1);updatePrice(e.target.value)}}/></td>
                        </tr>
                        <tr className="priceRow">
                            <td>مالیات</td>
                            <td>{normalPriceCount(faktor.price&&faktor.price.length&&
                                faktor.price.find(item=>item.saleType===payValue).price,"0.09",faktor.count)}</td>
                        </tr>
                        <tr className="priceRow">
                            <td>جمع کل</td>
                            <td>{normalPriceCount(faktor.price&&faktor.price.length&&
                                faktor.price.find(item=>item.saleType===payValue).price,"1.09",faktor.count)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mobile30">
                <div className="countPlaceMobile">
                    <small>تعداد: </small>
                        {/*<input type="text" defaultValue={faktor.count}
                            onChange={(e)=>
                                setCount(e.target.value,faktor.id)}
                            className="borderLess countInput"/> عدد*/}
                    <div className="customCounter">
                        {/*<Picker className="picker" value={{count:countPicker}}  id="picker"
                        onChange={(e)=>(setChange(1),setPickerValue(e),
                            setCountPicker(e.count))}>
                            {Object.keys(selections).map(name => (
                                <Picker.Column key={name} name={name}>
                                {selections[name].map(option => (
                                    <Picker.Item key={option} value={option}>
                                    {option}
                                    </Picker.Item>
                                ))}
                            </Picker.Column>
                            ))}
                                </Picker>*/}
                        <CustomCounter count={countPicker} setCount={setCountPicker}/>
                    </div>
                </div>
                {change?<input type="button" value={"اعمال تغییرات✓"} className="updatePriceBtn"
                    onClick={(e)=>updateChanges()}/>:<></>}
                <small className="errorSmall quickError" style={{color:error.color}}>
                {error.message}</small>
            </div>
        </div>
        </>
    )
}
export default QuickCartMobileRow