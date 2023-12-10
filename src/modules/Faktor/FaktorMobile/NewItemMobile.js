import { useState } from "react";
import env from "../../../env";
import Counter from "../../../components/Counter";
import WaitingBtn from "../../../components/Button/waitingBtn";
import { useEffect } from "react";
import ItemSelector from "./ItemSelector";
import ItemCounter from "./ItemCounter";
import PriceSet from "./PriceSet";
import BarCodeFaktor from "../FaktorModules/FaktorBarCode";
import CustomCounter from "../../../components/CustomCounter";

function NewItemMobile(props){
    const token = props.token
    const [error,setError] = useState({message:'',color:"brown"})
    const [count,setCount] = useState("1")
    const [item,setItem] = useState("")
    const [clear,setClear] = useState("")
    const [newShow,setNewShow] = useState(1)
    const [barCodeMode,setBarCodeMode] = useState(0)
    const RegisterNow=()=>{
        setNewShow(0)
        if(!item.priceData||!item.priceData.length)
            return
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:props.users?props.users._id:(token&&token.userId),
                date:Date.now,cartItem:{id:item.ItemID,sku:item.sku,
                    title:item.title,count:count?count:1,
                    price:item.priceData
                    },
                    payValue:props.payValue})
          }
          //console.log(item.priceData)
        fetch(env.siteApi + "/product/update-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setNewShow(1)
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    setError({message:"کالا اضافه شد",color:"green"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),1000)
                    props.setFaktorList(result)
                    setItem('')
                    setClear(clear+1)
                    setCount("1")
                }
            },
            (error) => {
                console.log(error)
            })
    }

    return(<>
        <div className="form-box-style">
            <div className="row">
                <div className="col-md-6" style={{position:"relative"}}>
                {barCodeMode?
                    <BarCodeFaktor setItem={setItem} setBarCodeMode={setBarCodeMode}/>:
                    newShow?<ItemSelector item={item} setItem={setItem} 
                        token={token} setError={setError} clear={clear}/>:<></>}
                {!barCodeMode?<input className="barCodeBtn" onClick={()=>setBarCodeMode(1)} 
                    value={"BarCode"} type="button"/>:<></>}
                </div> 
                
                <hr/>
                <div className="col-md-6">
                    {/*<div className="form-field-fiin">
                        <div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                            <Counter count={''} setCount={setCount} />
                        </div>
                    </div>*/}
                    {newShow?<CustomCounter count={count} setCount={setCount} double={1}/>:<></>}{/*<ItemCounter count={count} setCount={setCount}/>:<></>}*/}
                </div><hr/>
                <div className="col-md-6">
                    {item?<PriceSet item={item} count={count} payValue={props.payValue}/>:<></>}
                </div>
            </div>
            <div className="footer-form-fiin">
                <WaitingBtn class="btn-fiin fullWidth" title={"افزودن"} 
                        waiting={'افزودن'}
                        function={RegisterNow} name="submit" error={error}/>
            </div>
        </div>
        <small className="errorSmall" style={{color:error.color}}>
            {error.message}</small>
    </>
    )
}
export default NewItemMobile