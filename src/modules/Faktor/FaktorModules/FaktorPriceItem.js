import { useState } from "react"
import Counter from "../../../components/Counter"
import env, { normalPriceCount } from "../../../env"

function FaktorPriceItem(props){
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
    const faktor = props.faktor
    const token = props.token
    const user = props.users
    const [error,setError] = useState({message:'',color:"brown"})

    
    const setCount=(count,itemId,price,faktorPrice)=>{
        //console.log(faktorPrice)
        if(price)faktorPrice.find(item=>item.saleType===props.payValue).price = price
        
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:user?user._id:(token&&token.userId),
                    cartItem:itemId?{id:itemId,count:count,price:faktorPrice}:{},payValue:props.payValue})
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
                else props.setFaktorList(result) 
            },
            (error) => {
                console.log(error)
            })
    }
    if(faktor.price)
        return(
        <tr style={{backgroundColor:"#EEEFFC"}}>
            <td>{props.index+1}</td>
            <td className="tdHolder">
                <strong>{faktor.title}</strong>
                <small>{faktor.sku}</small></td>
            <td><div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                <Counter count={faktor.count||''} 
                        setCount={setCount} itemId={faktor.id}/>
                </div></td>
            <td>
                <input type="text" value={normalPriceCount(
                    faktor.price.find(item=>item.saleType===props.payValue).price,1)}
                className="counterInput priceInput"
                onChange={(e)=>//e.key==="Enter"?
                setCount(faktor.count,faktor.id
                    ,e.target.value,faktor.price)}/></td>
            {/*<td>{normalPriceCount(faktor.discount,1)}</td>*/}
            <td>{normalPriceCount(faktor.price.find(item=>item.saleType===props.payValue).price
                ,"0.09",faktor.count)}</td>
            <td>{normalPriceCount(faktor.price.find(item=>item.saleType===props.payValue).price
                ,"1.09",faktor.count)}</td>
            {/*<td>{faktor.description}</td>*/}
            <td><div className="removeBtn" onClick={()=>removeItem(faktor.id)}>حـذف</div></td>
        </tr>
    )
    else
    return(<tr>Waiting</tr>)
}
export default FaktorPriceItem